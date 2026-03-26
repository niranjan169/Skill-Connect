import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/solaris-layout.css';

export default function SolarisNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        const path = user?.role === 'RECRUITER' ? '/recruiter/profile' : user?.role === 'ADMIN' ? '/admin' : '/user/profile';
        navigate(path);
    };

    return (
        <header className="solaris-navbar">
            <div className="nav-search">
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search Solaris..." 
                        style={{ 
                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                            borderRadius: '10px', padding: '10px 16px 10px 40px', color: 'white',
                            width: '300px', fontSize: '14px', outline: 'none'
                        }}
                    />
                </div>
            </div>

            <div className="nav-actions">
                <div className="nav-profile" onClick={handleProfileClick} title="View Profile">
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{user?.name || 'Solaris User'}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role?.toLowerCase()} profile</span>
                    </div>
                    <div className="profile-img">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                </div>

                <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 8px' }}></div>

                <button 
                    onClick={logout} 
                    className="solaris-btn" 
                    style={{ 
                        width: 'auto', padding: '8px 16px', fontSize: '12px', 
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444'
                    }}
                >
                    Logout 👋
                </button>
            </div>
        </header>
    );
}
