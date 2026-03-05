import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const MOCK_APPS = [
    { applicationId: 1, candidateName: 'Alice Johnson', jobTitle: 'Sr. React Dev', companyName: 'TechCorp', status: 'SHORTLISTED' },
    { applicationId: 2, candidateName: 'Bob Smith', jobTitle: 'Java Engineer', companyName: 'GlobalIT', status: 'APPLIED' },
    { applicationId: 3, candidateName: 'Carol Davis', jobTitle: 'Sr. React Dev', companyName: 'TechCorp', status: 'APPLIED' },
    { applicationId: 4, candidateName: 'David Lee', jobTitle: 'Java Engineer', companyName: 'GlobalIT', status: 'REJECTED' },
    { applicationId: 5, candidateName: 'Eve Martinez', jobTitle: 'Frontend Intern', companyName: 'DesignHub', status: 'SELECTED' },
];

const STATUS_MAP = {
    APPLIED: { label: 'Applied', cls: 'badge--primary' },
    SHORTLISTED: { label: 'Shortlisted', cls: 'badge--success' },
    REJECTED: { label: 'Rejected', cls: 'badge--danger' },
    SELECTED: { label: 'Selected', cls: 'badge--info' },
};

export default function AdminManageApplicationsPage() {
    const [apps, setApps] = useState(MOCK_APPS);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        (async () => {
            try {
                const res = await adminService.getAllApplications();
                if (res?.data?.length) setApps(res.data);
            } catch { }
        })();
    }, []);

    const filtered = apps.filter((a) => {
        const q = search.toLowerCase();
        const matchQ = !q || a.candidateName.toLowerCase().includes(q) || a.jobTitle.toLowerCase().includes(q);
        const matchF = filter === 'ALL' || a.status === filter;
        return matchQ && matchF;
    });

    return (
        <div className="page-enter">
            <div className="page-header">
                <h1 className="page-header__title">All Applications</h1>
                <p className="page-header__subtitle">{apps.length} total applications across the platform</p>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {['ALL', 'APPLIED', 'SHORTLISTED', 'REJECTED', 'SELECTED'].map((f) => (
                    <button key={f} className={`btn btn--sm ${filter === f ? 'btn--primary' : 'btn--secondary'}`} onClick={() => setFilter(f)}>
                        {f === 'ALL' ? '📊 All' : `${STATUS_MAP[f]?.label}`}
                        {' '}({f === 'ALL' ? apps.length : apps.filter((a) => a.status === f).length})
                    </button>
                ))}
            </div>

            <div className="search-input-wrapper" style={{ marginBottom: '16px', maxWidth: '380px' }}>
                <span className="search-icon">🔍</span>
                <input className="form-input" placeholder="Search candidate or job…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr><th>#</th><th>Candidate</th><th>Job Title</th><th>Company</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {filtered.map((a, i) => {
                            const s = STATUS_MAP[a.status] || STATUS_MAP.APPLIED;
                            return (
                                <tr key={a.applicationId}>
                                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{i + 1}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{a.candidateName}</td>
                                    <td>{a.jobTitle}</td>
                                    <td>{a.companyName}</td>
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
