import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SolarisLayout from '../../components/layout/SolarisLayout';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import '../../styles/solaris-layout.css';

export default function JobDetailPage() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    
    // Application Form State
    const [resumeUrl, setResumeUrl] = useState('');
    const [education, setEducation] = useState('');
    const [experience, setExperience] = useState('');
    const [extraSkills, setExtraSkills] = useState('');
    
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/user/jobs/${id}`).then(res => {
            setJob(res.data);
        }).catch(() => {
            toast.error('Job not found');
            navigate('/user/jobs');
        }).finally(() => setLoading(false));
    }, [id, navigate]);

    const handleApply = async () => {
        if (!resumeUrl) {
            toast.error("A Hosted Resume URL is absolutely mandatory.");
            return;
        }
        setApplying(true);
        try {
            const payload = {
                jobId: parseInt(id),
                resumeUrl,
                education,
                yearsOfExperience: experience ? parseInt(experience) : 0,
                skills: extraSkills ? extraSkills.split(',').map(s => s.trim()) : []
            };
            await api.post('/user/applications', payload);
            toast.success('Solaris Application Transmitted!');
            setShowModal(false);
            setJob({ ...job, applied: true });
        } catch (err) {
            toast.error(err);
        } finally {
            setApplying(false);
        }
    };

    const toggleSaveJob = async () => {
        try {
            if (job.saved) {
                await api.delete(`/user/jobs/${job.id}/save`);
                toast.success('Removed from saved jobs');
            } else {
                await api.post(`/user/jobs/${job.id}/save`);
                toast.success('Job saved successfully');
            }
            setJob({ ...job, saved: !job.saved });
        } catch (err) {
            toast.error('Failed to toggle save state');
        }
    };

    const getMatchColor = (percent) => {
        if (!percent || percent < 40) return '#ef4444'; 
        if (percent < 75) return '#f59e0b'; 
        return '#10b981'; 
    };

    if (loading && !job) return (
        <SolarisLayout>
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '100px' }}>
                Resynchronizing Solaris Job Matrix...
            </div>
        </SolarisLayout>
    );

    if (!job) return null;

    const matchScore = job.matchPercentage || 0;
    const strokeColor = getMatchColor(matchScore);

    return (
        <SolarisLayout>
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="bento-item" style={{ width: '100%', maxWidth: '500px', padding: '40px', position: 'relative' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '20px' }}>✕</button>
                        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Job Application Form</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>Please attach your hosted resume link and clarify your capabilities.</p>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Resume URL (Drive, Dropbox, Portfolio link) *</label>
                            <input className="solaris-input" placeholder="https://your-portfolio.com/resume.pdf" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Highest Education Degree</label>
                            <input className="solaris-input" placeholder="e.g. Master's in Computer Science" value={education} onChange={e => setEducation(e.target.value)} />
                        </div>
                        <div style={{ marginBottom: '16px', display: 'flex', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Years Experience</label>
                                <input type="number" className="solaris-input" placeholder="2" value={experience} onChange={e => setExperience(e.target.value)} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Highlight Extra Skills (Comma separated)</label>
                            <input className="solaris-input" placeholder="e.g. React, Node.js" value={extraSkills} onChange={e => setExtraSkills(e.target.value)} />
                        </div>
                        
                        <button className="solaris-btn" onClick={handleApply} disabled={applying}>
                            {applying ? 'Submitting Application...' : 'Send Application Now'}
                        </button>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
                <div className="bento-item" style={{ padding: '48px', position: 'relative' }}>
                    <button 
                        onClick={toggleSaveJob}
                        style={{ 
                            position: 'absolute', top: '48px', right: '48px', 
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            fontSize: '32px', color: job.saved ? '#ef4444' : 'var(--text-muted)',
                            transition: 'all 0.2s ease'
                        }}
                        title={job.saved ? "Unsave Job" : "Save Job"}
                    >
                        {job.saved ? '❤️' : '🤍'}
                    </button>

                    <div style={{ marginBottom: '40px' }}>
                         <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                             <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
                         </div>
                         <h1 style={{ fontSize: '42px', marginBottom: '12px', paddingRight: '50px' }}>{job.title}</h1>
                         <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>{job.companyName} • {job.location}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '48px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                            <svg width="80" height="80" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke={strokeColor} strokeWidth="8"
                                    strokeDasharray={`${matchScore * 2.51} 251`}
                                    strokeDashoffset="0" transform="rotate(-90 50 50)" strokeLinecap="round" 
                                    style={{ transition: 'stroke-dasharray 1s ease-out' }} />
                            </svg>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: strokeColor }}>
                                {matchScore}%
                            </div>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '18px', marginBottom: '4px', color: '#fff' }}>Applicant Intelligence</h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                {matchScore >= 80 ? "You are a highly competitive candidate for this position based on your skill matrix." : 
                                 matchScore >= 50 ? "You possess a foundational subset of the required skills. Consider emphasizing related capabilities." : 
                                 "Your skill matrix indicates a potential disconnect. Review the required capabilities closely."}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '48px' }}>
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Experience</div>
                            <div style={{ fontWeight: 600 }}>{job.minExperience} - {job.maxExperience || '*'} Yrs</div>
                        </div>
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Compensation</div>
                            <div style={{ fontWeight: 600 }}>${job.minSalary?.toLocaleString() || 0} - ${job.maxSalary?.toLocaleString() || '∞'}</div>
                        </div>
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Engagement</div>
                            <div style={{ fontWeight: 600 }}>{job.jobType || 'FULL_TIME'}</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Position Intelligence</h2>
                        <div style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            {job.description}
                        </div>
                    </div>

                    <div>
                        <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Required Capability</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                            {job.skills?.map(s => (
                                <span key={s} style={{ 
                                    padding: '8px 20px', background: 'rgba(99,102,241,0.05)', 
                                    border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', 
                                    fontSize: '14px', color: 'var(--color-primary)', fontWeight: 600
                                }}>
                                    {s}
                                </span>
                            ))}
                        </div>
                        
                        {job.missingSkills && job.missingSkills.length > 0 && (
                            <div style={{ padding: '16px 20px', background: 'rgba(245,158,11,0.05)', borderLeft: '4px solid #f59e0b', borderRadius: '8px', fontSize: '14px', color: '#f59e0b' }}>
                                <strong style={{ display: 'block', marginBottom: '8px' }}>⚠️ Skill Gap Detected:</strong>
                                Your profile is missing the following vital capabilities: {job.missingSkills.join(', ')}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="bento-item" style={{ position: 'sticky', top: '100px' }}>
                        <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Ready to Evolve?</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                            Your profile will be transmitted directly to the hiring principal. Make sure your capabilities are up to date.
                        </p>
                        <button 
                            className="solaris-btn" 
                            style={{ 
                                background: job.applied ? 'transparent' : '',
                                border: job.applied ? '1px solid var(--glass-border)' : '',
                                color: job.applied ? 'var(--text-secondary)' : ''
                            }}
                            onClick={() => setShowModal(true)} 
                            disabled={applying || job.applied}
                        >
                            {job.applied ? 'Application Sent ✅' : '🚀 Click to Apply'}
                        </button>
                        
                        <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                            <h4 style={{ fontSize: '14px', marginBottom: '12px', color: '#fff' }}>Company Legacy</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                {job.companyAbout || 'A leading innovator in the Solaris ecosystem, focused on pushing boundaries of modern technology.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SolarisLayout>
    );
}
