import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

export default function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="app-shell">
            {/* Mobile overlay */}
            <div
                className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar */}
            <Sidebar
                collapsed={collapsed}
                onCollapse={() => setCollapsed(!collapsed)}
                mobileOpen={mobileOpen}
            />

            {/* Navbar */}
            <Navbar
                sidebarCollapsed={collapsed}
                onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
            />

            {/* Page content */}
            <main className={`main-content ${collapsed ? 'sidebar-collapsed' : ''} page-enter`}>
                <Outlet />
            </main>
        </div>
    );
}
