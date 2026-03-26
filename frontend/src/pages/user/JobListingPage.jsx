import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SolarisLayout from '../../components/layout/SolarisLayout';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import '../../styles/solaris-layout.css';

export default function JobListingPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter State
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [minExperience, setMinExperience] = useState('');
    const [skillsString, setSkillsString] = useState('');

    const toast = useToast();

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const filterRequest = {};
            if (title) filterRequest.title = title;
            if (location) filterRequest.location = location;
            if (jobType) filterRequest.jobType = jobType;
            if (minExperience) filterRequest.minExperience = parseInt(minExperience, 10);
            if (skillsString) {
                filterRequest.skills = skillsString.split(',').map(s => s.trim()).filter(Boolean);
            }

            const res = await api.post('/user/jobs/search', filterRequest);
            setJobs(res.data);
        } catch (err) {
            toast.error('Failed to load opportunities');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const toggleSaveJob = async (jobId, isCurrentlySaved) => {
        try {
            if (isCurrentlySaved) {
                await api.delete(`/user/jobs/${jobId}/save`);
                toast.success('Removed from saved jobs');
            } else {
                await api.post(`/user/jobs/${jobId}/save`);
                toast.success('Job saved successfully');
            }
            setJobs(jobs.map(j => j.id === jobId ? { ...j, saved: !isCurrentlySaved } : j));
        } catch (err) {
            toast.error('Failed to toggle save state');
        }
    };

    const getMatchColor = (percent) => {
        if (!percent || percent < 40) return '#ef4444'; // Red
        if (percent < 75) return '#f59e0b'; // Orange
        return '#10b981'; // Green
    };

    return (
        <SolarisLayout>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Solaris Browse</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Explore elite opportunities curated for your trajectory.</p>
            </div>

            <div style={{ 
                marginBottom: '32px', padding: '24px', 
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)',
                borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px'
            }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Title or Company</label>
                        <input className="solaris-input" placeholder="e.g. Frontend Engineer" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Location</label>
                        <input className="solaris-input" placeholder="e.g. Remote, NY" value={location} onChange={e => setLocation(e.target.value)} />
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Required Skills (comma separated)</label>
                        <input className="solaris-input" placeholder="e.g. React, Java" value={skillsString} onChange={e => setSkillsString(e.target.value)} />
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 150px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Job Type</label>
                        <select className="solaris-input" style={{ width: '100%', minHeight: '50px' }} value={jobType} onChange={e => setJobType(e.target.value)}>
                            <option value="">All Types</option>
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                            <option value="CONTRACT">Contract</option>
                            <option value="FREELANCE">Freelance</option>
                            <option value="INTERNSHIP">Internship</option>
                        </select>
                    </div>
                    <div style={{ flex: '1 1 150px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Min Experience (Yrs)</label>
                        <input type="number" className="solaris-input" placeholder="0" value={minExperience} onChange={e => setMinExperience(e.target.value)} min="0" />
                    </div>
                    <button className="solaris-btn" style={{ width: 'auto', padding: '0 40px', height: '50px' }} onClick={fetchJobs}>
                        {loading ? 'Searching...' : '🔍 Apply Filters'}
                    </button>
                    <button className="solaris-btn" style={{ width: 'auto', padding: '0 20px', height: '50px', background: 'transparent', border: '1px solid var(--glass-border)' }} onClick={() => {
                        setTitle(''); setLocation(''); setJobType(''); setMinExperience(''); setSkillsString(''); fetchJobs();
                    }}>
                        Clear
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {jobs.length > 0 ? jobs.map(job => {
                    const matchScore = job.matchPercentage || 0;
                    const strokeColor = getMatchColor(matchScore);
                    
                    return (
                    <div key={job.id} className="bento-item" style={{ padding: '32px', position: 'relative' }}>
                        <button 
                            onClick={() => toggleSaveJob(job.id, job.saved)}
                            style={{ 
                                position: 'absolute', top: '24px', right: '24px', 
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                fontSize: '24px', color: job.saved ? '#ef4444' : 'var(--text-muted)',
                                transition: 'all 0.2s ease'
                            }}
                            title={job.saved ? "Unsave Job" : "Save Job"}
                        >
                            {job.saved ? '❤️' : '🤍'}
                        </button>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', paddingRight: '40px' }}>
                            {/* Match Radial Dial */}
                            <div style={{ position: 'relative', width: '60px', height: '60px', flexShrink: 0 }}>
                                <svg width="60" height="60" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                    <circle cx="50" cy="50" r="40" fill="none" stroke={strokeColor} strokeWidth="8"
                                        strokeDasharray={`${matchScore * 2.51} 251`}
                                        strokeDashoffset="0" transform="rotate(-90 50 50)" strokeLinecap="round" 
                                        style={{ transition: 'stroke-dasharray 1s ease-out' }} />
                                </svg>
                                <div style={{ 
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    fontSize: '14px', fontWeight: 800, color: strokeColor 
                                }}>
                                    {matchScore}%
                                </div>
                            </div>
                            
                            <div>
                                <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '6px' }}>{job.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{job.companyName} • {job.location}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ 
                                background: 'rgba(16,185,129,0.1)', color: 'var(--color-secondary)',
                                padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800
                            }}>
                                {job.jobType || 'FULL_TIME'}
                            </div>
                            {job.minExperience > 0 && (
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                    {job.minExperience} - {job.maxExperience || '*'} Yrs Exp
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                            {job.skills?.slice(0, 4).map(s => (
                                <span key={s} style={{ 
                                    padding: '4px 10px', background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid var(--glass-border)', borderRadius: '6px', 
                                    fontSize: '11px', color: 'var(--text-secondary)'
                                }}>
                                    {s}
                                </span>
                            ))}
                            {job.skills?.length > 4 && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>+{job.skills.length - 4} more</span>}
                        </div>

                        {job.missingSkills && job.missingSkills.length > 0 && (
                            <div style={{ marginBottom: '24px', fontSize: '12px', color: '#f59e0b', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span>⚠️ Missing Vital Skills:</span>
                                {job.missingSkills.slice(0, 2).map(ms => <strong key={ms}>{ms}</strong>)}
                                {job.missingSkills.length > 2 && <span>+{job.missingSkills.length - 2} more</span>}
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                                ${job.minSalary?.toLocaleString() || 0} - ${job.maxSalary?.toLocaleString() || '∞'}
                            </div>
                            <Link to={`/user/jobs/${job.id}`} className="solaris-btn" style={{ width: 'auto', padding: '10px 24px', fontSize: '14px' }}>
                                Detailed Intel →
                            </Link>
                        </div>
                    </div>
                )}) : (
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
                        {loading ? 'Commencing scan...' : 'No opportunities matching your criteria were found.'}
                    </div>
                )}
            </div>
        </SolarisLayout>
    );
}
