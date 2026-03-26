import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SolarisLayout from '../../components/layout/SolarisLayout';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';

export default function SavedJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        api.get('/user/saved-jobs')
            .then(res => setJobs(res.data))
            .catch(() => toast.error('Failed to load saved jobs'))
            .finally(() => setLoading(false));
    }, [toast]);

    const toggleSaveJob = async (jobId) => {
        try {
            await api.delete(`/user/jobs/${jobId}/save`);
            toast.success('Removed from saved jobs');
            setJobs(jobs.filter(j => j.id !== jobId));
        } catch (err) {
            toast.error('Failed to unsave job');
        }
    };

    const getMatchColor = (percent) => {
        if (!percent || percent < 40) return '#ef4444'; 
        if (percent < 75) return '#f59e0b'; 
        return '#10b981'; 
    };

    return (
        <SolarisLayout>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Watchlist Matrix</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Positions you have highlighted for future engagement.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {jobs.length > 0 ? jobs.map(job => {
                    const matchScore = job.matchPercentage || 0;
                    const strokeColor = getMatchColor(matchScore);
                    
                    return (
                    <div key={job.id} className="bento-item" style={{ padding: '32px', position: 'relative' }}>
                        <button 
                            onClick={() => toggleSaveJob(job.id)}
                            style={{ 
                                position: 'absolute', top: '24px', right: '24px', 
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                fontSize: '24px', color: '#ef4444', transition: 'all 0.2s ease'
                            }}
                            title="Remove from Watchlist"
                        >
                            ❤️
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
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                {job.minExperience} - {job.maxExperience || '*'} Yrs Exp
                            </div>
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
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '80px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                        {loading ? 'Decrypting matrix...' : 'Your watchlist is currently empty.'}
                    </div>
                )}
            </div>
        </SolarisLayout>
    );
}
