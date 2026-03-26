import { useState, useEffect } from 'react';
import SolarisLayout from '../../components/layout/SolarisLayout';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import '../../styles/solaris-layout.css';

export default function UserProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        skills: '',
        education: '',
        experience: 0,
        resumeUrl: ''
    });
    
    const toast = useToast();

    useEffect(() => {
        api.get('/user/profile').then(res => {
            setProfile(res.data);
            setFormData({
                name: res.data.name || '',
                email: res.data.email || '',
                phone: res.data.phone || '',
                skills: res.data.skills ? res.data.skills.join(', ') : '',
                education: res.data.education || '',
                experience: res.data.experience || 0,
                resumeUrl: res.data.resumeUrl || ''
            });
            setLoading(false);
        }).catch(err => {
            toast.error('Failed to load identity profile');
            setLoading(false);
        });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                experience: parseInt(formData.experience)
            };
            const res = await api.put('/user/profile', payload);
            setProfile(res.data);
            toast.success('Identity Resynchronized Successfully');
        } catch (err) {
            toast.error(err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <SolarisLayout><div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '100px' }}>Accessing Identity Matrix...</div></SolarisLayout>;

    return (
        <SolarisLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>User Identity Profile</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Modify your core parameters within the Solaris ecosystem.</p>
                </div>

                <div className="bento-item" style={{ padding: '48px' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                            <div className="solaris-group">
                                <label className="solaris-label">FULL LEGAL NAME</label>
                                <input name="name" className="solaris-input" value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="solaris-group">
                                <label className="solaris-label">SYSTEM EMAIL (READ-ONLY)</label>
                                <input className="solaris-input" value={formData.email} disabled style={{ opacity: 0.6 }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                            <div className="solaris-group">
                                <label className="solaris-label">COMMUNICATION LINK (PHONE)</label>
                                <input name="phone" className="solaris-input" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="solaris-group">
                                <label className="solaris-label">EXPERIENCE THRESHOLD (YEARS)</label>
                                <input name="experience" type="number" className="solaris-input" value={formData.experience} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="solaris-group" style={{ marginBottom: '32px' }}>
                            <label className="solaris-label">ACADEMIC BACKGROUND</label>
                            <input name="education" className="solaris-input" value={formData.education} onChange={handleChange} placeholder="e.g. B.Tech in Computer Science" />
                        </div>

                        <div className="solaris-group" style={{ marginBottom: '32px' }}>
                            <label className="solaris-label">CAPABILITY MATRIX (SKILLS, COMMA SEPARATED)</label>
                            <textarea 
                                name="skills" 
                                className="solaris-input" 
                                style={{ minHeight: '120px' }}
                                value={formData.skills} 
                                onChange={handleChange} 
                                placeholder="React, Java, Spring Boot, AWS..."
                            />
                        </div>

                        <div className="solaris-group" style={{ marginBottom: '32px' }}>
                            <label className="solaris-label">RESUME REPOSITORY LINK (HTTPS)</label>
                            <input name="resumeUrl" className="solaris-input" value={formData.resumeUrl} onChange={handleChange} placeholder="https://drive.google.com/..." />
                        </div>

                        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="solaris-btn" style={{ width: 'auto', padding: '14px 60px' }} disabled={updating}>
                                {updating ? 'Resynchronizing...' : '💾 Update Identity'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SolarisLayout>
    );
}
