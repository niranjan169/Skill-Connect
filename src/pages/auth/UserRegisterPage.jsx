import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../../hooks/useToast';

export default function UserRegisterPage() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

    const addSkill = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = skillInput.trim();
            if (val && !skills.includes(val)) setSkills([...skills, val]);
            setSkillInput('');
        }
    };

    const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const payload = {
                ...data,
                yearsOfExperience: data.yearsOfExperience ? parseInt(data.yearsOfExperience) : 0,
                skills
            };
            await authService.registerUser(payload);
            toast.success('Account created! Please sign in.');
            navigate('/login');
        } catch (err) {
            toast.error(err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container" style={{ maxWidth: '560px' }}>
                <div className="auth-card">
                    <div className="auth-logo">
                        <div className="auth-logo__icon">L</div>
                        <span className="auth-logo__text">LUZO PORTAL</span>
                    </div>

                    <h1 className="auth-title">Join as Candidate</h1>
                    <p className="auth-subtitle">Create your account and find your dream job</p>

                    <form className="form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                className={`form-input ${errors.fullName ? 'error' : ''}`}
                                placeholder="John Doe"
                                {...register('fullName', { required: 'Full Name is required' })}
                            />
                            {errors.fullName && <span className="form-error">⚠ {errors.fullName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                placeholder="you@example.com"
                                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                            />
                            {errors.email && <span className="form-error">⚠ {errors.email.message}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    placeholder="min 8 chars"
                                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
                                />
                                {errors.password && <span className="form-error">⚠ {errors.password.message}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input
                                    className="form-input"
                                    placeholder="New York, NY"
                                    {...register('location')}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Years of Experience</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="e.g. 3"
                                    {...register('yearsOfExperience')}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Education</label>
                                <input
                                    className="form-input"
                                    placeholder="e.g. Bachelor's in CS"
                                    {...register('education')}
                                />
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="form-group">
                            <label className="form-label">Skills (press Enter to add)</label>
                            <div className="skills-tags">
                                {skills.map((s) => (
                                    <span key={s} className="skill-tag">
                                        {s}
                                        <button type="button" className="skill-tag__remove" onClick={() => removeSkill(s)}>✕</button>
                                    </span>
                                ))}
                                <input
                                    className="form-input"
                                    style={{ border: 'none', background: 'transparent', flex: 1, minWidth: '120px', padding: '4px 0' }}
                                    placeholder="e.g. React, Java..."
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={addSkill}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
                            {loading ? <><span className="spinner" /> Creating account...</> : '🚀 Create Account'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
