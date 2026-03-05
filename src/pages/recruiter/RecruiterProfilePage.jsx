import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { recruiterService } from '../../services/recruiterService';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';

export default function RecruiterProfilePage() {
    const { user } = useAuth();
    const toast = useToast();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await recruiterService.getProfile();
                if (res?.data) reset(res.data);
                else reset({ name: user?.name, email: user?.email, companyName: '', location: '', bio: '' });
            } catch {
                reset({ name: user?.name, email: user?.email, companyName: '', location: '', bio: '' });
            } finally { setLoading(false); }
        })();
    }, []);

    const onSave = async (data) => {
        setSaving(true);
        try {
            await recruiterService.updateProfile(data);
            toast.success('Profile updated successfully!');
        } catch (err) { toast.error(err.message); } finally { setSaving(false); }
    };

    return (
        <div className="page-enter">
            <div className="page-header">
                <h1 className="page-header__title">Recruiter Profile</h1>
                <p className="page-header__subtitle">Manage your company and contact information</p>
            </div>

            <div style={{ maxWidth: '680px' }}>
                {/* Profile Avatar Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(6,182,212,0.1) 100%)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '32px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                }}>
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: 'var(--gradient-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '28px', fontWeight: '800', color: 'white',
                        boxShadow: '0 8px 24px rgba(6,182,212,0.3)',
                    }}>
                        {(user?.name || user?.username || 'R').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                            {user?.name || user?.username}
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                            {user?.email}
                        </div>
                        <span className="badge badge--warning" style={{ marginTop: '8px' }}>RECRUITER</span>
                    </div>
                </div>

                <div className="card">
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[...Array(5)].map((_, i) => <div key={i} className="skeleton skeleton-text skeleton-text--full" style={{ height: '40px' }} />)}
                        </div>
                    ) : (
                        <form className="form" onSubmit={handleSubmit(onSave)}>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                                👤 Personal Info
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Full Name *</label>
                                    <input className={`form-input ${errors.name ? 'error' : ''}`} {...register('name', { required: 'Required' })} />
                                    {errors.name && <span className="form-error">⚠ {errors.name.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-input" disabled style={{ opacity: 0.6 }} {...register('email')} />
                                    <span className="form-hint">Email cannot be changed</span>
                                </div>
                            </div>

                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0 16px' }}>
                                🏢 Company Info
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Company Name *</label>
                                    <input className={`form-input ${errors.companyName ? 'error' : ''}`} placeholder="Acme Corp" {...register('companyName', { required: 'Required' })} />
                                    {errors.companyName && <span className="form-error">⚠ {errors.companyName.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input className="form-input" placeholder="City, State" {...register('location')} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Company Bio</label>
                                <textarea className="form-textarea" rows={3} placeholder="Tell candidates about your company…" {...register('bio')} />
                            </div>

                            <button type="submit" className="btn btn--primary btn--lg" disabled={saving}>
                                {saving ? <><span className="spinner" /> Saving…</> : '💾 Save Profile'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
