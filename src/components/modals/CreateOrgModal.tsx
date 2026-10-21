'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  MessageCircle,
  Kanban,
  Megaphone,
  BarChart2,
  Download,
  GitBranch,
  ShieldAlert,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '@/components/ui/BrandIcons';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { AVAILABLE_MODULES, Organization } from '@/data/dummyData';
import { useMasterData } from '@/context/MasterDataContext';
import { useToast } from '@/context/ToastContext';

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Automotive', 'Finance', 'Real Estate', 'Retail', 'Healthcare', 'Other'] as const;
const TIMEZONES = [
  'Asia/Kolkata (IST)',
  'UTC',
  'America/New_York (EST)',
  'Europe/London (GMT)',
  'Asia/Dubai (GST)',
  'Asia/Singapore (SGT)'
];

const MODULE_ICONS: Record<string, React.ReactNode> = {
  MessageCircle: <MessageCircle size={20} />,
  Instagram: <InstagramIcon size={20} />,
  Facebook: <FacebookIcon size={20} />,
  Kanban: <Kanban size={20} />,
  Megaphone: <Megaphone size={20} />,
  BarChart2: <BarChart2 size={20} />,
  Download: <Download size={20} />,
  GitBranch: <GitBranch size={20} />
};

export const CreateOrgModal: React.FC<CreateOrgModalProps> = ({ isOpen, onClose }) => {
  const { addOrganization } = useMasterData();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Step 1: Company details
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Organization['category']>('Automotive');
  const [officialEmail, setOfficialEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [timezone, setTimezone] = useState(TIMEZONES[0]);
  const [maxUsers, setMaxUsers] = useState<number>(10);

  // Step 2: Admin credentials
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('Pass@2026!');
  const [forceReset, setForceReset] = useState<boolean>(true);

  // Step 3: Modules
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'WhatsApp Cloud API',
    'Sales Pipeline'
  ]);

  const steps = [
    { title: 'Company Details', subtitle: 'Basic business info' },
    { title: 'Admin Credentials', subtitle: 'Account security' },
    { title: 'Enable Modules', subtitle: 'Activate features' }
  ];

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let result = 'Cody@';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    showToast('Generated secure temporary password', 'info');
  };

  const handleToggleModule = (moduleName: string) => {
    if (selectedModules.includes(moduleName)) {
      setSelectedModules(selectedModules.filter((m) => m !== moduleName));
    } else {
      setSelectedModules([...selectedModules, moduleName]);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name.trim()) {
        showToast('Please enter organization name', 'error');
        return;
      }
      if (!officialEmail.trim()) {
        showToast('Please enter official email', 'error');
        return;
      }
      if (!adminEmail) {
        setAdminEmail(officialEmail);
      }
      if (!adminName) {
        setAdminName(name + ' Admin');
      }
    } else if (currentStep === 2) {
      if (!adminName.trim() || !adminEmail.trim()) {
        showToast('Please enter admin name and email', 'error');
        return;
      }
      if (!password.trim()) {
        showToast('Please set or generate a password', 'error');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCreate = () => {
    const avatarColors = ['#71ebb8', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'];
    const chosenColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    addOrganization({
      name,
      category,
      status: 'Active',
      adminEmail,
      phone: phone || '+91 98000 00000',
      timezone,
      maxUsers: Number(maxUsers) || 10,
      modules: selectedModules,
      avatarColor: chosenColor,
      tempPassword: password
    });

    setIsSuccess(true);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast(`${field} copied to clipboard`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAll = () => {
    const fullText = `Cody-Master Login Credentials\nPlatform URL: https://app.codymaster.com/login\nOrganization: ${name}\nAdmin Email: ${adminEmail}\nTemporary Password: ${password}\nFirst Login Reset: ${forceReset ? 'Required' : 'Disabled'}`;
    navigator.clipboard.writeText(fullText);
    showToast('All credentials copied to clipboard!', 'success');
  };

  const handleFinish = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setName('');
    setOfficialEmail('');
    setPhone('');
    setAdminName('');
    setAdminEmail('');
    setSelectedModules(['WhatsApp Cloud API', 'Sales Pipeline']);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 8, 7, 0.8)',
          backdropFilter: 'blur(8px)'
        }}
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#111916',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-modal)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {isSuccess ? 'Organization Created' : 'Create Organization'}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {isSuccess
                ? 'Temporary access credentials have been provisioned'
                : 'Follow the 3-step setup to provision tenant space'}
            </p>
          </div>
          <button
            onClick={isSuccess ? handleFinish : onClose}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-pill)',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {!isSuccess ? (
            <>
              {/* Stepper indicator */}
              <StepIndicator steps={steps} currentStep={currentStep} />

              {/* Step 1: Company Details */}
              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Apex Auto World"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Business Category
                      </label>
                      <select
                        className="select-field"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Organization['category'])}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Official Email *
                      </label>
                      <input
                        type="email"
                        className="input-field"
                        placeholder="admin@apexauto.com"
                        value={officialEmail}
                        onChange={(e) => setOfficialEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Timezone
                      </label>
                      <select
                        className="select-field"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                      >
                        {TIMEZONES.map((tz) => (
                          <option key={tz} value={tz}>
                            {tz}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Max Allowed Users
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      className="input-field"
                      value={maxUsers}
                      onChange={(e) => setMaxUsers(parseInt(e.target.value) || 10)}
                    />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      Number of staff seats licensed for this tenant organization
                    </span>
                  </div>
                </div>
              )}

              {/* Step 2: Admin Credentials */}
              {currentStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Admin Full Name *
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Ramesh Verma"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Admin Email *
                      </label>
                      <input
                        type="email"
                        className="input-field"
                        placeholder="admin@apexauto.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Temporary Password
                      </label>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--primary)',
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <RefreshCw size={12} />
                        <span>Auto-generate</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      className="input-field"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      backgroundColor: 'var(--bg-elevated)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Force Password Reset on First Login
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        User will be required to choose a new password upon first sign-in
                      </div>
                    </div>
                    <Toggle checked={forceReset} onChange={setForceReset} />
                  </div>

                  {/* Preview Credentials Card */}
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(113, 235, 184, 0.05)',
                      border: '1px dashed var(--primary-border)'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>
                      Credentials Preview
                    </div>
                    <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Tenant: </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{name || 'Apex Auto World'}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Admin: </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{adminEmail || 'admin@apexauto.com'}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Temporary Pass: </span>
                        <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{password}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Enable Modules */}
              {currentStep === 3 && (
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Select which communication channels and tools are licensed for {name || 'this organization'}:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {AVAILABLE_MODULES.map((mod) => {
                      const isEnabled = selectedModules.includes(mod.name);
                      return (
                        <div
                          key={mod.id}
                          onClick={() => handleToggleModule(mod.name)}
                          style={{
                            padding: '14px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: isEnabled ? 'var(--primary-soft)' : 'var(--bg-elevated)',
                            border: `1px solid ${isEnabled ? 'var(--primary)' : 'var(--border)'}`,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div
                              style={{
                                color: isEnabled ? 'var(--primary)' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 600,
                                fontSize: '13px'
                              }}
                            >
                              {MODULE_ICONS[mod.iconName]}
                              <span>{mod.name}</span>
                            </div>
                            <Toggle
                              size="sm"
                              checked={isEnabled}
                              onChange={() => handleToggleModule(mod.name)}
                            />
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            {mod.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Success Screen */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '12px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-soft)',
                  border: '2px solid var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  marginBottom: '16px',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {name} is Ready!
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '440px' }}>
                The organization has been provisioned. Send these temporary credentials to the primary administrator.
              </p>

              {/* Warning Banner */}
              <div
                style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'left'
                }}
              >
                <ShieldAlert size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#fcd34d' }}>
                  Share credentials securely. The temporary password is shown here only once.
                </span>
              </div>

              {/* Credentials Card */}
              <div
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '20px',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  textAlign: 'left'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Login Portal URL
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--bg-surface)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                      https://app.codymaster.com/login
                    </span>
                    <button
                      onClick={() => handleCopy('https://app.codymaster.com/login', 'URL')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      {copiedField === 'URL' ? <Check size={14} color="var(--primary)" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Admin Email
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--bg-surface)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                      {adminEmail}
                    </span>
                    <button
                      onClick={() => handleCopy(adminEmail, 'Email')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      {copiedField === 'Email' ? <Check size={14} color="var(--primary)" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Temporary Password
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--bg-surface)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--primary-border)'
                    }}
                  >
                    <span style={{ fontSize: '13px', color: 'var(--primary)', fontFamily: 'monospace', fontWeight: 600 }}>
                      {password}
                    </span>
                    <button
                      onClick={() => handleCopy(password, 'Password')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      {copiedField === 'Password' ? <Check size={14} color="var(--primary)" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={handleCopyAll} icon={<Copy size={14} />}>
                  Copy All Credentials
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSuccess ? 'flex-end' : 'space-between'
          }}
        >
          {!isSuccess ? (
            <>
              {currentStep > 1 ? (
                <Button variant="outline" size="md" onClick={handleBack} icon={<ArrowLeft size={16} />}>
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <Button variant="primary" size="md" onClick={handleNext} icon={<ArrowRight size={16} />}>
                  Next
                </Button>
              ) : (
                <Button variant="primary" size="md" onClick={handleCreate}>
                  Create Organization
                </Button>
              )}
            </>
          ) : (
            <Button variant="primary" size="md" onClick={handleFinish}>
              Done
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
