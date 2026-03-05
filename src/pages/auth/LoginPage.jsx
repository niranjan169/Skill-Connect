import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useToast } from '../../hooks/useToast';

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const ROLE_REDIRECTS = {
        USER: '/user/dashboard',
        RECRUITER: '/recruiter/dashboard',
        ADMIN: '/admin/dashboard',
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await authService.loginUser(data);
            const { token, refreshToken, role, user, name, email, username } = res.data;

            // Backend returns: { token, refreshToken, role, userId, email, fullName }
            const userData = {
                role: role || (user?.role),
                name: name || (user?.name) || username || (user?.username) || 'User',
                email: email || (user?.email),
                username: username || (user?.username),
            };

            if (!token || !userData.role) {
                throw new Error('Invalid server response');
            }

            login(token, refreshToken, userData);
            toast.success(`Welcome back, ${userData.name}!`);
            navigate(ROLE_REDIRECTS[userData.role] || '/login');
        } catch (err) {
            toast.error(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    {/* Logo */}
                    <div className="auth-logo">
                        <div className="auth-logo__icon">L</div>
                        <span className="auth-logo__text">LUZO PORTAL</span>
                    </div>

                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to your account to continue</p>

                    <form className="form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                placeholder="you@example.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                                })}
                            />
                            {errors.email && <span className="form-error">⚠ {errors.email.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder="••••••••"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'At least 6 characters' },
                                })}
                            />
                            {errors.password && <span className="form-error">⚠ {errors.password.message}</span>}
                        </div>

                        <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
                            {loading ? <><span className="spinner" /> Signing in...</> : '→ Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ textAlign: 'center', margin: '24px 0 16px', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                        Don&apos;t have an account?
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Link to="/register/user" className="btn btn--secondary" style={{ flex: 1, minWidth: '140px', justifyContent: 'center' }}>
                            Register as Candidate
                        </Link>
                        <Link to="/register/recruiter" className="btn btn--secondary" style={{ flex: 1, minWidth: '140px', justifyContent: 'center' }}>
                            Register as Recruiter
                        </Link>
                        <Link to="/register/admin" className="btn btn--secondary" style={{ flex: 1, minWidth: '140px', justifyContent: 'center' }}>
                            Register as Admin
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
