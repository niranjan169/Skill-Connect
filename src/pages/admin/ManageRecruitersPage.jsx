import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';

export default function ManageRecruitersPage() {
    const toast = useToast();
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedRecruiter, setSelectedRecruiter] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await adminService.getAllRecruiters();
                if (res?.data) {
                    const mapped = res.data.map(r => ({
                        ...r,
                        recruiterId: r.id, // backend ID
                        name: r.userName || 'Unknown',
                        email: r.userEmail || 'N/A',
                        location: r.companyLocation || 'N/A',
                        active: r.userActive,
                        jobCount: r.jobCount || 0
                    }));
                    setRecruiters(mapped);
                }
            } catch (err) {
                toast.error(err.message || 'Failed to fetch recruiters');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleApprove = async (id) => {
        try {
            await adminService.approveRecruiter(id);
            setRecruiters((prev) => prev.map((r) => r.recruiterId === id ? { ...r, approved: true } : r));
            toast.success('Recruiter approved!');
        } catch (err) { toast.error(err.message); }
    };

    const handleBlock = async (id, active) => {
        try {
            await adminService.blockRecruiter(id, !active);
            setRecruiters((prev) => prev.map((r) => r.recruiterId === id ? { ...r, active: !active } : r));
            toast.success(`Recruiter ${active ? 'blocked' : 'activated'}.`);
        } catch (err) { toast.error(err.message); }
    };

    const filtered = recruiters.filter((r) => {
        const q = search.toLowerCase();
        return !q ||
            (r.name && r.name.toLowerCase().includes(q)) ||
            (r.companyName && r.companyName.toLowerCase().includes(q));
    });

    return (
        <div className="page-enter">
            <div className="page-header">
                <h1 className="page-header__title">Manage Recruiters</h1>
                <p className="page-header__subtitle">{recruiters.length} recruiters on the platform</p>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                {[
                    { label: 'Total', val: recruiters.length, color: 'var(--color-primary-light)' },
                    { label: 'Pending Approval', val: recruiters.filter((r) => !r.approved).length, color: 'var(--color-warning)' },
                    { label: 'Active', val: recruiters.filter((r) => r.active).length, color: 'var(--color-success)' },
                    { label: 'Blocked', val: recruiters.filter((r) => !r.active).length, color: 'var(--color-danger)' },
                ].map((s) => (
                    <div key={s.label} style={{ padding: '12px 20px', background: 'var(--color-bg-card2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', textAlign: 'center', minWidth: '110px' }}>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: s.color }}>{s.val}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="search-input-wrapper" style={{ marginBottom: '16px', maxWidth: '380px' }}>
                <span className="search-icon">🔍</span>
                <input className="form-input" placeholder="Search recruiters…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr><th>Recruiter</th><th>Company</th><th>Location</th><th>Jobs Posted</th><th>Approval</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}><span className="spinner" /> Loading recruiters...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>No recruiters found.</td></tr>
                        ) : (
                            filtered.map((r) => (
                                <tr key={r.recruiterId}>
                                    {/* ... existing cells ... */}
                                    <td>
                                        <div
                                            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                                            onClick={() => setSelectedRecruiter(r)}
                                        >
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '13px', flexShrink: 0 }}>
                                                {r.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', textDecoration: 'underline' }}>{r.name}</div>
                                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{r.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{r.companyName}</td>
                                    <td>{r.location}</td>
                                    <td style={{ fontWeight: 600, textAlign: 'center' }}>{r.jobCount}</td>
                                    <td>
                                        {r.approved
                                            ? <span className="badge badge--success">✓ Approved</span>
                                            : <span className="badge badge--warning">⏳ Pending</span>}
                                    </td>
                                    <td>
                                        {r.active ? <span className="badge badge--success">Active</span> : <span className="badge badge--danger">Blocked</span>}
                                    </td>
                                    <td>
                                        <div className="table__actions">
                                            {!r.approved && (
                                                <button className="btn btn--success btn--sm" onClick={() => handleApprove(r.recruiterId)}>✓ Approve</button>
                                            )}
                                            <button
                                                className={`btn btn--sm ${r.active ? 'btn--danger' : 'btn--success'}`}
                                                onClick={() => handleBlock(r.recruiterId, r.active)}
                                            >
                                                {r.active ? '🚫 Block' : '✅ Activate'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Recruiter Details Modal */}
            {selectedRecruiter && (
                <div className="modal-overlay" onClick={() => setSelectedRecruiter(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--gradient-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: 'white' }}>
                                    {selectedRecruiter.name?.charAt(0)}
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, color: 'var(--color-text-primary)' }}>{selectedRecruiter.name}</h2>
                                    <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{selectedRecruiter.email}</p>
                                </div>
                            </div>
                            <button className="btn btn--ghost" onClick={() => setSelectedRecruiter(null)}>✕</button>
                        </div>

                        <div className="grid grid-2" style={{ gap: '24px', marginBottom: '24px' }}>
                            <div className="card" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Company Details</label>
                                <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{selectedRecruiter.companyName}</div>
                                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>📍 {selectedRecruiter.location}</div>
                                {selectedRecruiter.companyWebsite && (
                                    <a href={selectedRecruiter.companyWebsite} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--color-primary)', textDecoration: 'none' }}>
                                        🔗 Visit Website
                                    </a>
                                )}
                            </div>
                            <div className="card" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Platform Activity</label>
                                <div style={{ fontWeight: 700, fontSize: '24px', color: 'var(--color-primary)' }}>{selectedRecruiter.jobCount}</div>
                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Total Jobs Posted</div>
                            </div>
                        </div>

                        {selectedRecruiter.aboutCompany && (
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>About Company</label>
                                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                    {selectedRecruiter.aboutCompany}
                                </div>
                            </div>
                        )}

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Account Status</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1, padding: '12px', borderRadius: '12px', background: selectedRecruiter.approved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Approval</div>
                                    <div style={{ fontWeight: 700, color: selectedRecruiter.approved ? 'var(--color-success)' : 'var(--color-warning)' }}>
                                        {selectedRecruiter.approved ? 'Approved' : 'Pending Approval'}
                                    </div>
                                </div>
                                <div style={{ flex: 1, padding: '12px', borderRadius: '12px', background: selectedRecruiter.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Access</div>
                                    <div style={{ fontWeight: 700, color: selectedRecruiter.active ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                        {selectedRecruiter.active ? 'Active' : 'Blocked'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                            {!selectedRecruiter.approved && (
                                <button className="btn btn--success btn--full" onClick={() => { handleApprove(selectedRecruiter.recruiterId); setSelectedRecruiter(null); }}>
                                    ✓ Approve Recruiter
                                </button>
                            )}
                            <button className={`btn ${selectedRecruiter.active ? 'btn--danger' : 'btn--success'} btn--full`} onClick={() => { handleBlock(selectedRecruiter.recruiterId, selectedRecruiter.active); setSelectedRecruiter(null); }}>
                                {selectedRecruiter.active ? '🚫 Block Access' : '✅ Restore Access'}
                            </button>
                            <button className="btn btn--secondary btn--full" onClick={() => setSelectedRecruiter(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
