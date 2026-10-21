'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Users,
  MessageSquare,
  TrendingUp,
  Layers,
  Key,
  Calendar,
  Mail,
  Phone,
  Edit2,
  Power
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { Organization } from '@/data/dummyData';
import { useMasterData } from '@/context/MasterDataContext';
import { CreateOrgModal } from '@/components/modals/CreateOrgModal';
import { ManageModulesDrawer } from '@/components/modals/ManageModulesDrawer';
import { CredentialsModal } from '@/components/modals/CredentialsModal';

export default function OrganizationsPage() {
  const { organizations, updateOrgStatus } = useMasterData();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [moduleDrawerOrg, setModuleDrawerOrg] = useState<Organization | null>(null);
  const [credentialsOrg, setCredentialsOrg] = useState<Organization | null>(null);

  // Dynamic status counts
  const totalCount = organizations.length;
  const activeCount = organizations.filter((o) => o.status === 'Active').length;
  const inactiveCount = organizations.filter((o) => o.status === 'Inactive').length;
  const suspendedCount = organizations.filter((o) => o.status === 'Suspended').length;

  // Filtered organizations
  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.phone.includes(searchQuery);

    const matchesCategory = selectedCategory === 'All' || org.category === selectedCategory;
    const matchesStatus = selectedStatusFilter === 'All' || org.status === selectedStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleStatus = (org: Organization) => {
    const nextStatus = org.status === 'Active' ? 'Suspended' : 'Active';
    updateOrgStatus(org.id, nextStatus);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Organizations
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage all registered multi-tenant instances and feature licensing
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-pill)',
              padding: '8px 16px',
              width: '240px'
            }}
          >
            <Search size={15} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>

          {/* Category Filter */}
          <select
            className="select-field"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: '160px', padding: '8px 16px', borderRadius: 'var(--radius-pill)' }}
          >
            <option value="All">All Categories</option>
            <option value="Automotive">Automotive</option>
            <option value="Finance">Finance</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Retail">Retail</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Other">Other</option>
          </select>

          {/* Primary CTA */}
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateOpen(true)}
            icon={<Plus size={16} />}
          >
            Create Organization
          </Button>
        </div>
      </div>

      {/* Stats Strip */}
      <div
        className="card"
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div
            onClick={() => setSelectedStatusFilter('All')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: selectedStatusFilter === 'All' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            <span>Total:</span>
            <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{totalCount}</strong>
          </div>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border)' }} />

          <div
            onClick={() => setSelectedStatusFilter('Active')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: selectedStatusFilter === 'Active' ? 'var(--success)' : 'var(--text-secondary)'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            <span>Active:</span>
            <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{activeCount}</strong>
          </div>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border)' }} />

          <div
            onClick={() => setSelectedStatusFilter('Inactive')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: selectedStatusFilter === 'Inactive' ? '#9ca3af' : 'var(--text-secondary)'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9ca3af' }} />
            <span>Inactive:</span>
            <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{inactiveCount}</strong>
          </div>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border)' }} />

          <div
            onClick={() => setSelectedStatusFilter('Suspended')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: selectedStatusFilter === 'Suspended' ? 'var(--danger)' : 'var(--text-secondary)'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} />
            <span>Suspended:</span>
            <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{suspendedCount}</strong>
          </div>
        </div>

        {selectedStatusFilter !== 'All' && (
          <button
            onClick={() => setSelectedStatusFilter('All')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Organization Cards Grid — 2 Columns */}
      {filteredOrgs.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <Building2 size={42} color="var(--text-muted)" />
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>No organizations found</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px' }}>
            No organization matches your current search or filter criteria. Try clearing the search query or creating a new organization.
          </p>
          <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)} icon={<Plus size={14} />}>
            Create Organization
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {filteredOrgs.map((org, idx) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -3, borderColor: 'var(--border-strong)' }}
              className="card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '18px',
                position: 'relative'
              }}
            >
              {/* Card Top: Initials avatar + Org Name + Status Badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: `${org.avatarColor}20`,
                      border: `1px solid ${org.avatarColor}40`,
                      color: org.avatarColor,
                      fontSize: '18px',
                      fontWeight: 800,
                      fontFamily: 'var(--font-heading)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {org.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {org.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--bg-elevated)'
                        }}
                      >
                        {org.category}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Created {org.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusBadge status={org.status} />
                  <Toggle
                    size="sm"
                    checked={org.status === 'Active'}
                    onChange={() => handleToggleStatus(org)}
                    disabled={org.status === 'Inactive'}
                  />
                </div>
              </div>

              {/* Meta: Admin info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} color="var(--primary-text)" />
                  <span>{org.adminEmail}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} color="var(--primary-text)" />
                  <span>{org.phone}</span>
                </div>
              </div>

              {/* Modules Row: Pill badges */}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                  ACTIVE MODULES ({org.modules.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {org.modules.map((m) => (
                    <span
                      key={m}
                      style={{
                        fontSize: '11px',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--primary-soft)',
                        border: '1px solid var(--primary-border)',
                        color: 'var(--primary-text)',
                        fontWeight: 600
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Strip: Users, Leads, Messages */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  textAlign: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Users</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {org.activeUsers} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ {org.maxUsers}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Leads</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {org.leadsCount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Messages</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {org.messagesThisMonth.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setModuleDrawerOrg(org)}
                    icon={<Layers size={13} />}
                  >
                    Manage Modules
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCredentialsOrg(org)}
                    icon={<Key size={13} />}
                  >
                    View Credentials
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setModuleDrawerOrg(org)}
                  icon={<Edit2 size={13} />}
                >
                  Edit
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals & Drawers */}
      <CreateOrgModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      <ManageModulesDrawer
        isOpen={Boolean(moduleDrawerOrg)}
        onClose={() => setModuleDrawerOrg(null)}
        organization={moduleDrawerOrg}
      />

      <CredentialsModal
        isOpen={Boolean(credentialsOrg)}
        onClose={() => setCredentialsOrg(null)}
        organization={credentialsOrg}
      />
    </div>
  );
}
