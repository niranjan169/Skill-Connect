import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { adminService } from '../../services/adminService';

// Mock data removed
const ttStyle = { background: 'var(--color-bg-card2)', border: '1px solid var(--color-border)', borderRadius: '10px', color: 'var(--color-text-primary)' };

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await adminService.getDashboardStats();
                if (res?.data) setStats(res.data);
            } catch { }
        })();
    }, []);

    const statCards = stats ? [
        { label: 'Total Users', value: stats.totalUsers, icon: '👥', v: 'primary' },
        { label: 'Recruiters', value: stats.totalRecruiters, icon: '🏢', v: 'secondary' },
        { label: 'Active Jobs', value: stats.totalJobs, icon: '💼', v: 'success' },
        { label: 'Total Applications', value: stats.totalApplications, icon: '📋', v: 'warning' },
    ] : [];

    return (
        <div className="page-enter">
            <div className="page-header">
                <h1 className="page-header__title">Admin Dashboard 🛡️</h1>
                <p className="page-header__subtitle">Platform-wide analytics and management</p>
            </div>

            <div className="stats-grid">
                {statCards.map((s, i) => (
                    <div key={s.label} className={`stats-card anim-fade-in delay-${i + 1}`}>
                        <div className={`stats-card__icon stats-card__icon--${s.v}`}>{s.icon}</div>
                        <div className="stats-card__label">{s.label}</div>
                        <div className="stats-card__value">{s.value.toLocaleString()}</div>
                    </div>
                ))}
            </div>

            {/* Line chart */}
            <div className="chart-card anim-fade-in delay-2" style={{ marginBottom: '24px' }}>
                <div className="chart-card__header">
                    <div>
                        <div className="chart-card__title">Platform Growth</div>
                        <div className="chart-card__subtitle">Users and applications over the past 7 months</div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart
                        data={stats?.platformGrowth ? Object.entries(stats.platformGrowth).map(([month, users]) => ({ month, users })) : []}
                        margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={ttStyle} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                        <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} name="New Users" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Quick links */}
            <div className="grid grid-4 anim-fade-in delay-3">
                {[
                    { icon: '👥', label: 'Manage Users', to: '/admin/users' },
                    { icon: '🏢', label: 'Manage Recruiters', to: '/admin/recruiters' },
                    { icon: '💼', label: 'Manage Jobs', to: '/admin/jobs' },
                    { icon: '📋', label: 'All Applications', to: '/admin/applications' },
                ].map((item) => (
                    <Link key={item.label} to={item.to} className="card" style={{ textDecoration: 'none', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-hover)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'none'; }}
                    >
                        <div style={{ fontSize: '36px', marginBottom: '10px' }}>{item.icon}</div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>{item.label}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
