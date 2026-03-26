import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import '../../styles/solar-auth.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/reset-password', { email, newPassword });
            toast.success(res.data.message || 'Password successfully reset!');
            setEmail('');
            setNewPassword('');
        } catch (err) {
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="solaris-card">
                <div className="auth-header">
                    <div className="auth-logo" style={{ background: 'var(--color-accent)' }}>?</div>
                    <h1 className="auth-title">Recovery</h1>
                    <p className="auth-subtitle">Restore access to your Solaris account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="solaris-group">
                        <label className="solaris-label">Registered Email</label>
                        <input 
                            type="email" 
                            className="solaris-input" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="solaris-group">
                        <label className="solaris-label">New Secure Password</label>
                        <input 
                            type="password" 
                            className="solaris-input" 
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="solaris-btn" style={{ background: 'var(--color-accent)' }} disabled={loading}>
                        {loading ? 'Restoring...' : '🔐 Reset Password'}
                    </button>
                </form>

                <div className="auth-footer">
                   Remembered? <Link to="/login" className="auth-link">Go Back</Link>
                </div>
            </div>
        </div>
    );
}
