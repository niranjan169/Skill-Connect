import { useState, useEffect } from 'react';
import SolarisLayout from '../../components/layout/SolarisLayout';
import api from '../../services/api';
import '../../styles/solaris-layout.css';

export default function SystemLogsPage() {
    const [logs, setLogs] = useState([]);
    const [reports, setReports] = useState([]);
    const [activeTab, setActiveTab] = useState('REPORTS');

    useEffect(() => {
        if (activeTab === 'REPORTS') {
            api.get('/admin/reports').then(res => setReports(res.data)).catch(() => {});
        } else {
            api.get('/admin/activities').then(res => setLogs(res.data)).catch(() => {});
        }
    }, [activeTab]);

    const resolveReport = async (id) => {
        const note = window.prompt("Enter resolution notes:");
        if (note === null) return;
        try {
            await api.post(`/admin/reports/${id}/resolve?notes=${encodeURIComponent(note)}`);
            api.get('/admin/reports').then(res => setReports(res.data));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <SolarisLayout>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Ecosystem Telemetry</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Monitor system operations, security incidents, and user reports.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px' }}>
                    <button 
                        onClick={() => setActiveTab('REPORTS')} 
                        style={{ padding: '8px 24px', background: activeTab === 'REPORTS' ? 'var(--grad-solaris)' : 'transparent', color: activeTab === 'REPORTS' ? '#000' : 'var(--text-muted)', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}
                    >
                        User Reports
                    </button>
                    <button 
                        onClick={() => setActiveTab('LOGS')} 
                        style={{ padding: '8px 24px', background: activeTab === 'LOGS' ? 'var(--grad-solaris)' : 'transparent', color: activeTab === 'LOGS' ? '#000' : 'var(--text-muted)', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}
                    >
                        Security Logs
                    </button>
                </div>
            </div>

            <div className="bento-item">
                {activeTab === 'REPORTS' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>TRACKING ID</th>
                                <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>REPORTER ID</th>
                                <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>REASON / ENTITY</th>
                                <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((r) => (
                                <tr key={r.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '24px 20px', color: '#fff', fontSize: '14px', fontWeight: 600 }}>RPT-{r.id}</td>
                                    <td style={{ padding: '24px 20px', color: 'var(--text-secondary)', fontSize: '13px' }}>ID: {r.reporterId}</td>
                                    <td style={{ padding: '24px 20px' }}>
                                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>{r.reason}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target {r.entityType}: {r.entityId}</div>
                                        {r.adminNotes && <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(16,185,129,0.05)', borderRadius: '6px', color: '#10b981', fontSize: '12px' }}>Admin: {r.adminNotes}</div>}
                                    </td>
                                    <td style={{ padding: '24px 20px' }}>
                                        {r.status === 'PENDING' ? (
                                            <button onClick={() => resolveReport(r.id)} style={{ padding: '6px 12px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Investigate & Resolve</button>
                                        ) : (
                                            <span style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>RESOLVED</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {reports.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>No unresolved anomalies reported.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {activeTab === 'LOGS' && (
                    <div style={{ fontFamily: 'monospace', maxHeight: '600px', overflowY: 'auto' }}>
                        {logs.map((log) => (
                            <div key={log.id} style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.02)', display: 'grid', gridTemplateColumns: '150px 100px 200px 1fr', gap: '20px', alignItems: 'center' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{new Date(log.timestamp).toLocaleString()}</div>
                                <div style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600 }}>ID: {log.userId}</div>
                                <div style={{ color: log.action.includes('DELETED') || log.action.includes('BLOCK') ? '#ef4444' : '#10b981', fontSize: '13px', fontWeight: 600 }}>{log.action}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{log.details}</div>
                            </div>
                        ))}
                         {logs.length === 0 && (
                            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Telemetry stream is currently empty.</div>
                        )}
                    </div>
                )}
            </div>
        </SolarisLayout>
    );
}
