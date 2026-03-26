import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SolarisLayout from '../../components/layout/SolarisLayout';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import '../../styles/solaris-layout.css';

const STATUS_OPTIONS = ['APPLIED', 'SHORTLISTED', 'REJECTED', 'SELECTED'];

export default function ApplicationsManagementPage() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const jobId = searchParams.get('jobId') || 'all';
    const toast = useToast();

    useEffect(() => {
        fetchApps();
    }, [jobId]);

    const fetchApps = () => {
        setLoading(true);
        api.get(`/recruiter/jobs/${jobId}/applicants`).then(res => {
            // Automatically rank candidates by Match Percentage
            const sortedApps = res.data.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
            setApps(sortedApps);
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    const updateStatus = async (appId, status) => {
        try {
            await api.patch(`/recruiter/applications/${appId}?status=${status}`);
            toast.success(`Candidate pipeline state advanced to ${status}`);
            fetchApps();
        } catch (err) {
            toast.error(err);
        }
    };

    const getMatchColor = (percent) => {
        if (!percent || percent < 40) return '#ef4444'; 
        if (percent < 75) return '#f59e0b'; 
        return '#10b981'; 
    };

    return (
        <SolarisLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Acquisition Pipeline</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {jobId === 'all' ? 'Review tomorrow\'s talent and curate your elite team based on Solaris Matrix Intelligence.' 
                                       : `Exhibiting exclusive candidates for Position ID: ${jobId}`}
                    </p>
                </div>
                {jobId !== 'all' && (
                    <Link to="/recruiter/applications" className="auth-link" style={{ fontSize: '14px' }}>
                        ← Show All Applicants
                    </Link>
                )}
            </div>

            <div className="bento-item">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>CANDIDATE</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>SOLARIS FIT</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>POSITION & CREDENTIALS</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>INTELLIGENCE GAPS</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>PIPELINE STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apps.length > 0 ? apps.map(app => {
                            const matchScore = app.matchPercentage || 0;
                            const matchColor = getMatchColor(matchScore);
                            return (
                            <tr key={app.applicationId} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '24px 20px' }}>
                                    <div style={{ fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{app.candidateName}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{app.candidateEmail}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Exp: {app.yearsOfExperience} Yrs</div>
                                </td>
                                <td style={{ padding: '24px 20px' }}>
                                    <div style={{ 
                                        width: '40px', height: '40px', borderRadius: '50%', 
                                        border: `2px solid ${matchColor}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '12px', fontWeight: 800, color: matchColor
                                    }}>
                                        {matchScore}%
                                    </div>
                                </td>
                                <td style={{ padding: '24px 20px', color: 'var(--text-secondary)' }}>
                                    <div style={{ fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{app.jobTitle}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{app.candidateEducation || 'N/A Edu'}</div>
                                    {app.resumeUrl && (
                                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', color: 'var(--color-primary)', textDecoration: 'none' }}>
                                            🔗 View Resume
                                        </a>
                                    )}
                                </td>
                                <td style={{ padding: '24px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                    {app.missingSkills && app.missingSkills.length > 0 ? (
                                        <div>
                                            <span style={{ color: '#ef4444', fontWeight: 600 }}>Missing:</span>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                                                {app.missingSkills.slice(0, 3).map(s => (
                                                    <span key={s} style={{ padding: '2px 6px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '4px', fontSize: '11px' }}>{s}</span>
                                                ))}
                                                {app.missingSkills.length > 3 && <span style={{ fontSize: '10px' }}>+{app.missingSkills.length - 3}</span>}
                                            </div>
                                        </div>
                                    ) : (
                                        <span style={{ color: '#10b981', fontWeight: 600 }}>Perfect Matrix Match</span>
                                    )}
                                </td>
                                <td style={{ padding: '24px 20px' }}>
                                    <select 
                                        value={app.status} 
                                        onChange={(e) => updateStatus(app.applicationId, e.target.value)}
                                        style={{ 
                                            padding: '8px 12px', background: 'rgba(255,255,255,0.03)', 
                                            border: '1px solid var(--glass-border)', borderRadius: '8px', 
                                            color: 'white', fontSize: '13px', cursor: 'pointer', outline: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt} value={opt} style={{ background: '#111827' }}>{opt}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        )}) : (
                            <tr>
                                <td colSpan="5" style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    {loading ? 'Scanning talent network...' : 'No applications found in the current pipeline.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </SolarisLayout>
    );
}
