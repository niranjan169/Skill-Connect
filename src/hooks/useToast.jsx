import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

let addToastGlobal = null;

export function useToast() {
    const success = (message) => addToastGlobal?.({ type: 'success', message });
    const error = (message) => addToastGlobal?.({ type: 'error', message });
    const info = (message) => addToastGlobal?.({ type: 'info', message });
    const warning = (message) => addToastGlobal?.({ type: 'warning', message });
    return { success, error, info, warning };
}

export function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { ...toast, id }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    addToastGlobal = addToast;

    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };

    return createPortal(
        <div className="toast-container" style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 'var(--z-toast)',
            pointerEvents: 'none',
        }}>
            {toasts.map((t) => (
                <div
                    key={t.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'var(--color-bg-card2)',
                        border: `1px solid ${t.type === 'success' ? 'rgba(16,185,129,0.3)' :
                            t.type === 'error' ? 'rgba(239,68,68,0.3)' :
                                t.type === 'warning' ? 'rgba(245,158,11,0.3)' :
                                    'rgba(59,130,246,0.3)'
                            }`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '14px 18px',
                        boxShadow: 'var(--shadow-xl)',
                        backdropFilter: 'blur(20px)',
                        animation: 'toastSlide 0.3s ease forwards',
                        pointerEvents: 'all',
                        minWidth: '300px',
                        maxWidth: '420px',
                    }}
                >
                    <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '700',
                        flexShrink: 0,
                        background:
                            t.type === 'success' ? 'var(--color-success-light)' :
                                t.type === 'error' ? 'var(--color-danger-light)' :
                                    t.type === 'warning' ? 'var(--color-warning-light)' :
                                        'var(--color-info-light)',
                        color:
                            t.type === 'success' ? 'var(--color-success)' :
                                t.type === 'error' ? 'var(--color-danger)' :
                                    t.type === 'warning' ? 'var(--color-warning)' :
                                        'var(--color-info)',
                    }}>
                        {icons[t.type]}
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: '500' }}>
                        {t.message}
                    </span>
                </div>
            ))}
        </div>,
        document.body
    );
}
