import { useState, useEffect } from 'react';
import SolarisLayout from '../../components/layout/SolarisLayout';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import '../../styles/solaris-layout.css';

export default function RecruiterProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        companyName: '',
        companyDescription: '',
    });
    
    const toast = useToast();

    useEffect(() => {
        // We use the recruiter dashboard to get company info or a general 'me' endpoint
        api.get('/recruiter/dashboard').then(res => {
            setProfile(res.data);
            setFormData({
                name: '', // Recruiter name might need an endpoint, using placeholder for now
                email: '',
                companyName: res.data.companyName || '',
                companyDescription: '', // Backend might not have this yet
            });
            setLoading(false);
        }).catch(err => {
            toast.error('Failed to load recruiter coordinates');
            setLoading(false);
        });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        // Backend support for recruiter profile update might be limited, focusing on UI existence first
        setTimeout(() => {
            toast.success('Recruiter Hub Parameters Updated Locally');
            setUpdating(false);
        }, 1000);
    };

    if (loading) return <SolarisLayout><div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '100px' }}>Loading Recruiter Hub...</div></SolarisLayout>;

    return (
        <SolarisLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Recruiter Hub Coordinates</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your organizational presence within Solaris.</p>
                </div>

                <div className="bento-item" style={{ padding: '48px' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="solaris-group" style={{ marginBottom: '32px' }}>
                            <label className="solaris-label">ORGANIZATION IDENTITY (COMPANY NAME)</label>
                            <input name="companyName" className="solaris-input" value={formData.companyName} onChange={handleChange} />
                        </div>

                        <div className="solaris-group" style={{ marginBottom: '32px' }}>
                            <label className="solaris-label">HUB DESCRIPTION</label>
                            <textarea 
                                name="companyDescription" 
                                className="solaris-input" 
                                style={{ minHeight: '180px' }}
                                value={formData.companyDescription} 
                                onChange={handleChange} 
                                placeholder="Describe your organization's mission and legacy..."
                            />
                        </div>

                        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="solaris-btn" style={{ width: 'auto', padding: '14px 60px' }} disabled={updating}>
                                {updating ? 'Updating Hub...' : '💾 Save Coordinates'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SolarisLayout>
    );
}
