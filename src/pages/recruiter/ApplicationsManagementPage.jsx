import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { recruiterService } from '../../services/recruiterService';
import { useToast } from '../../hooks/useToast';

const MOCK_CANDIDATES = [
    { candidateId: 1, candidateName: 'Alice Johnson', candidateEmail: 'alice@dev.com', jobId: 1, jobTitle: 'Sr. React Dev', location: 'NYC', yearsOfExperience: 5, skills: ['React', 'TS', 'Node.js'], status: 'SHORTLISTED', recruiterNotes: null, resumeUrl: '#' },
    { candidateId: 2, candidateName: 'Bob Smith', candidateEmail: 'bob@dev.com', jobId: 2, jobTitle: 'Java Engineer', location: 'Chicago', yearsOfExperience: 3, skills: ['Java', 'Spring Boot'], status: 'APPLIED', recruiterNotes: null, resumeUrl: '#' },
    { candidateId: 3, candidateName: 'Carol Davis', candidateEmail: 'carol@dev.com', jobId: 1, jobTitle: 'Sr. React Dev', location: 'Remote', yearsOfExperience: 7, skills: ['React', 'GraphQL', 'AWS'], status: 'APPLIED', recruiterNotes: null, resumeUrl: '#' },
    { candidateId: 4, candidateName: 'David Lee', candidateEmail: 'david@dev.com', jobId: 2, jobTitle: 'Java Engineer', location: 'Austin', yearsOfExperience: 2, skills: ['Java'], status: 'REJECTED', recruiterNotes: 'Insufficient exp', resumeUrl: '#' },
];

const STATUSES = ['APPLIED', 'SHORTLISTED', 'REJECTED', 'SELECTED'];

const STATUS_MAP = {
    APPLIED: { label: 'Applied', cls: 'badge--primary' },
    SHORTLISTED: { label: 'Shortlisted', cls: 'badge--success' },
    REJECTED: { label: 'Rejected', cls: 'badge--danger' },
    SELECTED: { label: 'Selected', cls: 'badge--info' },
};

export default function ApplicationsManagementPage() {
    const toast = useToast();
    const [searchParams] = useSearchParams();
    const jobIdParam = searchParams.get('jobId');

    const [candidates, setCandidates] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [scheduleApp, setScheduleApp] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const endpoint = jobIdParam ? jobIdParam : 'all';
                const res = await recruiterService.getApplicants(endpoint);
                if (res?.data) {
                    setCandidates(res.data);
                    // If we have a specific job, we can extract its title from the first candidate
                    if (jobIdParam && res.data.length > 0) {
                        setJobDetails({ id: jobIdParam, title: res.data[0].jobTitle });
                    }
                }
            } catch (err) {
                toast.error('Failed to load applications');
            }
        })();
    }, [jobIdParam]);

    const handleStatusChange = async (applicationId, newStatus) => {
        setUpdatingId(applicationId);
        try {
            await recruiterService.updateApplicationStatus(applicationId, newStatus);
            setCandidates((prev) => prev.map((c) => c.applicationId === applicationId ? { ...c, status: newStatus } : c));
            toast.success(`Status updated to ${newStatus}`);
        } catch (err) {
            toast.error(err.message || 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };


    const filtered = candidates.filter((c) => {
        const q = search.toLowerCase();
        const matchQ = !q || c.candidateName.toLowerCase().includes(q) || c.jobTitle.toLowerCase().includes(q);
        const matchS = statusFilter === 'ALL' || c.status === statusFilter;
        return matchQ && matchS;
    });

    return (
        <div className="page-enter">
            <div className="page-header">
                <h1 className="page-header__title">
                    {jobDetails ? `Applications for ${jobDetails.title}` : 'Applications Management'}
                </h1>
                <p className="page-header__subtitle">
                    {jobDetails
                        ? `${candidates.length} candidates for this position`
                        : `${candidates.length} candidates across all your jobs`}
                </p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="search-input-wrapper" style={{ flex: 1, maxWidth: '340px' }}>
                    <span className="search-icon">🔍</span>
                    <input
                        className="form-input"
                        placeholder="Search candidate or job…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['ALL', ...STATUSES].map((s) => (
                        <button
                            key={s}
                            className={`btn ${statusFilter === s ? 'btn--primary' : 'btn--secondary'} btn--sm`}
                            onClick={() => setStatusFilter(s)}
                        >
                            {s === 'ALL' ? 'All' : STATUS_MAP[s]?.label}
                            {' '}({s === 'ALL' ? candidates.length : candidates.filter((c) => c.status === s).length})
                        </button>
                    ))}
                </div>
            </div>

            <div className="table-container">
                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">📭</div>
                        <div className="empty-state__title">No candidates found</div>
                        <div className="empty-state__desc">Adjust your search or filter criteria.</div>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Applied For</th>
                                <th>Experience</th>
                                <th>Skills</th>
                                <th>Resume</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c) => {
                                const s = STATUS_MAP[c.status] || STATUS_MAP.APPLIED;
                                return (
                                    <tr key={c.applicationId}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    background: 'var(--gradient-primary)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 700, color: 'white', fontSize: '13px', flexShrink: 0,
                                                }}>
                                                    {c.candidateName?.charAt(0)}
                                                </div>
                                                <div
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setSelectedCandidate(c)}
                                                >
                                                    <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', textDecoration: 'underline' }}>{c.candidateName}</div>
                                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                                        {c.candidateEmail} • {c.yearsOfExperience > 0 ? `${c.yearsOfExperience} yrs` : 'Fresher'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: 'var(--text-sm)' }}>{c.jobTitle}</td>
                                        <td style={{ fontSize: 'var(--text-sm)' }}>{c.yearsOfExperience} yrs</td>
                                        <td>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {c.skills?.slice(0, 2).map((sk) => <span key={sk} className="badge badge--primary" style={{ fontSize: '10px' }}>{sk}</span>)}
                                                {c.skills?.length > 2 && <span className="badge badge--gray" style={{ fontSize: '10px' }}>+{c.skills.length - 2}</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <a href={c.resumeUrl} target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">📄 View</a>
                                        </td>
                                        <td>
                                            <select
                                                value={c.status}
                                                onChange={(e) => handleStatusChange(c.applicationId, e.target.value)}
                                                disabled={updatingId === c.applicationId}
                                                style={{
                                                    background: 'var(--color-bg-card2)',
                                                    border: '1px solid var(--color-border)',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'var(--color-text-primary)',
                                                    padding: '5px 10px',
                                                    fontSize: 'var(--text-xs)',
                                                    cursor: 'pointer',
                                                    outline: 'none',
                                                }}
                                            >
                                                {STATUSES.map((st) => <option key={st} value={st}>{STATUS_MAP[st].label}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
            {/* Candidate Details Modal */}
            {selectedCandidate && (
                <div className="modal-overlay" onClick={() => setSelectedCandidate(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: 'white' }}>
                                    {selectedCandidate.candidateName?.charAt(0)}
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, color: 'var(--color-text-primary)' }}>{selectedCandidate.candidateName}</h2>
                                    <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{selectedCandidate.candidateEmail}</p>
                                </div>
                            </div>
                            <button className="btn btn--ghost" onClick={() => setSelectedCandidate(null)}>✕</button>
                        </div>

                        <div className="grid grid-2" style={{ gap: '24px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Location</label>
                                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedCandidate.location || 'N/A'}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Experience</label>
                                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                    {selectedCandidate.yearsOfExperience > 0 ? `${selectedCandidate.yearsOfExperience} years` : 'Fresher'}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Education</label>
                                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedCandidate.education || 'N/A'}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Skills & Expertise</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {selectedCandidate.skills?.map(sk => (
                                    <span key={sk} className="badge badge--primary">{sk}</span>
                                ))}
                            </div>
                        </div>


                        <div style={{ display: 'flex', gap: '12px' }}>
                            <a href={selectedCandidate.resumeUrl} target="_blank" rel="noreferrer" className="btn btn--primary btn--full">📄 View Resume</a>
                            <button className="btn btn--secondary btn--full" onClick={() => setSelectedCandidate(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
