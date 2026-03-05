import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { recruiterService } from '../../services/recruiterService';
import { useAuth } from '../../context/AuthContext';



const STATUS_MAP = {
    APPLIED: { label: 'Applied', cls: 'badge--primary' },
    SHORTLISTED: { label: 'Shortlisted', cls: 'badge--success' },
    REJECTED: { label: 'Rejected', cls: 'badge--danger' },
    SELECTED: { label: 'Selected', cls: 'badge--info' },
};

const ttStyle = { background: 'var(--color-bg-card2)', border: '1px solid var(--color-border)', borderRadius: '10px', color: 'var(--color-text-primary)' };

export default function RecruiterDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await recruiterService.getDashboardStats();
                if (res?.data) {
                    setStats(res.data);
                    setCandidates(res.data.recentCandidates || []);
                }
            } catch { }
        })();
    }, []);

    const statCards = stats ? [
        { label: 'Active Jobs', value: stats.totalJobs, icon: '💼', v: 'primary' },
        { label: 'Total Applications', value: stats.totalApplications, icon: '📋', v: 'secondary' },
        { label: 'Shortlisted', value: stats.shortlisted, icon: '✅', v: 'success' },
        { label: 'Selected', value: stats.selected, icon: '🎉', v: 'info' },
    ] : [];

    return (
        <div className="page-enter">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-header__title">Welcome, {user?.name || user?.username} 🏢</h1>
                    <p className="page-header__subtitle">Manage your job postings and candidates</p>
                </div>
                <Link to="/recruiter/jobs/create" className="btn btn--primary">➕ Post New Job</Link>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                {statCards.map((s, i) => (
                    <div key={s.label} className={`stats-card anim-fade-in delay-${i + 1}`}>
                        <div className={`stats-card__icon stats-card__icon--${s.v}`}>{s.icon}</div>
                        <div className="stats-card__label">{s.label}</div>
                        <div className="stats-card__value">{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Charts + Table */}
            <div className="charts-grid">
                {/* Bar chart */}
                <div className="chart-card anim-fade-in delay-2">
                    <div className="chart-card__header">
                        <div>
                            <div className="chart-card__title">Applications per Job</div>
                            <div className="chart-card__subtitle">Top jobs by applicant count</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                            data={stats?.applicationsPerJob ? Object.entries(stats.applicationsPerJob).map(([name, apps]) => ({ name, apps })) : []}
                            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={ttStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                            <Bar dataKey="apps" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                            <defs>
                                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.7} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Quick stats card */}
                <div className="chart-card anim-fade-in delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <div className="chart-card__title">Quick Links</div>
                        <div className="chart-card__subtitle">Manage your recruitment pipeline</div>
                    </div>
                    {[
                        { icon: '💼', label: 'Manage Jobs', sub: 'Edit or delete your posted jobs', to: '/recruiter/jobs', btn: 'Manage' },
                        { icon: '📋', label: 'View Applications', sub: 'Review candidates & update status', to: '/recruiter/applications', btn: 'Review' },
                        { icon: '👤', label: 'Recruiter Profile', sub: 'Update your company info', to: '/recruiter/profile', btn: 'Edit' },
                    ].map((item) => (
                        <div key={item.label} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '14px 16px', background: 'rgba(255,255,255,0.03)',
                            borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
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

            {/* Recent Candidates */}
            <div className="table-container anim-fade-in delay-4">
                <div className="table-header">
                    <div>
                        <div className="section-title" style={{ marginBottom: 0 }}>Recent Candidates</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Latest applicants across your jobs</div>
                    </div>
                    <Link to="/recruiter/applications" className="btn btn--secondary btn--sm">View All →</Link>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Candidate</th>
                            <th>Applied For</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((c) => {
                            const s = STATUS_MAP[c.status] || STATUS_MAP.APPLIED;
                            return (
                                <tr key={c.applicationId}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                background: 'var(--gradient-primary)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, color: 'white', fontSize: '13px',
                                            }}>
                                                {c.candidateName?.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>{c.candidateName}</div>
                                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{c.candidateEmail}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 'var(--text-sm)' }}>{c.jobTitle}</td>
                                    <td><span className={`badge badge-animate ${s.cls}`}>{s.label}</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
