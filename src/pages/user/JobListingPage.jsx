import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { useToast } from '../../hooks/useToast';

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'];
const SKILLS_LIST = ['React', 'Node.js', 'Java', 'Python', 'Spring Boot', 'MongoDB', 'SQL', 'TypeScript', 'AWS', 'Docker'];


const ITEMS_PER_PAGE = 6;

export default function JobListingPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [saved, setSaved] = useState(new Set());
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ jobTypes: [], skills: [], location: '' });

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await userService.getAllJobs();
                if (res?.data) {
                    setJobs(res.data);
                    // Sync initial saved state from backend flags
                    const initialSaved = new Set(
                        res.data.filter(j => j.saved).map(j => j.id)
                    );
                    setSaved(initialSaved);
                }
            } catch {
                toast.error("Failed to load jobs. Please try again later.");
            } finally { setLoading(false); }
        })();
    }, []);

    const toggleFilter = (key, val) => {
        setFilters((f) => {
            const arr = f[key];
            return { ...f, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
        });
        setPage(1);
    };

    const clearFilters = () => { setFilters({ jobTypes: [], skills: [], location: '' }); setSearch(''); setPage(1); };

    const filtered = jobs.filter((j) => {
        const q = search.toLowerCase();
        const matchQ = !q || j.title.toLowerCase().includes(q) || j.companyName.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
        const matchType = !filters.jobTypes.length || filters.jobTypes.includes(j.jobType);
        const matchSkills = !filters.skills.length || filters.skills.some((s) => j.skills.includes(s));
        const matchLoc = !filters.location || j.location.toLowerCase().includes(filters.location.toLowerCase());
        return matchQ && matchType && matchSkills && matchLoc;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleSave = async (jobId, e) => {
        e.stopPropagation();
        const isSaved = saved.has(jobId);
        setSaved((s) => { const ns = new Set(s); isSaved ? ns.delete(jobId) : ns.add(jobId); return ns; });
        try {
            isSaved ? await userService.unsaveJob(jobId) : await userService.saveJob(jobId);
            toast.success(isSaved ? 'Job removed from saved.' : 'Job saved!');
        } catch (err) { toast.error(err.message); }
    };

    const fmtSalary = (min, max) =>
        `$${(min / 1000).toFixed(0)}k – $${(max / 1000).toFixed(0)}k`;

    return (
        <div className="page-enter">
            <div className="page-header">
                <h1 className="page-header__title">Browse Jobs</h1>
                <p className="page-header__subtitle">
                    {filtered.length} opportunities found matching your criteria
                </p>
            </div>

            <div className="filter-layout">
                {/* Filter Sidebar */}
                <aside className="filter-sidebar">
                    <div className="filter-sidebar__title">
                        Filters
                        <button className="btn btn--ghost btn--sm" onClick={clearFilters}>Clear</button>
                    </div>

                    {/* Location */}
                    <div className="filter-section">
                        <div className="filter-section__label">Location</div>
                        <input
                            className="form-input"
                            placeholder="City or Remote…"
                            value={filters.location}
                            onChange={(e) => { setFilters((f) => ({ ...f, location: e.target.value })); setPage(1); }}
                        />
                    </div>

                    {/* Job Type */}
                    <div className="filter-section">
                        <div className="filter-section__label">Job Type</div>
                        {JOB_TYPES.map((t) => (
                            <label key={t} className="filter-checkbox">
                                <input type="checkbox" checked={filters.jobTypes.includes(t)} onChange={() => toggleFilter('jobTypes', t)} />
                                {t.replace('_', ' ')}
                            </label>
                        ))}
                    </div>

                    {/* Skills */}
                    <div className="filter-section">
                        <div className="filter-section__label">Skills</div>
                        {SKILLS_LIST.map((s) => (
                            <label key={s} className="filter-checkbox">
                                <input type="checkbox" checked={filters.skills.includes(s)} onChange={() => toggleFilter('skills', s)} />
                                {s}
                            </label>
                        ))}
                    </div>
                </aside>

                {/* Jobs Grid */}
                <div>
                    {/* Search Bar */}
                    <div className="search-input-wrapper" style={{ marginBottom: '24px' }}>
                        <span className="search-icon">🔍</span>
                        <input
                            className="form-input"
                            placeholder="Search by title, company, or location…"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>

                    {loading ? (
                        <div className="grid grid-auto">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="skeleton skeleton-card" style={{ height: '220px' }} />
                            ))}
                        </div>
                    ) : paginated.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state__icon">🔍</div>
                            <div className="empty-state__title">No jobs found</div>
                            <div className="empty-state__desc">Try adjusting your filters or search term.</div>
                            <button className="btn btn--primary" onClick={clearFilters}>Clear All Filters</button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-auto">
                                {paginated.map((job, i) => (
                                    <div
                                        key={job.id}
                                        className={`job-card anim-fade-in delay-${Math.min(i + 1, 6)}`}
                                        onClick={() => navigate(`/user/jobs/${job.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >

                                        <div className="job-card__top">
                                            <div>
                                                <div className={`job-card__company-logo`} style={{
                                                    background: `hsl(${job.id * 47 % 360}, 60%, 40%)`,
                                                }}>
                                                    {job.companyName.charAt(0)}
                                                </div>
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div className="job-card__title">{job.title}</div>
                                                <div className="job-card__company">{job.companyName}</div>
                                            </div>
                                            <button
                                                className={`job-card__save-btn ${saved.has(job.id) ? 'saved' : ''}`}
                                                onClick={(e) => handleSave(job.id, e)}
                                                title="Save job"
                                            >
                                                {saved.has(job.id) ? '❤️' : '🤍'}
                                            </button>
                                        </div>

                                        <div className="job-card__meta">
                                            <span className="job-card__meta-item">📍 {job.location}</span>
                                            <span className="job-card__meta-item">💼 {job.jobType.replace('_', ' ')}</span>
                                            <span className="job-card__meta-item">💰 {fmtSalary(job.minSalary, job.maxSalary)}</span>
                                        </div>

                                        <div className="job-card__skills">
                                            {job.skills.slice(0, 3).map((s) => (
                                                <span key={s} className="badge badge--primary">{s}</span>
                                            ))}
                                            {job.skills.length > 3 && (
                                                <span className="badge badge--gray">+{job.skills.length - 3}</span>
                                            )}
                                        </div>

                                        <div className="job-card__actions">
                                            <button
                                                className={`btn ${job.applied ? 'btn--secondary' : 'btn--primary'} btn--sm`}
                                                onClick={(e) => { e.stopPropagation(); navigate(`/user/jobs/${job.id}`); }}
                                                style={{ flex: 1 }}
                                                disabled={job.applied}
                                            >
                                                {job.applied ? 'Applied' : 'Apply Now'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="pagination__btn"
                                        disabled={page === 1}
                                        onClick={() => setPage((p) => p - 1)}
                                    >←</button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            className={`pagination__btn ${page === i + 1 ? 'active' : ''}`}
                                            onClick={() => setPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        className="pagination__btn"
                                        disabled={page === totalPages}
                                        onClick={() => setPage((p) => p + 1)}
                                    >→</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
