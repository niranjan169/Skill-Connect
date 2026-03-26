import { useState, useEffect } from 'react';
import SolarisLayout from '../../components/layout/SolarisLayout';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import '../../styles/solaris-layout.css';

export default function ManageRecruitersPage() {
    const [recruiters, setRecruiters] = useState([]);
    const toast = useToast();

    useEffect(() => {
        fetchRecruiters();
    }, []);

    const fetchRecruiters = () => {
        api.get('/admin/recruiters').then(res => setRecruiters(res.data)).catch(() => {});
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Approve this organization for hiring?')) return;
        try {
            await api.post(`/admin/recruiters/${id}/approve`);
            toast.success('Organization verified and approved.');
            fetchRecruiters();
        } catch (err) {
            toast.error(err);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        const action = currentStatus ? 'Deactivate' : 'Activate';
        if (!window.confirm(`Are you sure you want to ${action} this recruiter's access?`)) return;
        try {
            await api.post(`/admin/users/${userId}/status?active=${!currentStatus}`);
            toast.success(`Recruiter access ${currentStatus ? 'suspended' : 'restored'}.`);
            fetchRecruiters();
        } catch (err) {
            toast.error(err);
        }
    };

    return (
        <SolarisLayout>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Corporate Registry</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Govern all hiring principals and orchestrate corporate approvals.</p>
            </div>

            <div className="bento-item">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>ORGANIZATION</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>STATUS</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>CONTACT</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recruiters.map(r => (
                            <tr key={r.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '24px 20px' }}>
                                    <div style={{ fontWeight: 600, color: '#fff' }}>{r.companyName}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--color-primary)' }}>{r.companyWebsite}</div>
                                </td>
                                <td style={{ padding: '24px 20px' }}>
                                    <div style={{ marginBottom: '6px' }}>
                                        {r.approved ? (
                                            <span style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>VERIFIED</span>
                                        ) : (
                                            <span style={{ padding: '4px 8px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>PENDING</span>
                                        )}
                                    </div>
                                    <div>
                                        {r.userActive ? (
                                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Access: Active</span>
                                        ) : (
                                            <span style={{ fontSize: '11px', color: '#ef4444' }}>Access: Suspended</span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ padding: '24px 20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                    <div style={{ color: '#fff' }}>{r.userName}</div>
                                    <div>{r.userEmail}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Jobs: {r.jobCount || 0}</div>
                                </td>
                                <td style={{ padding: '24px 20px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {!r.approved && (
                                            <button onClick={() => handleApprove(r.id)} className="solaris-btn" style={{ padding: '6px 12px', fontSize: '12px', width: 'auto' }}>Approve</button>
                                        )}
                                        <button 
                                            onClick={() => toggleUserStatus(r.userId, r.userActive)} 
                                            style={{ 
                                                padding: '6px 12px', 
                                                background: r.userActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                                                color: r.userActive ? '#ef4444' : '#10b981', 
                                                border: `1px solid ${r.userActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`, 
                                                borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                                            }}
                                        >
                                            {r.userActive ? 'Suspend' : 'Restore'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SolarisLayout>
    );
}
