import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLE_REDIRECTS = {
    USER: '/user/dashboard',
    RECRUITER: '/recruiter/dashboard',
    ADMIN: '/admin/dashboard',
};

export default function Navbar({ sidebarCollapsed, onMobileMenuToggle }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            // Best-effort: tell the backend to invalidate the refresh token
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

    const getInitials = (name = '') =>
        name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    const roleBadgeColor = {
        USER: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
        RECRUITER: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
        ADMIN: { bg: 'var(--color-danger-light)', color: 'var(--color-danger)' },
    };
    const roleStyle = roleBadgeColor[user?.role] || roleBadgeColor.USER;

    return (
        <nav className={`navbar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Left */}
            <div className="navbar__left">
                {/* Mobile hamburger */}
                <button
                    className="navbar__icon-btn hide-desktop"
                    onClick={onMobileMenuToggle}
                    style={{ display: 'flex' }}
                >
                    ☰
                </button>
                <div>
                    <div className="navbar__page-title">LUZO PORTAL</div>
                    <div className="navbar__breadcrumb">{user?.role?.charAt(0) + user?.role?.slice(1)?.toLowerCase()} Portal</div>
                </div>
            </div>

            {/* Right */}
            <div className="navbar__right">
                {/* Notification bell */}
                <button className="navbar__icon-btn" title="Notifications">
                    🔔
                    <span className="navbar__notification-badge">3</span>
                </button>

                {/* Profile Dropdown */}
                <div className="profile-dropdown" ref={dropdownRef}>
                    <button
                        className={`profile-dropdown__trigger ${dropdownOpen ? 'open' : ''}`}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="profile-dropdown__avatar">
                            {getInitials(user?.name || user?.username)}
                        </div>
                        <span className="profile-dropdown__name hide-mobile">
                            {user?.name || user?.username || 'User'}
                        </span>
                        <span className="profile-dropdown__chevron">▼</span>
                    </button>

                    {dropdownOpen && (
                        <div className="profile-dropdown__menu">
                            {/* User info header */}
                            <div className="profile-dropdown__user-info">
                                <div className="profile-dropdown__user-name">
                                    {user?.name || user?.username}
                                </div>
                                <div className="profile-dropdown__user-email">
                                    {user?.email}
                                </div>
                                <span
                                    className="profile-dropdown__role-badge"
                                    style={{
                                        background: roleStyle.bg,
                                        color: roleStyle.color,
                                    }}
                                >
                                    {user?.role}
                                </span>
                            </div>

                            {/* Menu items */}
                            <div className="profile-dropdown__items">
                                <button
                                    className="profile-dropdown__item"
                                    onClick={() => {
                                        const dash = ROLE_REDIRECTS[user?.role];
                                        navigate(dash);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    <span className="profile-dropdown__item-icon">🏠</span>
                                    Dashboard
                                </button>

                                {user?.role === 'USER' && (
                                    <button
                                        className="profile-dropdown__item"
                                        onClick={() => { navigate('/user/applications'); setDropdownOpen(false); }}
                                    >
                                        <span className="profile-dropdown__item-icon">📋</span>
                                        My Applications
                                    </button>
                                )}

                                <div className="profile-dropdown__divider" />

                                <button
                                    className="profile-dropdown__item profile-dropdown__item--danger"
                                    onClick={handleLogout}
                                >
                                    <span className="profile-dropdown__item-icon">🚪</span>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
}
