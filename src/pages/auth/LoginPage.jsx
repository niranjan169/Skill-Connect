import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import '../../styles/solar-auth.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userData = await login(email, password);
            toast.success(`Welcome back, ${userData.name}!`);
            
            // Route based on role
            if (userData.role === 'ADMIN') navigate('/admin');
            else if (userData.role === 'RECRUITER') navigate('/recruiter');
            else navigate('/user');
            
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
                    <div className="auth-logo">L</div>
                    <h1 className="auth-title">Solaris Login</h1>
                    <p className="auth-subtitle">Welcome back to the elite job portal</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="solaris-group">
                        <label className="solaris-label">Email Address</label>
                        <input 
                            type="email" 
                            className="solaris-input" 
                            placeholder="name@company.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="solaris-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <label className="solaris-label" style={{ marginBottom: 0 }}>Password</label>
                            <Link to="/forgot-password" size="sm" className="auth-link" style={{ fontSize: '13px' }}>Forgot?</Link>
                        </div>
                        <input 
                            type="password" 
                            className="solaris-input" 
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="solaris-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : '🚀 Sign In'}
                    </button>
                </form>

                <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>Don't have an account?</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <Link to="/register/user" className="auth-link">Candidate</Link>
                        <span>|</span>
                        <Link to="/register/recruiter" className="auth-link">Recruiter</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
