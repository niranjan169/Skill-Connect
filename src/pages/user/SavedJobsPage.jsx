import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { useToast } from '../../hooks/useToast';



export default function SavedJobsPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [saved, setSaved] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await userService.getSavedJobs();
                if (res?.data?.length) setSaved(res.data);
            } catch { } finally { setLoading(false); }
        })();
    }, []);

    const handleUnsave = async (jobId) => {
        setSaved((s) => s.filter((j) => j.id !== jobId));
        try {
            await userService.unsaveJob(jobId);
            toast.success('Job removed from saved list.');
        } catch (err) { toast.error(err.message); }
    };

    return (
        <div className="page-enter">
            <div className="page-header">
                <h1 className="page-header__title">Saved Jobs ❤️</h1>
                <p className="page-header__subtitle">{saved.length} jobs bookmarked for later</p>
            </div>

            {loading ? (
                <div className="grid grid-auto">
                    {[...Array(3)].map((_, i) => <div key={i} className="skeleton skeleton-card" style={{ height: '200px' }} />)}
                </div>
            ) : saved.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state__icon">🤍</div>
                    <div className="empty-state__title">No saved jobs yet</div>
                    <div className="empty-state__desc">Browse jobs and click the heart icon to save them here.</div>
                    <button className="btn btn--primary" onClick={() => navigate('/user/jobs')}>Browse Jobs</button>
                </div>
            ) : (
                <div className="grid grid-auto">
                    {saved.map((job, i) => (
                        <div key={job.id} className={`job-card anim-fade-in delay-${Math.min(i + 1, 6)}`}>
                            <div className="job-card__top">
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
                                    background: `hsl(${job.id * 47 % 360}, 60%, 40%)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 800, color: 'white', fontSize: '18px', flexShrink: 0,
                                }}>
                                    {job.companyName?.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="job-card__title">{job.title}</div>
                                    <div className="job-card__company">{job.companyName}</div>
                                </div>
                                <button className="job-card__save-btn saved" onClick={() => handleUnsave(job.id)} title="Remove">❤️</button>
                            </div>

                            <div className="job-card__meta">
                                <span className="job-card__meta-item">📍 {job.location}</span>
                                <span className="job-card__meta-item">💼 {job.jobType.replace('_', ' ')}</span>
                                <span className="job-card__meta-item">💰 ${(job.minSalary / 1000).toFixed(0)}k–${(job.maxSalary / 1000).toFixed(0)}k</span>
                            </div>

                            <div className="job-card__skills">
                                {job.skills?.slice(0, 3).map((s) => <span key={s} className="badge badge--primary">{s}</span>)}
                            </div>

                            <div className="job-card__actions">
                                <button
                                    className={`btn ${job.applied ? 'btn--secondary' : 'btn--primary'} btn--sm`}
                                    style={{ flex: 1 }}
                                    onClick={() => navigate(`/user/jobs/${job.id}`)}
                                    disabled={job.applied}
                                >
                                    {job.applied ? 'Applied' : 'View & Apply →'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
