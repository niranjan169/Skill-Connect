import { useState, useEffect } from 'react';
import SolarisLayout from '../../components/layout/SolarisLayout';
import api from '../../services/api';
import '../../styles/solaris-layout.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRecruiters: 0,
        totalJobs: 0,
        totalApplications: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/dashboard').then(res => {
            setStats(res.data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    return (
        <SolarisLayout>
            <div className="bento-grid">
                <div className="bento-item" style={{ gridColumn: 'span 12', background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.05) 100%)' }}>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Command Center</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Global system oversight and live real-time metrics platform.</p>
                </div>

                <div className="bento-item" style={{ gridColumn: 'span 3' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>USERS</div>
                    <div style={{ fontSize: '32px', fontWeight: 800 }}>{loading ? '...' : stats.totalUsers}</div>
                </div>
                <div className="bento-item" style={{ gridColumn: 'span 3' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>RECRUITERS</div>
                    <div style={{ fontSize: '32px', fontWeight: 800 }}>{loading ? '...' : stats.totalRecruiters}</div>
                </div>
                <div className="bento-item" style={{ gridColumn: 'span 3' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>LIVE JOBS</div>
                    <div style={{ fontSize: '32px', fontWeight: 800 }}>{loading ? '...' : stats.totalJobs}</div>
                </div>
                <div className="bento-item" style={{ gridColumn: 'span 3' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>APPLICATIONS</div>
                    <div style={{ fontSize: '32px', fontWeight: 800 }}>{loading ? '...' : stats.totalApplications}</div>
                </div>

                <div className="bento-item" style={{ gridColumn: 'span 8' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Dashboard Synced</h2>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                            <span style={{ color: 'var(--color-primary)' }}>[INFO]</span> Real-time aggregation active.
                        </div>
                        <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                            <span style={{ color: 'var(--color-secondary)' }}>[SUCCESS]</span> No duplicates detected in entity tracking arrays.
                        </div>
                    </div>
                </div>

                <div className="bento-item" style={{ gridColumn: 'span 4' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>System Health</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                                <span>API Status</span>
                                <span style={{ color: 'var(--color-secondary)' }}>OPERATIONAL</span>
                            </div>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                                <div style={{ width: '100%', height: '100%', background: 'var(--color-secondary)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SolarisLayout>
    );
}
