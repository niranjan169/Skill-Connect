import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SolarisLayout from '../../components/layout/SolarisLayout';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import '../../styles/solaris-layout.css';

export default function ManageJobsPage() {
    const [jobs, setJobs] = useState([]);
    const toast = useToast();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = () => {
        api.get('/recruiter/jobs').then(res => setJobs(res.data)).catch(() => {});
    };

    return (
        <SolarisLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Asset Management</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Oversee your broadcasted opportunities and acquisition metrics.</p>
                </div>
                <Link to="/recruiter/jobs/create" className="solaris-btn" style={{ width: 'auto', padding: '14px 32px' }}>+ New Position</Link>
            </div>

            <div className="bento-grid">
                {jobs.length > 0 ? jobs.map(job => (
                    <div key={job.id} className="bento-item" style={{ gridColumn: 'span 6', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '4px' }}>{job.title}</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Active Matrix'}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)' }}>{job.applicationCount || 0}</div>
                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>APPLICANTS</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                             <div style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>TYPE</div>
                                <div style={{ fontSize: '13px', fontWeight: 600 }}>{job.jobType?.replace('_', ' ') || 'FULL TIME'}</div>
                             </div>
                             <div style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>LOCATION</div>
                                <div style={{ fontSize: '13px', fontWeight: 600 }}>{job.location}</div>
                             </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
                            <Link to={`/recruiter/applications?jobId=${job.id}`} className="solaris-btn" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--color-secondary)', border: '1px solid rgba(16,185,129,0.2)', padding: '10px 0', flex: 1 }}>View Applicants</Link>
                        </div>
                    </div>
                )) : (
                    <div className="bento-item" style={{ gridColumn: 'span 12', textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
                        Primary broadcast array is empty. <Link to="/recruiter/jobs/create" className="auth-link">Create your first job</Link> to begin.
                    </div>
                )}
            </div>
        </SolarisLayout>
    );
}
