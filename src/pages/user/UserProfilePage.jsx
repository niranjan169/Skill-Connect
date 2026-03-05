import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { useToast } from '../../hooks/useToast';

export default function UserProfilePage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        location: '',
        yearsOfExperience: 0,
        education: '',
        skills: []
    });
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await userService.getProfile();
            if (res?.data) {
                setProfile({
                    ...res.data,
                    skills: res.data.skills || []
                });
            }
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await userService.updateProfile(profile);
            if (res?.data) {
                toast.success('Profile updated successfully');
                setProfile(res.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const addSkill = () => {
        if (!newSkill.trim()) return;
        if (profile.skills.some(s => s.toLowerCase() === newSkill.trim().toLowerCase())) {
            toast.warning('Skill already added');
            return;
        }
        setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
        setNewSkill('');
    };

    const removeSkill = (skill) => {
        setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
    };

    if (loading) {
        return (
            <div className="page-enter" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="skeleton" style={{ height: '40px', width: '200px' }} />
                <div className="skeleton" style={{ height: '300px' }} />
            </div>
        );
    }

    return (
        <div className="page-enter">
            <div className="page-header">
                <h1 className="page-header__title">My Profile</h1>
                <p className="page-header__subtitle">Manage your personal details and professional skills</p>
            </div>

            <div className="card anim-fade-in" style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSave}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                className="form-input"
                                value={profile.email}
                                disabled
                                style={{ background: 'var(--color-bg-body)', cursor: 'not-allowed' }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                className="form-input"
                                value={profile.fullName}
                                onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <input
                                className="form-input"
                                placeholder="e.g. New York, NY"
                                value={profile.location || ''}
                                onChange={e => setProfile({ ...profile, location: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Years of Experience</label>
                            <input
                                type="number"
                                className="form-input"
                                min="0"
                                value={profile.yearsOfExperience || 0}
                                onChange={e => setProfile({ ...profile, yearsOfExperience: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Education</label>
                            <input
                                className="form-input"
                                placeholder="e.g. Bachelor in CS"
                                value={profile.education || ''}
                                onChange={e => setProfile({ ...profile, education: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '24px' }}>
                        <label className="form-label">Skills & Expertise</label>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                            <input
                                className="form-input"
                                style={{ flex: 1 }}
                                placeholder="e.g. Java, React, SQL"
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            />
                            <button type="button" className="btn btn--secondary" onClick={addSkill}>Add Skill</button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {profile.skills.length === 0 ? (
                                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>No skills added yet.</span>
                            ) : (
                                profile.skills.map(skill => (
                                    <div key={skill} className="badge badge--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: '14px' }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '32px', borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
                        <button type="submit" className="btn btn--primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Profile Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
