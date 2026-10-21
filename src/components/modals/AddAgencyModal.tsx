'use client';

import React, { useState } from 'react';
import { Building2, MapPin, User, Users, Phone } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useMasterData } from '@/context/MasterDataContext';
import { useToast } from '@/context/ToastContext';
import { InstagramIcon, FacebookIcon } from '@/components/ui/BrandIcons';

interface AddAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  organizationName: string;
}

export const AddAgencyModal: React.FC<AddAgencyModalProps> = ({
  isOpen,
  onClose,
  organizationId,
  organizationName
}) => {
  const { addAgency } = useMasterData();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [managerName, setManagerName] = useState('');
  const [agentsCount, setAgentsCount] = useState<number>(4);
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !city.trim()) {
      showToast('Please fill in branch name, code, and city', 'error');
      return;
    }

    addAgency({
      organizationId,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      city: city.trim(),
      state: state.trim() || 'Default State',
      status: 'Active',
      managerName: managerName.trim() || 'Branch Manager',
      agentsCount: Number(agentsCount) || 1,
      channels: {
        whatsapp: whatsapp.trim() || undefined,
        instagram: instagram.trim() || undefined,
        facebook: facebook.trim() || undefined
      }
    });

    // Reset & close
    setName('');
    setCode('');
    setCity('');
    setState('');
    setManagerName('');
    setAgentsCount(4);
    setWhatsapp('');
    setInstagram('');
    setFacebook('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Agency / Branch"
      subtitle={`Create a regional branch under ${organizationName}`}
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Branch Name *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Downtown Central Branch"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Branch Code *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. MUM-02"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ textTransform: 'uppercase' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              City *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              State / Region
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Maharashtra"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Branch Manager Name
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Vikram Malhotra"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Staff Seats
            </label>
            <input
              type="number"
              min={1}
              max={50}
              className="input-field"
              value={agentsCount}
              onChange={(e) => setAgentsCount(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
            Branch Dedicated Communication Channels
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <Phone size={13} color="var(--success)" /> WhatsApp Dedicated Number
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="+91 98765 00000"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <InstagramIcon size={13} color="#E4405F" /> Instagram Handle
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="@branch_handle"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <FacebookIcon size={13} color="#1877F2" /> Facebook Page Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Branch Official Page"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <Button variant="ghost" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit">
            Create Branch
          </Button>
        </div>
      </form>
    </Modal>
  );
};
