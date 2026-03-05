import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_REDIRECTS = {
    USER: '/user/dashboard',
    RECRUITER: '/recruiter/dashboard',
    ADMIN: '/admin/dashboard',
};

export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg-body)',
            }}>
                <div className="spinner spinner--lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect to their own dashboard
        const redirect = ROLE_REDIRECTS[user?.role] || '/login';
        return <Navigate to={redirect} replace />;
    }

    return <Outlet />;
}
