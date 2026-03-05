import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { recruiterService } from '../../services/recruiterService';
import { useToast } from '../../hooks/useToast';

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'];

export default function CreateJobPage() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

    const addSkill = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const v = skillInput.trim();
            if (v && !skills.includes(v)) setSkills([...skills, v]);
            setSkillInput('');
        }
    };

    const onSubmit = async (data) => {
        if (skills.length === 0) { toast.warning('Please add at least one required skill.'); return; }
        setLoading(true);
        try {
            await recruiterService.createJob({
                ...data,
                requiredSkills: skills,
                minSalary: Number(data.minSalary),
                maxSalary: Number(data.maxSalary),
                minExperience: Number(data.minExperience),
                maxExperience: Number(data.maxExperience),
            });
            toast.success('Job posted! Awaiting admin approval.');
            reset();
            setSkills([]);
            navigate('/recruiter/jobs');
        } catch (err) {
            toast.error(err.message || 'Failed to post job.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-enter">
            <div className="page-header">
                <h1 className="page-header__title">Post a New Job</h1>
                <p className="page-header__subtitle">Fill in the details below to attract the best candidates</p>
            </div>

            <div style={{ maxWidth: '760px' }}>
                <div className="card">
                    <form className="form" onSubmit={handleSubmit(onSubmit)}>
                        {/* Basic Info */}
                        <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--color-border)', marginBottom: '8px' }}>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                                📋 Basic Information
                            </div>
                            <div className="form-group">
                                <label className="form-label">Job Title *</label>
                                <input
                                    className={`form-input ${errors.title ? 'error' : ''}`}
                                    placeholder="e.g. Senior React Developer"
                                    {...register('title', { required: 'Job title is required' })}
                                />
                                {errors.title && <span className="form-error">⚠ {errors.title.message}</span>}
                            </div>

                            <div className="form-group" style={{ marginTop: '16px' }}>
                                <label className="form-label">Company Name (Optional)</label>
                                <input
                                    className="form-input"
                                    placeholder="e.g. Luzo Corp (Leave blank to use profile name)"
                                    {...register('companyName')}
                                />
                            </div>

                            <div className="form-group" style={{ marginTop: '16px' }}>
                                <label className="form-label">Job Description *</label>
                                <textarea
                                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                                    rows={5}
                                    placeholder="Describe the role, responsibilities, and requirements…"
                                    {...register('description', { required: 'Description is required', minLength: { value: 50, message: 'At least 50 characters' } })}
                                />
                                {errors.description && <span className="form-error">⚠ {errors.description.message}</span>}
                            </div>
                        </div>

                        {/* Location & Type */}
                        <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                                📍 Location & Type
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Location *</label>
                                    <input
                                        className={`form-input ${errors.location ? 'error' : ''}`}
                                        placeholder="City, State or Remote"
                                        {...register('location', { required: 'Location is required' })}
                                    />
                                    {errors.location && <span className="form-error">⚠ {errors.location.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Job Type *</label>
                                    <select className={`form-select ${errors.jobType ? 'error' : ''}`} {...register('jobType', { required: 'Select a job type' })}>
                                        <option value="">Select type…</option>
                                        {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                                    </select>
                                    {errors.jobType && <span className="form-error">⚠ {errors.jobType.message}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Salary & Experience */}
                        <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                                💰 Compensation & Experience
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Min Salary (USD) *</label>
                                    <input type="number" className={`form-input ${errors.minSalary ? 'error' : ''}`} placeholder="50000" {...register('minSalary', { required: 'Required' })} />
                                    {errors.minSalary && <span className="form-error">⚠ {errors.minSalary.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Max Salary (USD) *</label>
                                    <input type="number" className={`form-input ${errors.maxSalary ? 'error' : ''}`} placeholder="100000" {...register('maxSalary', { required: 'Required' })} />
                                    {errors.maxSalary && <span className="form-error">⚠ {errors.maxSalary.message}</span>}
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Min Experience (years)</label>
                                    <input type="number" className="form-input" placeholder="0" {...register('minExperience')} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Max Experience (years)</label>
                                    <input type="number" className="form-input" placeholder="10" {...register('maxExperience')} />
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                                🛠️ Required Skills
                            </div>
                            <div className="form-group">
                                <label className="form-label">Add skills (press Enter)</label>
                                <div className="skills-tags">
                                    {skills.map((s) => (
                                        <span key={s} className="skill-tag">
                                            {s}
                                            <button type="button" className="skill-tag__remove" onClick={() => setSkills(skills.filter((x) => x !== s))}>✕</button>
                                        </span>
                                    ))}
                                    <input
                                        style={{ border: 'none', background: 'transparent', flex: 1, minWidth: '140px', padding: '4px 0', color: 'var(--color-text-primary)', outline: 'none', fontSize: 'var(--text-base)' }}
                                        placeholder="e.g. React, Java, Docker…"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={addSkill}
                                    />
                                </div>
                                {skills.length === 0 && <span className="form-hint">Add at least one required skill</span>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                            <button type="button" className="btn btn--secondary" onClick={() => navigate(-1)}>Cancel</button>
                            <button type="submit" className="btn btn--primary btn--lg" disabled={loading} style={{ flex: 1 }}>
                                {loading ? <><span className="spinner" /> Posting…</> : '🚀 Post Job'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
