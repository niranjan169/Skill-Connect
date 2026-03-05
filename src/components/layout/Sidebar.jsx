import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = {
    USER: [
        { label: 'Dashboard', path: '/user/dashboard', icon: '🏠' },
        { label: 'Browse Jobs', path: '/user/jobs', icon: '💼' },
        { label: 'My Applications', path: '/user/applications', icon: '📋' },
        { label: 'Saved Jobs', path: '/user/saved', icon: '❤️' },
        { label: 'My Profile', path: '/user/profile', icon: '👤' },
    ],
    RECRUITER: [
        { label: 'Dashboard', path: '/recruiter/dashboard', icon: '🏠' },
        { label: 'Post a Job', path: '/recruiter/jobs/create', icon: '➕' },
        { label: 'Manage Jobs', path: '/recruiter/jobs', icon: '💼' },
        { label: 'Applications', path: '/recruiter/applications', icon: '📋' },
        { label: 'Profile', path: '/recruiter/profile', icon: '👤' },
    ],
    ADMIN: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
        { label: 'Manage Users', path: '/admin/users', icon: '👥' },
        { label: 'Recruiters', path: '/admin/recruiters', icon: '🏢' },
        { label: 'All Jobs', path: '/admin/jobs', icon: '💼' },
        { label: 'Applications', path: '/admin/applications', icon: '📋' },
    ],
};

export default function Sidebar({ collapsed, onCollapse, mobileOpen }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const navItems = NAV_ITEMS[user?.role] || [];

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                await fetch('http://localhost:8080/api/auth/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });
            } catch { /* ignore — local logout always proceeds */ }
        }
        logout();
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
            {/* Logo */}
            <div className="sidebar__logo">
                <div className="sidebar__logo-icon">L</div>
                <span className="sidebar__logo-text">LUZO PORTAL</span>
            </div>

            {/* Navigation */}
            <nav className="sidebar__nav">
                {!collapsed && (
                    <div className="sidebar__section-title">
                        {user?.role} MENU
                    </div>
                )}

                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar__nav-item ${isActive ? 'active' : ''}`
                        }
                        title={collapsed ? item.label : ''}
                    >
                        <span className="sidebar__nav-icon">{item.icon}</span>
                        <span className="sidebar__nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar__footer">
                {/* User info */}
                {!collapsed && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        marginBottom: '8px',
                        background: 'var(--color-bg-hover)',
                        borderRadius: 'var(--radius-md)',
                    }}>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'var(--gradient-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: 'white',
                            flexShrink: 0,
                        }}>
                            {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.name || user?.username}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{user?.role}</div>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <button
                    className="sidebar__nav-item"
                    onClick={handleLogout}
                    style={{ color: 'var(--color-danger)', width: '100%' }}
                >
                    <span className="sidebar__nav-icon">🚪</span>
                    <span className="sidebar__nav-label">Sign Out</span>
                </button>

                {/* Toggle collapse */}
                <button className="sidebar__toggle" onClick={onCollapse} style={{ marginTop: '8px' }}>
                    {!collapsed && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Collapse</span>}
                    <span>{collapsed ? '→' : '←'}</span>
                </button>
            </div>
        </aside>
    );
}
