import { useState, useEffect } from 'react';
import SolarisLayout from '../../components/layout/SolarisLayout';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import '../../styles/solaris-layout.css';

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const toast = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        api.get('/admin/users').then(res => setUsers(res.data)).catch(() => {});
    };

    const toggleStatus = async (userId, currentStatus) => {
        const action = currentStatus ? 'Deactivate' : 'Activate';
        if (!window.confirm(`Are you sure you want to ${action} this candidate?`)) return;
        try {
            await api.post(`/admin/users/${userId}/status?active=${!currentStatus}`);
            toast.success(`Candidate identity ${currentStatus ? 'suspended' : 'restored'}.`);
            fetchUsers();
        } catch (err) {
            toast.error(err);
        }
    };

    return (
        <SolarisLayout>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Identity Oversight</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Govern all Candidate nodes within the Solaris ecosystem.</p>
            </div>

            <div className="bento-item">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>IDENTIFIER</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>STATUS</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>METRICS</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '24px 20px' }}>
                                    <div style={{ fontWeight: 600, color: '#fff' }}>{u.fullName}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</div>
                                </td>
                                <td style={{ padding: '24px 20px' }}>
                                    {u.active ? (
                                        <span style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>ACTIVE</span>
                                    ) : (
                                        <span style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>SUSPENDED</span>
                                    )}
                                </td>
                                <td style={{ padding: '24px 20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                    <div>Exp: {u.yearsOfExperience} Yrs</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Apps: {u.applicationCount || 0}</div>
                                </td>
                                <td style={{ padding: '24px 20px' }}>
                                    <button 
                                        onClick={() => toggleStatus(u.id, u.active)} 
                                        style={{ 
                                            padding: '6px 12px', 
                                            background: u.active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                                            color: u.active ? '#ef4444' : '#10b981', 
                                            border: `1px solid ${u.active ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`, 
                                            borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                                        }}
                                    >
                                        {u.active ? 'Suspend' : 'Restore'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SolarisLayout>
    );
}
