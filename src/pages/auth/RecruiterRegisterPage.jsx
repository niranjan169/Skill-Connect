import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../../hooks/useToast';

export default function RecruiterRegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await authService.registerRecruiter(data);
            toast.success('Recruiter account created! Awaiting admin approval.');
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

                    <h1 className="auth-title">Post Jobs as Recruiter</h1>
                    <p className="auth-subtitle">Create your recruiter account and start hiring</p>

                    <form className="form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    className={`form-input ${errors.fullName ? 'error' : ''}`}
                                    placeholder="Jane Smith"
                                    {...register('fullName', { required: 'Full Name is required' })}
                                />
                                {errors.fullName && <span className="form-error">⚠ {errors.fullName.message}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    placeholder="hr@company.com"
                                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                                />
                                {errors.email && <span className="form-error">⚠ {errors.email.message}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Company Name</label>
                                <input
                                    className={`form-input ${errors.companyName ? 'error' : ''}`}
                                    placeholder="Acme Corp"
                                    {...register('companyName', { required: 'Company name is required' })}
                                />
                                {errors.companyName && <span className="form-error">⚠ {errors.companyName.message}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Company Website</label>
                                <input
                                    className={`form-input ${errors.companyWebsite ? 'error' : ''}`}
                                    placeholder="https://acme.com"
                                    {...register('companyWebsite', { required: 'Company website is required' })}
                                />
                                {errors.companyWebsite && <span className="form-error">⚠ {errors.companyWebsite.message}</span>}
                            </div>
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
                                <label className="form-label">Company Location</label>
                                <input
                                    className={`form-input ${errors.companyLocation ? 'error' : ''}`}
                                    placeholder="San Francisco, CA"
                                    {...register('companyLocation', { required: 'Company location is required' })}
                                />
                                {errors.companyLocation && <span className="form-error">⚠ {errors.companyLocation.message}</span>}
                            </div>
                        </div>

                        {/* Notice */}
                        <div style={{
                            padding: '12px 16px',
                            background: 'var(--color-warning-light)',
                            border: '1px solid rgba(245,158,11,0.25)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--color-warning)',
                        }}>
                            ⚠️ Recruiter accounts require admin approval before you can post jobs.
                        </div>

                        <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
                            {loading ? <><span className="spinner" /> Creating account...</> : '🏢 Create Recruiter Account'}
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
