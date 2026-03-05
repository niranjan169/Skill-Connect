import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_REDIRECTS = { USER: '/user/dashboard', RECRUITER: '/recruiter/dashboard', ADMIN: '/admin/dashboard' };

export default function NotFoundPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-bg-body)', padding: '20px', textAlign: 'center',
        }}>
            <div style={{ animation: 'bounce 2s ease infinite', fontSize: '80px', marginBottom: '24px' }}>🌌</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '8px' }}>404</h1>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '12px' }}>Page Not Found</h2>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', maxWidth: '400px', marginBottom: '32px' }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <button
                className="btn btn--primary btn--lg"
                onClick={() => navigate(isAuthenticated ? ROLE_REDIRECTS[user?.role] : '/login')}
            >
                {isAuthenticated ? '🏠 Go to Dashboard' : '→ Sign In'}
            </button>
        </div>
    );
}
