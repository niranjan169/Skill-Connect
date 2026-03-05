import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recruiterService } from '../../services/recruiterService';
import { useToast } from '../../hooks/useToast';
import Modal from '../../components/common/Modal';
import { useForm } from 'react-hook-form';



const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'];

export default function ManageJobsPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [jobs, setJobs] = useState([]);
    const [editJob, setEditJob] = useState(null);
    const [delJob, setDelJob] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        (async () => {
            try {
                const res = await recruiterService.getMyJobs();
                if (res?.data?.length) setJobs(res.data);
            } catch { }
        })();
    }, []);

    const openEdit = (job) => {
        setEditJob(job);
        reset({ title: job.title, location: job.location, jobType: job.jobType, minSalary: job.minSalary, maxSalary: job.maxSalary });
    };

    const onEdit = async (data) => {
        try {
            await recruiterService.updateJob(editJob.id, data);
            setJobs((prev) => prev.map((j) => j.id === editJob.id ? { ...j, ...data } : j));
            toast.success('Job updated!');
            setEditJob(null);
        } catch (err) { toast.error(err.message); }
    };

    const onDelete = async () => {
        try {
            await recruiterService.deleteJob(delJob.id);
            setJobs((prev) => prev.filter((j) => j.id !== delJob.id));
            toast.success('Job deleted.');
            setDelJob(null);
        } catch (err) { toast.error(err.message); }
    };

    const statusBadge = (s) => s === 'APPROVED'
        ? <span className="badge badge--success">✓ Approved</span>
        : <span className="badge badge--warning">⏳ Pending</span>;

    return (
        <div className="page-enter">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-header__title">Manage Jobs</h1>
                    <p className="page-header__subtitle">{jobs.length} jobs posted by you</p>
                </div>
                <button className="btn btn--primary" onClick={() => navigate('/recruiter/jobs/create')}>➕ Post New Job</button>
            </div>

            <div className="table-container">
                {jobs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">💼</div>
                        <div className="empty-state__title">No jobs posted yet</div>
                        <div className="empty-state__desc">Create your first job posting to start receiving applications.</div>
                        <button className="btn btn--primary" onClick={() => navigate('/recruiter/jobs/create')}>Post a Job</button>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Salary</th>
                                <th>Applicants</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job) => (
                                <tr key={job.id}>
                                    <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{job.title}</td>
                                    <td>{job.location}</td>
                                    <td><span className="badge badge--gray">{job.jobType.replace('_', ' ')}</span></td>
                                    <td>${(job.minSalary / 1000).toFixed(0)}k–${(job.maxSalary / 1000).toFixed(0)}k</td>
                                    <td>
                                        <button
                                            className="btn btn--ghost btn--sm"
                                            onClick={() => navigate(`/recruiter/applications?jobId=${job.id}`)}
                                        >
                                            👥 {job.applicantCount}
                                        </button>
                                    </td>
                                    <td>{statusBadge(job.status)}</td>
                                    <td>
                                        <div className="table__actions">
                                            <button className="btn btn--secondary btn--sm" onClick={() => openEdit(job)} title="Edit">✏️</button>
                                            <button className="btn btn--danger btn--sm" onClick={() => setDelJob(job)} title="Delete">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Edit Modal */}
            <Modal isOpen={!!editJob} onClose={() => setEditJob(null)} title="Edit Job Posting" size="md">
                <form className="form" onSubmit={handleSubmit(onEdit)}>
                    <div className="form-group">
                        <label className="form-label">Job Title</label>
                        <input className={`form-input ${errors.title ? 'error' : ''}`} {...register('title', { required: true })} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <input className="form-input" {...register('location')} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Job Type</label>
                            <select className="form-select" {...register('jobType')}>
                                {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Min Salary</label>
                            <input type="number" className="form-input" {...register('minSalary')} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Max Salary</label>
                            <input type="number" className="form-input" {...register('maxSalary')} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" className="btn btn--secondary btn--full" onClick={() => setEditJob(null)}>Cancel</button>
                        <button type="submit" className="btn btn--primary btn--full">Save Changes</button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirm Modal */}
            <Modal isOpen={!!delJob} onClose={() => setDelJob(null)} title="Delete Job" size="sm">
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                    Are you sure you want to delete <strong style={{ color: 'var(--color-text-primary)' }}>{delJob?.title}</strong>? This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn--secondary btn--full" onClick={() => setDelJob(null)}>Cancel</button>
                    <button className="btn btn--danger btn--full" onClick={onDelete}>🗑️ Delete Job</button>
                </div>
            </Modal>
        </div>
    );
}
