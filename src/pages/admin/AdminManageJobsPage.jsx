import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';

export default function AdminManageJobsPage() {
    const toast = useToast();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await adminService.getAllJobs();
                if (res?.data) {
                    const mapped = res.data.map(j => ({
                        ...j,
                        status: j.approved ? 'APPROVED' : 'PENDING',
                        applicantCount: j.applicantCount || 0
                    }));
                    setJobs(mapped);
                }
            } catch (err) {
                toast.error(err.message || 'Failed to fetch jobs');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleApprove = async (id) => {
        try {
            await adminService.approveJob(id);
            setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: 'APPROVED' } : j));
            toast.success('Job approved and is now live!');
        } catch (err) { toast.error(err.message); }
    };

    const handleReject = async (id) => {
        try {
            await adminService.rejectJob(id);
            setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: 'REJECTED' } : j));
            toast.success('Job rejected.');
        } catch (err) { toast.error(err.message); }
    };

    const filtered = jobs.filter((j) => {
        const q = search.toLowerCase();
        const matchQ = !q || (j.title && j.title.toLowerCase().includes(q)) || (j.companyName && j.companyName.toLowerCase().includes(q));
        const statusVal = j.approved ? 'APPROVED' : 'PENDING';
        const matchF = filter === 'ALL' || statusVal === filter;
        return matchQ && matchF;
    });

    return (
        <div className="page-enter">
            <div className="page-header">
                <h1 className="page-header__title">Manage Jobs</h1>
                <p className="page-header__subtitle">{jobs.length} total jobs · {jobs.filter((j) => j.status === 'PENDING').length} pending approval</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div className="search-input-wrapper" style={{ flex: 1, maxWidth: '340px' }}>
                    <span className="search-icon">🔍</span>
                    <input className="form-input" placeholder="Search jobs…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
                    <button key={f} className={`btn btn--sm ${filter === f ? 'btn--primary' : 'btn--secondary'}`} onClick={() => setFilter(f)}>
                        {f} ({f === 'ALL' ? jobs.length : jobs.filter((j) => j.status === f).length})
                    </button>
                ))}
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr><th>Title</th><th>Company</th><th>Type</th><th>Location</th><th>Applicants</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {filtered.map((job) => (
                            <tr key={job.id}>
                                <td
                                    style={{ fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => setSelectedJob(job)}
                                >
                                    {job.title}
                                </td>
                                <td>{job.companyName}</td>
                                <td><span className="badge badge--gray">{job.jobType.replace('_', ' ')}</span></td>
                                <td>{job.location}</td>
                                <td style={{ fontWeight: 600, textAlign: 'center' }}>{job.applicantCount}</td>
                                <td>
                                    {job.status === 'APPROVED' && <span className="badge badge--success">✓ Approved</span>}
                                    {job.status === 'PENDING' && <span className="badge badge--warning">⏳ Pending</span>}
                                    {job.status === 'REJECTED' && <span className="badge badge--danger">✕ Rejected</span>}
                                </td>
                                <td>
                                    <div className="table__actions">
                                        {job.status === 'PENDING' && (
                                            <>
                                                <button className="btn btn--success btn--sm" onClick={() => handleApprove(job.id)}>✓ Approve</button>
                                                <button className="btn btn--danger btn--sm" onClick={() => handleReject(job.id)}>✕ Reject</button>
                                            </>
                                        )}
                                        {job.status !== 'PENDING' && (
                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>—</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Job Details Modal */}
            {selectedJob && (
                <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <h1 style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '24px' }}>{selectedJob.title}</h1>
                                <p style={{ margin: '4px 0 0', color: 'var(--color-primary)', fontWeight: 600 }}>{selectedJob.companyName}</p>
                            </div>
                            <button className="btn btn--ghost" onClick={() => setSelectedJob(null)}>✕</button>
                        </div>

                        <div className="grid grid-3" style={{ gap: '16px', marginBottom: '24px' }}>
                            <div className="card" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Location</div>
                                <div style={{ fontWeight: 600, fontSize: '14px' }}>📍 {selectedJob.location}</div>
                            </div>
                            <div className="card" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Job Type</div>
                                <div style={{ fontWeight: 600, fontSize: '14px' }}>💼 {selectedJob.jobType.replace('_', ' ')}</div>
                            </div>
                            <div className="card" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Applicants</div>
                                <div style={{ fontWeight: 600, fontSize: '14px' }}>👥 {selectedJob.applicantCount}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '14px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Description</h3>
                            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                {selectedJob.description}
                            </div>
                        </div>

                        {selectedJob.requirements && (
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '14px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Requirements</h3>
                                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                    {selectedJob.requirements}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                            {selectedJob.status === 'PENDING' && (
                                <>
                                    <button className="btn btn--success btn--full" onClick={() => { handleApprove(selectedJob.id); setSelectedJob(null); }}>
                                        ✓ Approve & Publish
                                    </button>
                                    <button className="btn btn--danger btn--full" onClick={() => { handleReject(selectedJob.id); setSelectedJob(null); }}>
                                        ✕ Reject Job
                                    </button>
                                </>
                            )}
                            <button className="btn btn--secondary btn--full" onClick={() => setSelectedJob(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
