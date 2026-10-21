'use client';

import React, { useState, useEffect } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Organization, AVAILABLE_MODULES } from '@/data/dummyData';
import { useMasterData } from '@/context/MasterDataContext';
import {
  MessageCircle,
  Kanban,
  Megaphone,
  BarChart2,
  Download,
  GitBranch,
  Save
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '@/components/ui/BrandIcons';

interface ManageModulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization | null;
}

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

export const ManageModulesDrawer: React.FC<ManageModulesDrawerProps> = ({
  isOpen,
  onClose,
  organization
}) => {
  const { updateOrgModules } = useMasterData();
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (organization) {
      setSelectedModules(organization.modules || []);
    }
  }, [organization]);

  if (!organization) return null;

  const handleToggle = (moduleName: string) => {
    if (selectedModules.includes(moduleName)) {
      setSelectedModules(selectedModules.filter((m) => m !== moduleName));
    } else {
      setSelectedModules([...selectedModules, moduleName]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    updateOrgModules(organization.id, selectedModules);
    setIsSaving(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Modules"
      subtitle={`Configure features enabled for ${organization.name}`}
      width="440px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Org Summary Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
              {organization.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {organization.adminEmail}
            </div>
          </div>
          <StatusBadge status={organization.status} />
        </div>

        {/* Modules List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Active Communication & CRM Modules ({selectedModules.length} enabled)
          </div>

          {AVAILABLE_MODULES.map((mod) => {
            const isEnabled = selectedModules.includes(mod.name);
            return (
              <div
                key={mod.id}
                onClick={() => handleToggle(mod.name)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isEnabled ? 'var(--primary-soft)' : 'var(--bg-elevated)',
                  border: `1px solid ${isEnabled ? 'var(--primary)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      color: isEnabled ? 'var(--primary)' : 'var(--text-secondary)',
                      backgroundColor: isEnabled ? 'rgba(113, 235, 184, 0.15)' : 'var(--bg-surface)',
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {MODULE_ICONS[mod.iconName]}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {mod.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {mod.description}
                    </div>
                  </div>
                </div>

                <Toggle checked={isEnabled} onChange={() => handleToggle(mod.name)} />
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            isLoading={isSaving}
            icon={<Save size={16} />}
            style={{ flex: 1 }}
          >
            Save Changes
          </Button>
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
