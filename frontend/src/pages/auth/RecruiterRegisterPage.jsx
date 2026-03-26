import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import '../../styles/solar-auth.css';

export default function RecruiterRegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        companyName: '',
        companyWebsite: '',
        companyLocation: '',
        aboutCompany: '',
    });
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register/recruiter', formData);
            toast.success('Recruiter Account Activated! Please Sign In.');
            navigate('/login');
        } catch (err) {
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="solaris-card" style={{ maxWidth: '600px' }}>
                <div className="auth-header">
                    <div className="auth-logo" style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}>R</div>
                    <h1 className="auth-title">Recruiter Hub</h1>
                    <p className="auth-subtitle">Acquire tomorrow's talent today</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="solaris-group">
                            <label className="solaris-label">Full Name</label>
                            <input name="fullName" className="solaris-input" required onChange={handleChange} />
                        </div>
                        <div className="solaris-group">
                            <label className="solaris-label">Official Email</label>
                            <input name="email" type="email" className="solaris-input" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className="solaris-group">
                        <label className="solaris-label">Password</label>
                        <input name="password" type="password" className="solaris-input" required onChange={handleChange} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="solaris-group">
                            <label className="solaris-label">Company Name</label>
                            <input name="companyName" className="solaris-input" required onChange={handleChange} />
                        </div>
                        <div className="solaris-group">
                            <label className="solaris-label">Website</label>
                            <input name="companyWebsite" type="url" className="solaris-input" placeholder="https://" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className="solaris-group">
                        <label className="solaris-label">Headquarters</label>
                        <input name="companyLocation" className="solaris-input" required onChange={handleChange} />
                    </div>

                    <div className="solaris-group">
                        <label className="solaris-label">About Company</label>
                        <textarea 
                            name="aboutCompany" 
                            className="solaris-input" 
                            style={{ minHeight: '100px', resize: 'vertical' }}
                            required 
                            onChange={handleChange} 
                        />
                    </div>

                    <button type="submit" className="solaris-btn" style={{ marginTop: '20px', background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }} disabled={loading}>
                        {loading ? 'Activating...' : '🌏 Register Organization'}
                    </button>
                </form>

                <div className="auth-footer">
                    Recruiter already? <Link to="/login" className="auth-link">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
