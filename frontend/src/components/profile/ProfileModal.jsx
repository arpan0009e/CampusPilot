import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { Camera, Trash2, User, KeyRound, Eye, EyeOff, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile, changePassword } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  
  // Password change states
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
    }
    // Reset password fields when modal opens/closes
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMsg({ type: '', text: '' });
    setShowPasswordSection(false);
  }, [user, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setPasswordMsg({ type: '', text: '' });

    // Validate password change if user opened the section and entered anything
    if (showPasswordSection && (currentPassword || newPassword || confirmPassword)) {
      if (!currentPassword) {
        setPasswordMsg({ type: 'error', text: 'Please enter your current password.' });
        return;
      }
      if (newPassword.length < 6) {
        setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
        return;
      }
    }

    setSaving(true);
    try {
      // Update profile name/email/avatar
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        avatar
      });

      // Update password if fields filled
      if (showPasswordSection && newPassword) {
        await changePassword(currentPassword, newPassword);
        setPasswordMsg({ type: 'success', text: 'Profile and password updated successfully!' });
      }

      onClose();
    } catch (err) {
      setPasswordMsg({ type: 'error', text: typeof err === 'string' ? err : 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Profile">
      <form onSubmit={handleSubmit} style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
        {/* Photo Upload Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem', gap: '0.65rem' }}>
          <div 
            style={{ 
              position: 'relative', 
              width: '84px', 
              height: '84px', 
              borderRadius: '50%', 
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: '3px solid #0284c7' 
            }}
          >
            {avatar ? (
              <img 
                src={avatar} 
                alt="Student Avatar" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
              />
            ) : (
              <div 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', 
                  color: '#0284c7', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  fontWeight: 700
                }}
              >
                {name ? name.charAt(0).toUpperCase() : <User size={36} />}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload Photo"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#0284c7',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              <Camera size={14} />
            </button>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={13} /> Change Photo
            </button>
            {avatar && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleRemovePhoto}
              >
                <Trash2 size={13} /> Remove
              </button>
            )}
          </div>
        </div>

        {/* Name Field */}
        <div className="input-group">
          <label className="input-label">Student Name</label>
          <input 
            type="text" 
            className="input-field" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your name" 
            required 
          />
        </div>

        {/* Email Field */}
        <div className="input-group">
          <label className="input-label">Student Email</label>
          <input 
            type="email" 
            className="input-field" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="student@university.edu" 
            required 
          />
        </div>

        {/* Password Section Toggle */}
        <div style={{ marginTop: '1.25rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <button
            type="button"
            onClick={() => {
              setShowPasswordSection(!showPasswordSection);
              setPasswordMsg({ type: '', text: '' });
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: showPasswordSection ? '#f0f9ff' : '#f8fafc',
              border: '1px solid',
              borderColor: showPasswordSection ? '#bae6fd' : '#e2e8f0',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: '#0f172a',
              fontWeight: 500,
              fontSize: '0.875rem',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0369a1' }}>
              <KeyRound size={16} />
              Change Password
            </span>
            {showPasswordSection ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
          </button>

          {/* Expandable Password Fields */}
          {showPasswordSection && (
            <div 
              style={{ 
                marginTop: '0.85rem', 
                padding: '0.85rem', 
                background: '#f8fafc', 
                borderRadius: 'var(--radius-sm)', 
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              {/* Current Password */}
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    className="input-field"
                    style={{ paddingRight: '2.5rem' }}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    className="input-field"
                    style={{ paddingRight: '2.5rem' }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    className="input-field"
                    style={{ paddingRight: '2.5rem' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feedback Message */}
        {passwordMsg.text && (
          <div 
            style={{ 
              marginTop: '0.75rem', 
              padding: '0.55rem 0.75rem', 
              borderRadius: '6px', 
              fontSize: '0.8rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem',
              background: passwordMsg.type === 'error' ? '#fee2e2' : '#dcfce7',
              color: passwordMsg.type === 'error' ? '#be123c' : '#15803d',
              border: `1px solid ${passwordMsg.type === 'error' ? '#fca5a5' : '#86efac'}`
            }}
          >
            {passwordMsg.type === 'success' && <CheckCircle2 size={15} />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving || !name.trim()}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
