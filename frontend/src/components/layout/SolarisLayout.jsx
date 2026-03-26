import SolarisSidebar from './SolarisSidebar';
import SolarisNavbar from './SolarisNavbar';
import { useAuth } from '../../context/AuthContext';
import '../../styles/solaris-layout.css';

export default function SolarisLayout({ children }) {
    const { user } = useAuth();

    return (
        <div className="solaris-layout">
            <SolarisSidebar role={user?.role} />
            <SolarisNavbar />
            <main className="solaris-main">
                {children}
            </main>
        </div>
    );
}
