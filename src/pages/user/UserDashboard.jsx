import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

// Mock data removed

// Mock data removed

const STATUS_MAP = {
    APPLIED: { label: 'Applied', cls: 'badge--primary' },
    SHORTLISTED: { label: 'Shortlisted', cls: 'badge--success' },
    REJECTED: { label: 'Rejected', cls: 'badge--danger' },
    SELECTED: { label: 'Selected', cls: 'badge--info' },
};

export default function UserDashboard() {
    const { user } = useAuth();
    const toast = useToast();
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                // Fetch stats
                const statsRes = await userService.getDashboardStats();
                if (statsRes?.data) {
                    setStats(statsRes.data.stats || statsRes.data || null);
                }

                // Fetch recent applications (real applications, not all jobs)
                const appsRes = await userService.getMyApplications();
                if (appsRes?.data) {
                    // Show top 4 as recent, map from ApplicationResponse
                    setRecent(appsRes.data.slice(0, 4).map(a => ({
                        id: a.applicationId,
                        jobTitle: a.jobTitle,
                        companyName: a.companyName || 'N/A',
                        status: a.status
                    })));
                }
            } catch (err) {
                console.error('User Dashboard Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const statCards = stats ? [
        { label: 'Total Applications', value: stats.totalApplications, icon: '📋', variant: 'primary' },
        { label: 'Saved Jobs', value: stats.savedJobs, icon: '❤️', variant: 'warning' },
        { label: 'Active', value: stats.activeApplications, icon: '✅', variant: 'success' },
        { label: 'Rejected', value: stats.rejectedApplications, icon: '❌', variant: 'danger' },
    ] : [];

    const pieData = [
        { name: 'Applied', value: stats?.applicationsByStatus?.APPLIED || 0, color: '#6366f1' },
        { name: 'Shortlisted', value: stats?.applicationsByStatus?.SHORTLISTED || 0, color: '#10b981' },
        { name: 'Rejected', value: stats?.applicationsByStatus?.REJECTED || 0, color: '#ef4444' },
    ];

    return (
        <div className="page-enter">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-header__title">
                    Welcome back, {user?.name || user?.username || 'Candidate'} 👋
                </h1>
                <p className="page-header__subtitle">
                    Here's your job search overview at a glance.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {statCards.map((s, i) => (
                    <div key={s.label} className={`stats-card anim-fade-in delay-${i + 1}`}>
                        <div className={`stats-card__icon stats-card__icon--${s.variant}`}>{s.icon}</div>
                        <div className="stats-card__label">{s.label}</div>
                        <div className="stats-card__value">{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Charts + Recent */}
            <div className="charts-grid">
                {/* Pie Chart */}
                <div className="chart-card anim-fade-in delay-2">
                    <div className="chart-card__header">
                        <div>
                            <div className="chart-card__title">Application Status</div>
                            <div className="chart-card__subtitle">Distribution of your applications</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {pieData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: 'var(--color-bg-card2)', border: '1px solid var(--color-border)', borderRadius: '10px', color: 'var(--color-text-primary)' }}
                            />
                            <Legend
                                formatter={(value) => <span style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Quick Links */}
                <div className="chart-card anim-fade-in delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <div className="chart-card__title">Quick Actions</div>
                        <div className="chart-card__subtitle">Jump to common tasks</div>
                    </div>
                    {[
                        { icon: '🔍', label: 'Browse All Jobs', sub: 'Find your next opportunity', to: '/user/jobs', btn: 'Browse' },
                        { icon: '📋', label: 'My Applications', sub: 'Track your job applications', to: '/user/applications', btn: 'View All' },
                        { icon: '❤️', label: 'Saved Jobs', sub: 'Jobs you bookmarked', to: '/user/saved', btn: 'View' },
                    ].map((item) => (
                        <div key={item.label} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '14px 16px', background: 'rgba(255,255,255,0.03)',
                            borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
                            transition: 'all 0.2s ease',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '22px' }}>{item.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{item.label}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{item.sub}</div>
                                </div>
                            </div>
                            <Link to={item.to} className="btn btn--secondary btn--sm">{item.btn} →</Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Applications */}
            <div className="table-container anim-fade-in delay-4">
                <div className="table-header">
                    <div>
                        <div className="section-title" style={{ marginBottom: 0 }}>Recent Applications</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Your latest job applications</div>
                    </div>
                    <Link to="/user/applications" className="btn btn--secondary btn--sm">View All →</Link>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Company</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recent.map((app) => {
                            const s = STATUS_MAP[app.status] || STATUS_MAP.APPLIED;
                            return (
                                <tr key={app.id}>
                                    <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{app.jobTitle}</td>
                                    <td>{app.companyName}</td>
                                    <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
