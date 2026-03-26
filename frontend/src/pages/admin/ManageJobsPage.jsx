import { useState, useEffect } from 'react';
import SolarisLayout from '../../components/layout/SolarisLayout';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import '../../styles/solaris-layout.css';

export default function ManageJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [filter, setFilter] = useState('ALL'); // ALL, PENDING, APPROVED
    const toast = useToast();

    useEffect(() => {
        fetchJobs();
    }, [filter]);

    const fetchJobs = () => {
        // We'll fetch all jobs and filter client side for better UX, or use the pending endpoint
        if (filter === 'PENDING') {
            api.get('/admin/jobs/pending').then(res => setJobs(res.data)).catch(() => {});
        } else {
            api.get('/admin/jobs').then(res => setJobs(res.data)).catch(() => {});
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Authorize this job posting on the Solaris network?')) return;
        try {
            await api.post(`/admin/jobs/${id}/approve`);
            toast.success('Job listing authorized.');
            fetchJobs();
        } catch (err) {
            toast.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Wipe this job listing universally?')) return;
        try {
            await api.delete(`/admin/jobs/${id}`);
            toast.success('Listing permanently erased.');
            fetchJobs();
        } catch (err) {
            toast.error(err);
        }
    };

    return (
        <SolarisLayout>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Global Job Oversight</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Review, approve, and purge listings across the network.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setFilter('ALL')} className={filter === 'ALL' ? 'solaris-btn' : ''} style={{ padding: '8px 16px', background: filter === 'ALL' ? '' : 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>All Jobs</button>
                    <button onClick={() => setFilter('PENDING')} className={filter === 'PENDING' ? 'solaris-btn' : ''} style={{ padding: '8px 16px', background: filter === 'PENDING' ? '' : 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Pending Approval</button>
                </div>
            </div>

            <div className="bento-item">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>POSITION</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>COMPANY</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>STATUS</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(j => (
                            <tr key={j.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '24px 20px' }}>
                                    <div style={{ fontWeight: 600, color: '#fff' }}>{j.title}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{j.location} • {j.jobType}</div>
                                </td>
                                <td style={{ padding: '24px 20px', color: 'var(--text-secondary)' }}>{j.companyName}</td>
                                <td style={{ padding: '24px 20px' }}>
                                    {j.approved ? (
                                        <span style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>LIVE</span>
                                    ) : (
                                        <span style={{ padding: '4px 8px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>PENDING</span>
                                    )}
                                </td>
                                <td style={{ padding: '24px 20px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {!j.approved && (
                                            <button onClick={() => handleApprove(j.id)} className="solaris-btn" style={{ padding: '6px 12px', fontSize: '12px', width: 'auto' }}>Approve</button>
                                        )}
                                        <button onClick={() => handleDelete(j.id)} style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Purge</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No operations mapped in this sector.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </SolarisLayout>
    );
}
