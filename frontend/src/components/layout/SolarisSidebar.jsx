import { NavLink } from 'react-router-dom';
import '../../styles/solaris-layout.css';

const UserLinks = [
    { name: 'Dashboard', to: '/user', icon: '💎' },
    { name: 'Browse Jobs', to: '/user/jobs', icon: '🔍' },
    { name: 'My Applications', to: '/user/applications', icon: '📋' },
    { name: 'Saved Jobs', to: '/user/saved-jobs', icon: '❤️' },
    { name: 'My Profile', to: '/user/profile', icon: '👤' },
];

const RecruiterLinks = [
    { name: 'Dashboard', to: '/recruiter', icon: '📊' },
    { name: 'Post a Job', to: '/recruiter/jobs/create', icon: '➕' },
    { name: 'Manage Jobs', to: '/recruiter/jobs', icon: '💼' },
    { name: 'Applications', to: '/recruiter/applications', icon: '👥' },
];

const AdminLinks = [
    { name: 'Overview', to: '/admin', icon: '📈' },
    { name: 'Users', to: '/admin/users', icon: '👥' },
    { name: 'Recruiters', to: '/admin/recruiters', icon: '🏢' },
    { name: 'Jobs', to: '/admin/jobs', icon: '💼' },
    { name: 'System Logs', to: '/admin/logs', icon: '📜' },
];

export default function SolarisSidebar({ role }) {
    const links = role === 'ADMIN' ? AdminLinks : role === 'RECRUITER' ? RecruiterLinks : UserLinks;

    return (
        <aside className="solaris-sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo__icon">L</div>
                <span className="sidebar-logo__text">LUZO SOLARIS</span>
            </div>

            <nav className="sidebar-nav">
                {links.map(link => (
                    <NavLink 
                        key={link.to} 
                        to={link.to} 
                        end={link.to === '/user' || link.to === '/recruiter' || link.to === '/admin'}
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                    >
                        <span style={{ fontSize: '20px' }}>{link.icon}</span>
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                Solaris v2.0 <br />
                Pristine Edition
            </div>
        </aside>
    );
}
