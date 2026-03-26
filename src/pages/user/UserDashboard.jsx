import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SolarisLayout from '../../components/layout/SolarisLayout';
import api from '../../services/api';
import '../../styles/solaris-layout.css';

export default function UserDashboard() {
    const [stats, setStats] = useState({ applied: 0, shortlisted: 0, saved: 0 });
    const [recentJobs, setRecentJobs] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(true);

    useEffect(() => {
        // Fetch dashboard stats
        api.get('/user/dashboard').then(res => {
            setStats({
                applied: res.data.totalApplications || 0,
                shortlisted: res.data.shortlistedCount || 0,
                saved: res.data.savedJobsCount || 0,
            });
        }).catch(() => {});

        // Fetch smart recommendations
        api.get('/user/recommendations').then(res => {
            setRecentJobs(res.data);
            setLoadingRecs(false);
        }).catch(() => setLoadingRecs(false));
    }, []);

    const getMatchColor = (percent) => {
        if (!percent || percent < 40) return '#ef4444'; 
        if (percent < 75) return '#f59e0b'; 
        return '#10b981'; 
    };

    return (
        <SolarisLayout>
            <div className="bento-grid">
                {/* Greeting & Quick Stats */}
                <div className="bento-item" style={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '38px', marginBottom: '12px', background: 'var(--grad-solaris)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Welcome to Solaris, Prism.
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '500px' }}>
                            Your professional evolution is in progress. We've algorithmically matched new positions for your trajectory.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)' }}>{stats.applied}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Applied</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-secondary)' }}>{stats.shortlisted}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shortlisted</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-accent)' }}>{stats.saved}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Saved</div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Recent Jobs */}
                <div className="bento-item" style={{ gridColumn: 'span 8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '22px' }}>Curated Intelligence Matrix</h2>
                        <Link to="/user/jobs" style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>View All →</Link>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {loadingRecs ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Calculating matches...</div>
                        ) : recentJobs.length > 0 ? recentJobs.map(job => (
                            <div key={job.id} style={{ 
                                padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', 
                                border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ 
                                        width: '48px', height: '48px', borderRadius: '50%', 
                                        border: `2px solid ${getMatchColor(job.matchPercentage)}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '12px', fontWeight: 800, color: getMatchColor(job.matchPercentage)
                                    }}>
                                        {job.matchPercentage || 0}%
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '17px', color: '#fff', marginBottom: '4px' }}>{job.title}</h4>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{job.companyName} • {job.location}</p>
                                    </div>
                                </div>
                                <Link to={`/user/jobs/${job.id}`} className="solaris-btn" style={{ padding: '8px 20px', fontSize: '14px', width: 'auto' }}>Engage</Link>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                No highly compatible recommendations at the moment. Explore Browse Jobs.
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Strength */}
                <div className="bento-item" style={{ gridColumn: 'span 4' }}>
                   <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Solaris Identity Status</h2>
                   <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                       <div style={{ width: '85%', height: '100%', background: 'var(--grad-solaris)' }}></div>
                   </div>
                   <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                       Identity Strength: <span style={{ color: '#fff', fontWeight: 600 }}>85%</span>
                   </p>
                   
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--color-secondary)' }}>✓</span> Email Verified
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--color-secondary)' }}>✓</span> Skill Matrix Active
                        </div>
                   </div>
                </div>
            </div>
        </SolarisLayout>
    );
}
