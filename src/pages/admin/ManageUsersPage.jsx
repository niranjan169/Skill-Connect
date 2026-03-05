import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';

// Mock data removed

export default function ManageUsersPage() {
    const toast = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await adminService.getAllUsers();
                if (res?.data) {
                    const mapped = res.data.map(u => ({
                        ...u,
                        userId: u.id,
                        name: u.fullName || 'Unknown',
                        applicationCount: u.applicationCount || 0
                    }));
                    setUsers(mapped);
                }
            } catch (err) {
                toast.error(err.message || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleToggle = async (userId, active) => {
        try {
            await adminService.blockUser(userId, !active);
            setUsers((prev) => prev.map((u) => u.userId === userId ? { ...u, active: !active } : u));
            toast.success(`User ${active ? 'blocked' : 'activated'} successfully.`);
        } catch (err) { toast.error(err.message); }
    };

    const filtered = users.filter((u) => {
        const q = search.toLowerCase();
        return !q ||
            (u.name && u.name.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q));
    });

    return (
        <div className="page-enter">
            <div className="page-header">
                <h1 className="page-header__title">Manage Users</h1>
                <p className="page-header__subtitle">{users.length} registered candidates on the platform</p>
            </div>

            <div className="search-input-wrapper" style={{ marginBottom: '24px', maxWidth: '380px' }}>
                <span className="search-icon">🔍</span>
                <input className="form-input" placeholder="Search users…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr><th>User</th><th>Location</th><th>Experience</th><th>Skills</th><th>Applications</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}><span className="spinner" /> Loading users...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>No users found.</td></tr>
                        ) : (
                            filtered.map((u) => (
                                <tr key={u.userId}>
                                    <td>
                                        <div
                                            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                                            onClick={() => setSelectedUser(u)}
                                        >
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '13px', flexShrink: 0 }}>
                                                {u.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', textDecoration: 'underline' }}>{u.name}</div>
                                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{u.location}</td>
                                    <td>{u.yearsOfExperience > 0 ? `${u.yearsOfExperience} yrs` : 'Fresher'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            {u.skills?.slice(0, 2).map((s) => <span key={s} className="badge badge--primary" style={{ fontSize: '10px' }}>{s}</span>)}
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{u.applicationCount}</td>
                                    <td>
                                        {u.active
                                            ? <span className="badge badge--success">Active</span>
                                            : <span className="badge badge--danger">Blocked</span>}
                                    </td>
                                    <td>
                                        <button
                                            className={`btn btn--sm ${u.active ? 'btn--danger' : 'btn--success'}`}
                                            onClick={() => handleToggle(u.userId, u.active)}
                                        >
                                            {u.active ? '🚫 Block' : '✅ Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: 'white' }}>
                                    {selectedUser.name?.charAt(0)}
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, color: 'var(--color-text-primary)' }}>{selectedUser.name}</h2>
                                    <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{selectedUser.email}</p>
                                </div>
                            </div>
                            <button className="btn btn--ghost" onClick={() => setSelectedUser(null)}>✕</button>
                        </div>

                        <div className="grid grid-2" style={{ gap: '24px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Location</label>
                                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedUser.location || 'N/A'}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Experience</label>
                                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                    {selectedUser.yearsOfExperience > 0 ? `${selectedUser.yearsOfExperience} years` : 'Fresher'}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Education</label>
                                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedUser.education || 'N/A'}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Total Applications</label>
                                <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{selectedUser.applicationCount}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Skills & Expertise</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {selectedUser.skills?.length > 0 ? (
                                    selectedUser.skills.map(s => (
                                        <span key={s} className="badge badge--primary">{s}</span>
                                    ))
                                ) : (
                                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No skills listed</span>
                                )}
                            </div>
                        </div>

                        {selectedUser.resumeUrl && (
                            <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', background: 'var(--gradient-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '14px' }}>Resume Attached</div>
                                    <div style={{ fontSize: '11px', opacity: 0.8 }}>Candidate-Resume-V1.pdf</div>
                                </div>
                                <a href={selectedUser.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn--sm" style={{ background: 'white', color: 'var(--color-primary)' }}>
                                    Download
                                </a>
                            </div>
                        )}

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>User Skills</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {selectedUser.skills?.map(sk => (
                                    <span key={sk} className="badge badge--primary">{sk}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Account Security</label>
                            <div style={{ padding: '12px', borderRadius: '12px', background: selectedUser.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                <div style={{ fontWeight: 700, color: selectedUser.active ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                    {selectedUser.active ? 'User Account is Active' : 'User Account is Blocked'}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                            <button className={`btn ${selectedUser.active ? 'btn--danger' : 'btn--success'} btn--full`} onClick={() => { handleToggle(selectedUser.userId, selectedUser.active); setSelectedUser(null); }}>
                                {selectedUser.active ? '🚫 Block User' : '✅ Activate User'}
                            </button>
                            <button className="btn btn--secondary btn--full" onClick={() => setSelectedUser(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
