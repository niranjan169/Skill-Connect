import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../../hooks/useToast';

export default function AdminRegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await authService.registerAdmin(data);
            toast.success('Admin account created! Please sign in.');
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

                    <h1 className="auth-title">System Administration</h1>
                    <p className="auth-subtitle">Create an administrator account</p>

                    <form className="form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                className={`form-input ${errors.fullName ? 'error' : ''}`}
                                placeholder="Admin User"
                                {...register('fullName', { required: 'Name is required' })}
                            />
                            {errors.fullName && <span className="form-error">⚠ {errors.fullName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                placeholder="admin@luzo.com"
                                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                            />
                            {errors.email && <span className="form-error">⚠ {errors.email.message}</span>}
                        </div>

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

                        <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
                            {loading ? <><span className="spinner" /> Creating account...</> : '🛡️ Create Admin Account'}
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
