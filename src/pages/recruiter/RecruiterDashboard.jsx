import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SolarisLayout from '../../components/layout/SolarisLayout';
import api from '../../services/api';
import '../../styles/solaris-layout.css';

export default function RecruiterDashboard() {
    const [stats, setStats] = useState({ activeJobs: 0, totalApps: 0, shortlisted: 0, companyName: '' });
    const [recentCandidates, setRecentCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/recruiter/dashboard').then(res => {
            setStats({
                activeJobs: res.data.totalJobsPosted || res.data.totalJobs || 0,
                totalApps: res.data.totalApplications || 0,
                shortlisted: res.data.shortlistedCandidates || res.data.shortlisted || 0,
                companyName: res.data.companyName || ''
            });
            setRecentCandidates(res.data.recentCandidates || []);
        }).catch(() => {
        }).finally(() => setLoading(false));
    }, []);

    return (
        <SolarisLayout>
            <div className="bento-grid">
                <div className="bento-item" style={{ gridColumn: 'span 12' }}>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Recruiter Hub: {stats.companyName || 'Solaris Enterprise'}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your workspace and acquire top-tier Solaris talent.</p>
                </div>

                <div className="bento-item" style={{ gridColumn: 'span 4' }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '10px' }}>ACTIVE POSITIONS</div>
                    <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--color-primary)' }}>{loading ? '...' : stats.activeJobs}</div>
                    <div style={{ marginTop: '15px' }}>
                        <Link to="/recruiter/jobs/create" className="solaris-btn" style={{ padding: '8px 16px', fontSize: '13px', width: 'auto' }}>
                            + Post New Job
                        </Link>
                    </div>
                </div>

                <div className="bento-item" style={{ gridColumn: 'span 4' }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '10px' }}>TOTAL APPLICATIONS</div>
                    <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--color-secondary)' }}>{loading ? '...' : stats.totalApps}</div>
                    <div style={{ marginTop: '15px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--color-secondary)' }}>↑ 12%</span> active momentum
                    </div>
                </div>

                <div className="bento-item" style={{ gridColumn: 'span 4' }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '10px' }}>SHORTLISTED</div>
                    <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--color-accent)' }}>{loading ? '...' : stats.shortlisted}</div>
                    <div style={{ marginTop: '15px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Precision recruitment active
                    </div>
                </div>

                <div className="bento-item" style={{ gridColumn: 'span 7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px' }}>Recent Candidates</h2>
                        <Link to="/recruiter/applications" style={{ color: 'var(--color-primary)', fontSize: '14px', textDecoration: 'none' }}>View All →</Link>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentCandidates.length > 0 ? recentCandidates.slice(0, 5).map(app => (
                            <div key={app.id} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{app.candidateName}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.jobTitle} • {app.matchPercentage}% match</div>
                                </div>
                                <div style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: 'var(--color-primary)' }}>{app.status}</div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '16px' }}>
                                Waiting for new applications...
                            </div>
                        )}
                    </div>
                </div>

                <div className="bento-item" style={{ gridColumn: 'span 5' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Quick Actions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {['Review Pending Apps', 'Update Company Profile', 'Contact Solaris Support', 'View System Analytics'].map(act => (
                            <div key={act} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, transition: '0.2s' }}
                                 onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                 onMouseOut={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
                                {act} →
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SolarisLayout>
    );
}
