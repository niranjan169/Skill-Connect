import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';

// Mock data removed

const STATUS_MAP = {
    APPLIED: { label: 'Applied', cls: 'badge--primary', icon: '📋' },
    SHORTLISTED: { label: 'Shortlisted', cls: 'badge--success', icon: '✅' },
    REJECTED: { label: 'Rejected', cls: 'badge--danger', icon: '❌' },
    SELECTED: { label: 'Selected', cls: 'badge--info', icon: '🎉' },
};

export default function MyApplicationsPage() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await userService.getMyApplications();
                if (res?.data?.length) setApps(res.data);
            } catch { /* use mock */ } finally { setLoading(false); }
        })();
    }, []);

    const statuses = ['ALL', 'APPLIED', 'SHORTLISTED', 'REJECTED', 'SELECTED'];

    const filtered = filter === 'ALL' ? apps : apps.filter((a) => a.status === filter);

    return (
        <div className="page-enter">
            <div className="page-header">
                <h1 className="page-header__title">My Applications</h1>
                <p className="page-header__subtitle">
                    Track all {apps.length} of your job applications
                </p>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {statuses.map((s) => {
                    const count = s === 'ALL' ? apps.length : apps.filter((a) => a.status === s).length;
                    return (
                        <button
                            key={s}
                            className={`btn ${filter === s ? 'btn--primary' : 'btn--secondary'} btn--sm`}
                            onClick={() => setFilter(s)}
                        >
                            {STATUS_MAP[s]?.icon || '📊'} {s === 'ALL' ? 'All' : STATUS_MAP[s]?.label} ({count})
                        </button>
                    );
                })}
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '40px' }}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
                                <div className="skeleton skeleton-text" style={{ width: '200px', height: '20px' }} />
                                <div className="skeleton skeleton-text" style={{ width: '120px', height: '20px' }} />
                                <div className="skeleton skeleton-badge" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">📭</div>
                        <div className="empty-state__title">No applications found</div>
                        <div className="empty-state__desc">You haven't applied to any jobs matching this filter yet.</div>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Actions</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((app, i) => {
                                const s = STATUS_MAP[app.status] || STATUS_MAP.APPLIED;
                                return (
                                    <tr key={app.applicationId} className="anim-fade-in">
                                        <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{i + 1}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{app.jobTitle}</td>
                                        <td>{app.companyName}</td>
                                        <td>
                                            <button className="btn btn--secondary btn--sm" onClick={() => setSelectedApp(app)}>
                                                👁 View Details
                                            </button>
                                        </td>
                                        <td>
                                            <span className={`badge badge-animate ${s.cls}`}>
                                                {s.icon} {s.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Application Details Modal */}
            {selectedApp && (
                <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ margin: 0 }}>Application Details</h2>
                                <p style={{ margin: 0, color: 'var(--color-primary)', fontWeight: 600 }}>{selectedApp.jobTitle}</p>
                            </div>
                            <button className="btn btn--ghost" onClick={() => setSelectedApp(null)}>✕</button>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <div className="card" style={{ padding: '16px', background: 'var(--color-bg-body)' }}>
                                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Status</label>
                                <span className={`badge ${STATUS_MAP[selectedApp.status]?.cls}`}>
                                    {STATUS_MAP[selectedApp.status]?.icon} {STATUS_MAP[selectedApp.status]?.label}
                                </span>
                            </div>
                        </div>

                        {selectedApp.recruiterNotes && (
                            <div style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid var(--color-primary-light)', marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Notes from Recruiter</label>
                                <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>"{selectedApp.recruiterNotes}"</div>
                            </div>
                        )}

                        <button className="btn btn--secondary btn--full" onClick={() => setSelectedApp(null)}>Close</button>
                    </div>
                </div>
            )
            }
        </div >
    );
}
