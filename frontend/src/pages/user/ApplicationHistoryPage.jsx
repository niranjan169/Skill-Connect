import { useState, useEffect } from 'react';
import SolarisLayout from '../../components/layout/SolarisLayout';
import api from '../../services/api';
import '../../styles/solaris-layout.css';

const STATUS_MAP = {
    APPLIED: { label: 'Applied', color: 'var(--color-primary)', bg: 'rgba(99,102,241,0.1)' },
    SHORTLISTED: { label: 'Shortlisted', color: 'var(--color-secondary)', bg: 'rgba(16,185,129,0.1)' },
    REJECTED: { label: 'Declined', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    SELECTED: { label: 'Selected', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
};

export default function ApplicationHistoryPage() {
    const [apps, setApps] = useState([]);

    useEffect(() => {
        api.get('/user/applications').then(res => setApps(res.data)).catch(() => {});
    }, []);

    return (
        <SolarisLayout>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Application Legacy</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track your professional footprint across the Solaris network.</p>
            </div>

            <div className="bento-item">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>POSITION</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>COMPANY</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>APPLIED ON</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apps.length > 0 ? apps.map(app => {
                            const s = STATUS_MAP[app.status] || STATUS_MAP.APPLIED;
                            return (
                                <tr key={app.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '24px 20px', fontWeight: 600, color: '#fff' }}>{app.jobTitle}</td>
                                    <td style={{ padding: '24px 20px', color: 'var(--text-secondary)' }}>{app.companyName}</td>
                                    <td style={{ padding: '24px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                        {new Date(app.appliedAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '24px 20px' }}>
                                        <span style={{ 
                                            padding: '6px 12px', background: s.bg, color: s.color, 
                                            borderRadius: '8px', fontSize: '12px', fontWeight: 800,
                                            border: `1px solid ${s.color}22`
                                        }}>
                                            {s.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Your professional legacy is currently empty. Start applying!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </SolarisLayout>
    );
}
