'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Organization } from '@/data/dummyData';
import { Copy, Check, ShieldAlert, Mail } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization | null;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({
  isOpen,
  onClose,
  organization
}) => {
  const { showToast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!organization) return null;

  const tempPassword = organization.tempPassword || 'Pass@' + organization.name.replace(/\s+/g, '') + '2026';
  const loginUrl = 'https://app.codymaster.com/login';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`${label} copied to clipboard`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAll = () => {
    const text = `Cody-Master Login Credentials\nPortal: ${loginUrl}\nOrganization: ${organization.name}\nAdmin Email: ${organization.adminEmail}\nTemporary Password: ${tempPassword}\nNote: Password must be reset on first login.`;
    navigator.clipboard.writeText(text);
    showToast('All credentials copied to clipboard!', 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admin Credentials"
      subtitle={`Access keys for ${organization.name}`}
      maxWidth="520px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Warning Banner */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <ShieldAlert size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: '#fcd34d', lineHeight: '1.4' }}>
            Share credentials securely. Password is only shown once and must be reset on initial login.
          </span>
        </div>

        {/* Credentials Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Login Portal */}
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
              Login URL
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                {loginUrl}
              </span>
              <button
                onClick={() => handleCopy(loginUrl, 'Login URL')}
                title="Copy URL"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {copiedField === 'Login URL' ? <Check size={16} color="var(--primary)" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Admin Email */}
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
              Admin Email
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                {organization.adminEmail}
              </span>
              <button
                onClick={() => handleCopy(organization.adminEmail, 'Email')}
                title="Copy Email"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {copiedField === 'Email' ? <Check size={16} color="var(--primary)" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Temporary Password */}
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
              Temporary Password
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--primary-border)'
              }}
            >
              <span style={{ fontSize: '14px', color: 'var(--primary)', fontFamily: 'monospace', fontWeight: 600 }}>
                {tempPassword}
              </span>
              <button
                onClick={() => handleCopy(tempPassword, 'Password')}
                title="Copy Password"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {copiedField === 'Password' ? <Check size={16} color="var(--primary)" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <Button
            variant="primary"
            size="md"
            onClick={handleCopyAll}
            icon={<Copy size={16} />}
            style={{ flex: 1 }}
          >
            Copy All
          </Button>

          <div style={{ position: 'relative' }}>
            <Button
              variant="outline"
              size="md"
              disabled
              icon={<Mail size={16} />}
              title="Coming Soon: Automatic encrypted dispatch to org admin email"
            >
              Send via Email (Coming Soon)
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
