'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Palette,
  ShieldCheck,
  BellRing,
  Upload,
  Lock,
  Save,
  CheckCircle2,
  Clock,
  Globe,
  Sliders
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'branding' | 'security' | 'notifications'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form state
  const [adminName, setAdminName] = useState(user?.name || 'Super Admin');
  const [adminEmail, setAdminEmail] = useState(user?.email || 'admin@codymaster.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Platform Branding state
  const [platformName, setPlatformName] = useState('Cody-Master');
  const [supportEmail, setSupportEmail] = useState('support@codymaster.com');
  const [primaryBrandColor, setPrimaryBrandColor] = useState('#71ebb8');

  // Security state
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [ipWhitelist, setIpWhitelist] = useState('103.21.45.67\n192.168.1.0/24\n10.0.0.1/32');

  // Notifications state
  const [notifyOnNewOrg, setNotifyOnNewOrg] = useState(true);
  const [notifyOnSuspend, setNotifyOnSuspend] = useState(true);
  const [notifyOnTokenExpiry, setNotifyOnTokenExpiry] = useState(true);
  const [notifyOnWebhookSpike, setNotifyOnWebhookSpike] = useState(true);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 450));
    setIsSaving(false);
    showToast('Master system preferences successfully saved', 'success', 'Saved');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      showToast('Please enter a new password', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 450));
    setIsSaving(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Super Admin password successfully updated', 'success', 'Password Updated');
  };

  const settingsTabs = [
    { id: 'profile', label: 'Super Admin Profile', icon: User },
    { id: 'branding', label: 'Platform Branding', icon: Palette },
    { id: 'security', label: 'Security & Access', icon: ShieldCheck },
    { id: 'notifications', label: 'System Notifications', icon: BellRing }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Master Settings
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Configure global platform parameters, system security thresholds, and automated notifications
        </p>
      </div>

      {/* Main Settings Split: Left Tabs (240px) + Right Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '28px', alignItems: 'flex-start' }}>
        {/* Left Sub-Navigation */}
        <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'profile' | 'branding' | 'security' | 'notifications')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--primary-soft)' : 'transparent',
                  border: 'none',
                  color: isActive ? 'var(--primary-text)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Form Container */}
        <div className="card" style={{ padding: '32px' }}>
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Super Admin Profile
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Manage the primary administrative identity with platform-wide credentials
                </p>
              </div>

              {/* Avatar initials badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--primary-soft)',
                    border: '2px solid var(--primary)',
                    color: 'var(--primary)',
                    fontWeight: 800,
                    fontSize: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-glow)'
                  }}
                >
                  {user?.initials || 'SA'}
                </div>

                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Super Administrator
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--primary-text)', fontWeight: 600 }}>
                    Master Authority Tier • All Permissions Enabled
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

              {/* Password change sub-form */}
              <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Change Master Password
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="input-field"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="input-field"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="input-field"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                  <Button variant="outline" size="sm" type="submit" icon={<Lock size={13} />}>
                    Update Password
                  </Button>
                </div>
              </form>

              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSaveSettings}
                  isLoading={isSaving}
                  icon={<Save size={15} />}
                >
                  Save Profile Changes
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: BRANDING */}
          {activeTab === 'branding' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Platform White-Label Branding
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Customize the presentation and theme tokens across the super admin portal
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Platform Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Global Support Email
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Logo upload placeholder (dashed box) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Platform Logo
                </label>
                <div
                  style={{
                    border: '2px dashed var(--border-strong)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '32px',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-elevated)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                  }}
                  onClick={() => showToast('Logo uploader demo: file browser triggered', 'info')}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-soft)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Upload size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Click to upload SVG or PNG
                    </span>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Recommended dimensions 240x60px transparent logo
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Color Preview */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Primary Accent Color Preview
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: primaryBrandColor,
                      boxShadow: 'var(--shadow-glow)'
                    }}
                  />
                  <input
                    type="text"
                    className="input-field"
                    value={primaryBrandColor}
                    onChange={(e) => setPrimaryBrandColor(e.target.value)}
                    style={{ width: '140px', fontFamily: 'monospace' }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Standard Cody-Master Mint (#71ebb8)
                  </span>
                </div>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSaveSettings}
                  isLoading={isSaving}
                  icon={<Save size={15} />}
                >
                  Save Branding
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Security & Access Restrictions
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Manage idle session expiry, two-factor enforcement, and IP subnet whitelisting
                </p>
              </div>

              {/* Session timeout */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Administrative Session Inactivity Timeout
                </label>
                <select
                  className="select-field"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  style={{ maxWidth: '320px' }}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes (Recommended)</option>
                  <option value="120">2 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>

              {/* 2FA Section with Coming Soon badge */}
              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Enforce Hardware FIDO2 / Authenticator 2FA
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: '#f59e0b',
                        fontSize: '10px',
                        fontWeight: 700
                      }}
                    >
                      COMING SOON
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Require TOTP code verification for all platform-wide administrative logins
                  </p>
                </div>

                <Toggle checked={false} onChange={() => {}} disabled />
              </div>

              {/* IP Whitelist */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Super Admin IP Subnet Whitelist (One per line)
                </label>
                <textarea
                  rows={4}
                  className="input-field"
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                  style={{ fontFamily: 'monospace', resize: 'vertical' }}
                  placeholder="103.21.45.67&#10;192.168.1.0/24"
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Connections originating outside these addresses will be rejected with 403 Forbidden.
                </span>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSaveSettings}
                  isLoading={isSaving}
                  icon={<Save size={15} />}
                >
                  Save Security Rules
                </Button>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Automated Event Notifications
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Select operational events that dispatch urgent email alerts to the Super Admin
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* 1. New Organization Created */}
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Email on new organization created
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Sends a summary whenever a new tenant space is provisioned
                    </div>
                  </div>
                  <Toggle checked={notifyOnNewOrg} onChange={setNotifyOnNewOrg} />
                </div>

                {/* 2. Organization Suspended */}
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Email on organization suspended
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Alert when a tenant is halted due to overdue billing or policy violation
                    </div>
                  </div>
                  <Toggle checked={notifyOnSuspend} onChange={setNotifyOnSuspend} />
                </div>

                {/* 3. Token Expiring within 7 days */}
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Email on token expiring (within 7 days)
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Proactive warning before Meta WhatsApp or Instagram token expiration
                    </div>
                  </div>
                  <Toggle checked={notifyOnTokenExpiry} onChange={setNotifyOnTokenExpiry} />
                </div>

                {/* 4. Webhook failure spike */}
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Email on webhook failure spike
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Trigger alert when 500 error rate crosses 5% threshold in 15 minutes
                    </div>
                  </div>
                  <Toggle checked={notifyOnWebhookSpike} onChange={setNotifyOnWebhookSpike} />
                </div>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSaveSettings}
                  isLoading={isSaving}
                  icon={<Save size={15} />}
                >
                  Save Notification Preferences
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
