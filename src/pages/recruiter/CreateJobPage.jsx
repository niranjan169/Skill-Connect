import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SolarisLayout from '../../components/layout/SolarisLayout';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import '../../styles/solaris-layout.css';
import '../../styles/solar-auth.css';

export default function CreateJobPage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        jobType: 'FULL_TIME',
        companyName: '',
        minExperience: '',
        maxExperience: '',
        minSalary: '',
        maxSalary: '',
    });
    const [skillsString, setSkillsString] = useState('');
    const [loading, setLoading] = useState(false);
    
    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const requiredSkills = skillsString.split(',').map(s => s.trim()).filter(s => s);
            const payload = {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                jobType: formData.jobType,
                companyName: formData.companyName || undefined,
                minExperience: formData.minExperience ? parseInt(formData.minExperience) : undefined,
                maxExperience: formData.maxExperience ? parseInt(formData.maxExperience) : undefined,
                minSalary: formData.minSalary ? parseFloat(formData.minSalary) : undefined,
                maxSalary: formData.maxSalary ? parseFloat(formData.maxSalary) : undefined,
                requiredSkills,
            };
            await api.post('/recruiter/jobs', payload);
            toast.success('Opportunity Broadcast Successful!');
            navigate('/recruiter/jobs');
        } catch (err) {
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SolarisLayout>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Broadcast Opportunity</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Define requirements for your next Solaris acquisition.</p>
                </div>

                <div className="bento-item" style={{ padding: '48px' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', marginBottom: '32px' }}>
                            <div className="solaris-group" style={{ marginBottom: 0 }}>
                                <label className="solaris-label">POSITION TITLE *</label>
                                <input name="title" className="solaris-input" required placeholder="e.g. Senior Full Stack Engineer" onChange={handleChange} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                            <div className="solaris-group" style={{ marginBottom: 0 }}>
                                <label className="solaris-label">ENGAGEMENT TYPE *</label>
                                <select name="jobType" className="solaris-input" onChange={handleChange}>
                                    <option value="FULL_TIME">Full-time</option>
                                    <option value="PART_TIME">Part-time</option>
                                    <option value="CONTRACT">Contract</option>
                                    <option value="INTERNSHIP">Internship</option>
                                    <option value="REMOTE">Remote</option>
                                </select>
                            </div>
                            <div className="solaris-group" style={{ marginBottom: 0 }}>
                                <label className="solaris-label">LOCATION *</label>
                                <input name="location" className="solaris-input" required placeholder="Remote / City, Country" onChange={handleChange} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                            <div className="solaris-group" style={{ marginBottom: 0 }}>
                                <label className="solaris-label">MIN EXP (YRS)</label>
                                <input name="minExperience" type="number" min="0" className="solaris-input" placeholder="e.g. 2" onChange={handleChange} />
                            </div>
                            <div className="solaris-group" style={{ marginBottom: 0 }}>
                                <label className="solaris-label">MAX EXP (YRS)</label>
                                <input name="maxExperience" type="number" min="0" className="solaris-input" placeholder="e.g. 5" onChange={handleChange} />
                            </div>
                            <div className="solaris-group" style={{ marginBottom: 0 }}>
                                <label className="solaris-label">MIN SALARY ($)</label>
                                <input name="minSalary" type="number" min="0" className="solaris-input" placeholder="e.g. 80000" onChange={handleChange} />
                            </div>
                            <div className="solaris-group" style={{ marginBottom: 0 }}>
                                <label className="solaris-label">MAX SALARY ($)</label>
                                <input name="maxSalary" type="number" min="0" className="solaris-input" placeholder="e.g. 120000" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="solaris-group">
                            <label className="solaris-label">POSITION DESCRIPTION *</label>
                            <textarea 
                                name="description" 
                                className="solaris-input" 
                                style={{ minHeight: '180px', resize: 'vertical' }}
                                required 
                                placeholder="Outline the mission, key responsibilities, and growth opportunities..."
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="solaris-group">
                            <label className="solaris-label">REQUIRED CAPABILITIES (COMMA SEPARATED)</label>
                            <input 
                                className="solaris-input" 
                                placeholder="React, Node.js, PostgreSQL, Docker..."
                                value={skillsString}
                                onChange={(e) => setSkillsString(e.target.value)}
                            />
                        </div>

                        <div style={{ marginTop: '48px', display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => navigate(-1)} className="solaris-btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)', width: 'auto', padding: '14px 40px' }}>Cancel</button>
                            <button type="submit" className="solaris-btn" style={{ width: 'auto', padding: '14px 60px' }} disabled={loading}>
                                {loading ? 'Broadcasting...' : '🚀 Initialize Broadcast'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SolarisLayout>
    );
}
