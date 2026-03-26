import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import '../../styles/solar-auth.css';

export default function UserRegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        location: '',
        yearsOfExperience: '',
        education: '',
    });
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) {
                setSkills([...skills, skillInput.trim()]);
            }
            setSkillInput('');
        }
    };

    const removeSkill = (s) => setSkills(skills.filter(x => x !== s));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { 
                ...formData, 
                yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
                skills 
            };
            await api.post('/auth/register/user', payload);
            toast.success('Solaris Account Created! Please Sign In.');
            navigate('/login');
        } catch (err) {
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="solaris-card" style={{ maxWidth: '600px' }}>
                <div className="auth-header" style={{ marginBottom: '32px' }}>
                    <div className="auth-logo">S</div>
                    <h1 className="auth-title">Candidate Entry</h1>
                    <p className="auth-subtitle">Begin your professional evolution</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="solaris-group">
                            <label className="solaris-label">Full Name</label>
                            <input name="fullName" className="solaris-input" required onChange={handleChange} />
                        </div>
                        <div className="solaris-group">
                            <label className="solaris-label">Email Address</label>
                            <input name="email" type="email" className="solaris-input" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className="solaris-group">
                        <label className="solaris-label">Password</label>
                        <input name="password" type="password" className="solaris-input" required onChange={handleChange} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="solaris-group">
                            <label className="solaris-label">Experience (Years)</label>
                            <input name="yearsOfExperience" type="number" className="solaris-input" required onChange={handleChange} />
                        </div>
                        <div className="solaris-group">
                            <label className="solaris-label">Location</label>
                            <input name="location" className="solaris-input" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className="solaris-group">
                        <label className="solaris-label">Education</label>
                        <input name="education" className="solaris-input" placeholder="e.g. B.Tech in Computer Science" required onChange={handleChange} />
                    </div>

                    <div className="solaris-group">
                        <label className="solaris-label">Skills (Press Enter to Add)</label>
                        <div style={{ 
                            display: 'flex', flexWrap: 'wrap', gap: '8px', 
                            padding: '12px', background: 'rgba(255,255,255,0.02)', 
                            border: '1px solid var(--glass-border)', borderRadius: '12px',
                            minHeight: '60px'
                        }}>
                            {skills.map(s => (
                                <span key={s} style={{ 
                                    background: 'rgba(99,102,241,0.15)', color: 'var(--color-primary)', 
                                    padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    border: '1px solid rgba(99,102,241,0.2)'
                                }}>
                                    {s}
                                    <span onClick={() => removeSkill(s)} style={{ cursor: 'pointer', opacity: 0.6 }}>✕</span>
                                </span>
                            ))}
                            <input 
                                className="solaris-input" 
                                style={{ border: 'none', background: 'transparent', flex: 1, padding: '4px 8px', height: 'auto', minWidth: '100px' }}
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={addSkill}
                                placeholder="..."
                            />
                        </div>
                    </div>

                    <button type="submit" className="solaris-btn" style={{ marginTop: '20px' }} disabled={loading}>
                        {loading ? 'Committing...' : '✨ Initialize Profile'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already part of Solaris? <Link to="/login" className="auth-link">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
