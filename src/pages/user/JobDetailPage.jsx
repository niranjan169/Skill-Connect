import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { useToast } from '../../hooks/useToast';
import Modal from '../../components/common/Modal';
import { useForm } from 'react-hook-form';

const MOCK_JOB = {
    id: 1,
    title: 'Senior React Developer',
    companyName: 'TechCorp Inc.',
    location: 'New York, NY',
    jobType: 'FULL_TIME',
    minExperience: 3,
    maxExperience: 7,
    minSalary: 90000,
    maxSalary: 130000,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    description: `We're looking for a Senior React Developer to join our dynamic engineering team. You'll be responsible for building and maintaining high-performance web applications used by millions of users globally.

Key Responsibilities:
• Build reusable components and front-end libraries for future use
• Translate designs and wireframes into high quality code
• Optimize components for maximum performance across platforms
• Review code of other frontend developers
• Collaborate with backend team on API design

What We Offer:
• Competitive salary ($90k–$130k)
• Full remote flexibility
• Health, dental, and vision insurance
• 401k with company match
• Learning & development budget`,
    postedAt: '2026-02-15',
};

export default function JobDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [job, setJob] = useState(MOCK_JOB);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [applyOpen, setApplyOpen] = useState(false);
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await userService.getJobById(id);
                if (res?.data) {
                    setJob(res.data);
                    setSaved(res.data.saved);
                }
            } catch { /* use mock */ } finally { setLoading(false); }
        })();
    }, [id]);

    const addSkill = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const v = skillInput.trim();
            if (v && !skills.includes(v)) setSkills([...skills, v]);
            setSkillInput('');
        }
    };

    const onApply = async (data) => {
        setApplying(true);
        try {
            await userService.applyForJob({ ...data, jobId: Number(id), skills });
            toast.success('Application submitted successfully!');
            setApplyOpen(false);
            reset();
            setSkills([]);
        } catch (err) {
            toast.error(err.message || 'Failed to apply.');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '40px' }}>
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton skeleton-text skeleton-text--full" style={{ marginBottom: '12px', height: '20px' }} />)}
        </div>
    );

    return (
        <div className="page-enter">
            {/* Back button */}
            <button onClick={() => navigate(-1)} className="btn btn--ghost btn--sm" style={{ marginBottom: '24px' }}>
                ← Back to Jobs
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
                {/* Main content */}
                <div>
                    {/* Header card */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{
                                width: '60px', height: '60px', borderRadius: 'var(--radius-lg)',
                                background: `hsl(${Number(id) * 47 % 360}, 60%, 40%)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '24px', fontWeight: '800', color: 'white', flexShrink: 0,
                            }}>
                                {job.companyName?.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                                    {job.title}
                                </h1>
                                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
                                    {job.companyName} • {job.location}
                                </p>
                            </div>
                        </div>

                        {/* Meta chips */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                            {[
                                { icon: '📍', val: job.location },
                                { icon: '💼', val: job.jobType?.replace('_', ' ') },
                                { icon: '📅', val: `${job.minExperience}–${job.maxExperience} yrs exp` },
                                { icon: '💰', val: `$${(job.minSalary / 1000).toFixed(0)}k – $${(job.maxSalary / 1000).toFixed(0)}k` },
                            ].map((m) => (
                                <span key={m.val} style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '6px 14px', background: 'rgba(255,255,255,0.04)',
                                    borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)',
                                    fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
                                }}>
                                    {m.icon} {m.val}
                                </span>
                            ))}
                        </div>

                        {/* Skills */}
                        <div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                                REQUIRED SKILLS
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {job.skills?.map((s) => (
                                    <span
                                        key={s}
                                        className="badge badge--primary"
                                    >
                                        ✓ {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="card">
                        <h2 className="section-title">About this Role</h2>
                        <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                            {job.description}
                        </div>
                    </div>
                </div>

                {/* Sidebar action card */}
                <div className="card" style={{ position: 'sticky', top: '80px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                            ${(job.minSalary / 1000).toFixed(0)}k – ${(job.maxSalary / 1000).toFixed(0)}k
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Annual salary range</div>
                    </div>

                    <button
                        className={`btn ${job.applied ? 'btn--secondary' : 'btn--primary'} btn--full btn--lg`}
                        style={{ marginBottom: '12px' }}
                        onClick={() => !job.applied && setApplyOpen(true)}
                        disabled={job.applied}
                    >
                        {job.applied ? '✓ Applied' : '🚀 Apply Now'}
                    </button>

                    <button
                        className={`btn btn--full ${saved ? 'btn--success' : 'btn--secondary'}`}
                        onClick={async () => {
                            const newSaved = !saved;
                            setSaved(newSaved);
                            try {
                                newSaved ? await userService.saveJob(id) : await userService.unsaveJob(id);
                                toast.success(newSaved ? 'Job saved to your list!' : 'Removed from saved jobs');
                            } catch (err) {
                                setSaved(!newSaved);
                                toast.error(err.message);
                            }
                        }}
                    >
                        {saved ? '❤️ Saved' : '🤍 Save Job'}
                    </button>

                    <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                            QUICK DETAILS
                        </div>
                        {[
                            { label: 'Job Type', val: job.jobType?.replace('_', ' ') },
                            { label: 'Experience', val: `${job.minExperience}–${job.maxExperience} years` },
                            { label: 'Posted', val: job.postedAt || 'Recently' },
                        ].map((d) => (
                            <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-sm)' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>{d.label}</span>
                                <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{d.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            <Modal isOpen={applyOpen} onClose={() => setApplyOpen(false)} title="Apply for this Position" size="md">
                <form className="form" onSubmit={handleSubmit(onApply)}>
                    <div style={{ padding: '12px', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '8px' }}>
                        <strong style={{ color: 'var(--color-primary-light)', fontSize: 'var(--text-sm)' }}>
                            Applying for: {job.title} at {job.companyName}
                        </strong>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Education</label>
                        <input className={`form-input ${errors.education ? 'error' : ''}`} placeholder="e.g. BS Computer Science" {...register('education', { required: 'Required' })} />
                        {errors.education && <span className="form-error">⚠ {errors.education.message}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Years of Experience</label>
                        <input type="number" className={`form-input ${errors.yearsOfExperience ? 'error' : ''}`} placeholder="e.g. 5" {...register('yearsOfExperience', { required: 'Required', min: 0 })} />
                        {errors.yearsOfExperience && <span className="form-error">⚠ {errors.yearsOfExperience.message}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Resume URL</label>
                        <input className={`form-input ${errors.resumeUrl ? 'error' : ''}`} placeholder="https://drive.google.com/your-resume" {...register('resumeUrl', { required: 'Required' })} />
                        {errors.resumeUrl && <span className="form-error">⚠ {errors.resumeUrl.message}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Your Skills (press Enter to add)</label>
                        <div className="skills-tags">
                            {skills.map((s) => (
                                <span key={s} className="skill-tag">
                                    {s}
                                    <button type="button" className="skill-tag__remove" onClick={() => setSkills(skills.filter((x) => x !== s))}>✕</button>
                                </span>
                            ))}
                            <input
                                style={{ border: 'none', background: 'transparent', flex: 1, minWidth: '120px', padding: '4px 0', color: 'var(--color-text-primary)', outline: 'none', fontSize: 'var(--text-base)' }}
                                placeholder="e.g. React…"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={addSkill}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" className="btn btn--secondary btn--full" onClick={() => setApplyOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn--primary btn--full" disabled={applying}>
                            {applying ? <><span className="spinner" /> Submitting…</> : '🚀 Submit Application'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
