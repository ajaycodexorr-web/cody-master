'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Users,
  MessageSquare,
  TrendingUp,
  Layers,
  Key,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Search,
  Copy,
  Check,
  Activity,
  Clock,
  Globe,
  ExternalLink,
  ShieldAlert,
  Server,
  Zap,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge, RoleBadge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { InstagramIcon, FacebookIcon } from '@/components/ui/BrandIcons';
import { AVAILABLE_MODULES, Organization } from '@/data/dummyData';
import { useMasterData } from '@/context/MasterDataContext';
import { useToast } from '@/context/ToastContext';
import { ManageModulesDrawer } from '@/components/modals/ManageModulesDrawer';
import { CredentialsModal } from '@/components/modals/CredentialsModal';
import { AddAgencyModal } from '@/components/modals/AddAgencyModal';

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const orgId = params?.id as string;

  const {
    organizations,
    agencies,
    users,
    tokenHealth,
    auditLogs,
    updateOrgStatus,
    updateOrgModules,
    toggleAgencyStatus,
    toggleUserStatus,
    resetUserPassword
  } = useMasterData();

  const org = organizations.find((o) => o.id === orgId);

  // Active tab state
  const [activeTab, setActiveTab] = useState<'agencies' | 'modules' | 'users' | 'channels' | 'audit'>('agencies');
  const [agencySearch, setAgencySearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modals state
  const [isModuleDrawerOpen, setIsModuleDrawerOpen] = useState(false);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const [isAddAgencyOpen, setIsAddAgencyOpen] = useState(false);

  if (!org) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px' }}>
        <Building2 size={48} color="var(--text-muted)" />
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Organization Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          The requested organization ID &ldquo;{orgId}&rdquo; does not exist or may have been removed.
        </p>
        <Link href="/master/organizations">
          <Button variant="primary" size="md" icon={<ArrowLeft size={16} />}>
            Back to Organizations
          </Button>
        </Link>
      </div>
    );
  }

  // Related data
  const orgAgencies = agencies.filter((a) => a.organizationId === org.id);
  const filteredAgencies = orgAgencies.filter(
    (a) =>
      a.name.toLowerCase().includes(agencySearch.toLowerCase()) ||
      a.city.toLowerCase().includes(agencySearch.toLowerCase()) ||
      a.code.toLowerCase().includes(agencySearch.toLowerCase())
  );
  const orgUsers = users.filter((u) => u.organization === org.name);
  const orgTokens = tokenHealth.filter((t) => t.organization === org.name);
  const orgLogs = auditLogs.filter((l) => l.targetOrganization === org.name);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`Copied ${label} to clipboard`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleModule = (moduleId: string) => {
    const isCurrentlyActive = org.modules.includes(moduleId);
    const updated = isCurrentlyActive
      ? org.modules.filter((m) => m !== moduleId)
      : [...org.modules, moduleId];
    updateOrgModules(org.id, updated);
  };

  const handleToggleOrgStatus = () => {
    const nextStatus = org.status === 'Active' ? 'Suspended' : 'Active';
    updateOrgStatus(org.id, nextStatus);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Breadcrumb & Quick Back Link */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          href="/master/organizations"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--primary-text)',
            padding: '6px 14px',
            backgroundColor: 'var(--primary-soft)',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--primary-border)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={15} />
          <span>Back to Organizations List</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>Tenant ID:</span>
          <code style={{ fontFamily: 'monospace', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            {org.id}
          </code>
        </div>
      </div>

      {/* Main Organization Hero Card */}
      <div
        className="card"
        style={{
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          {/* Left: Avatar & Info */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: `${org.avatarColor}18`,
                border: `2px solid ${org.avatarColor}50`,
                color: org.avatarColor,
                fontSize: '26px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {org.name}
                </h1>
                <StatusBadge status={org.status} />
                <span
                  style={{
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600
                  }}
                >
                  {org.category}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="var(--primary-text)" />
                  <a href={`mailto:${org.adminEmail}`} style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>
                    {org.adminEmail}
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="var(--primary-text)" />
                  <span>{org.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={14} color="var(--primary-text)" />
                  <span>{org.timezone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="var(--text-muted)" />
                  <span>Joined {org.createdAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Status:
              </span>
              <Toggle
                size="sm"
                checked={org.status === 'Active'}
                onChange={handleToggleOrgStatus}
                disabled={org.status === 'Inactive'}
              />
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={() => setIsModuleDrawerOpen(true)}
              icon={<Layers size={15} />}
            >
              Manage Modules
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => setIsCredentialsOpen(true)}
              icon={<Key size={15} />}
            >
              View Credentials
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAddAgencyOpen(true)}
              icon={<Plus size={15} />}
            >
              Add Agency
            </Button>
          </div>
        </div>

        {/* 4 Key Metrics Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border)'
          }}
        >
          {/* Metric 1: Agencies */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '12px' }}>
              <span>Branches / Agencies</span>
              <GitBranch size={16} color="var(--primary-text)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
              {orgAgencies.length}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {orgAgencies.filter((a) => a.status === 'Active').length} active operating locations
            </div>
          </div>

          {/* Metric 2: Users */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '12px' }}>
              <span>Licensed Users</span>
              <Users size={16} color="var(--primary-text)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
              {org.activeUsers} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ {org.maxUsers}</span>
            </div>
            {/* Progress bar */}
            <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--border)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, (org.activeUsers / org.maxUsers) * 100)}%`,
                  height: '100%',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '3px'
                }}
              />
            </div>
          </div>

          {/* Metric 3: Leads */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '12px' }}>
              <span>Total CRM Leads</span>
              <TrendingUp size={16} color="var(--primary-text)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
              {org.leadsCount.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Aggregated across all branches
            </div>
          </div>

          {/* Metric 4: Messages */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '12px' }}>
              <span>Monthly Messages</span>
              <MessageSquare size={16} color="var(--primary-text)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
              {org.messagesThisMonth.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              WhatsApp, IG, & FB interactions
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-strong)', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('agencies')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'agencies' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'agencies' ? 'var(--primary-text)' : 'var(--text-secondary)',
            transition: 'all 0.15s ease'
          }}
        >
          <GitBranch size={16} />
          <span>Agencies & Branches</span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: activeTab === 'agencies' ? 'var(--primary)' : 'var(--bg-elevated)',
              color: activeTab === 'agencies' ? '#071f15' : 'var(--text-muted)'
            }}
          >
            {orgAgencies.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'modules' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'modules' ? 'var(--primary-text)' : 'var(--text-secondary)',
            transition: 'all 0.15s ease'
          }}
        >
          <Layers size={16} />
          <span>Licensed Modules</span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: activeTab === 'modules' ? 'var(--primary)' : 'var(--bg-elevated)',
              color: activeTab === 'modules' ? '#071f15' : 'var(--text-muted)'
            }}
          >
            {org.modules.length}/8
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'users' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'users' ? 'var(--primary-text)' : 'var(--text-secondary)',
            transition: 'all 0.15s ease'
          }}
        >
          <Users size={16} />
          <span>Staff & Users</span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: activeTab === 'users' ? 'var(--primary)' : 'var(--bg-elevated)',
              color: activeTab === 'users' ? '#071f15' : 'var(--text-muted)'
            }}
          >
            {orgUsers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('channels')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'channels' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'channels' ? 'var(--primary-text)' : 'var(--text-secondary)',
            transition: 'all 0.15s ease'
          }}
        >
          <Activity size={16} />
          <span>Meta API & Channels</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'audit' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'audit' ? 'var(--primary-text)' : 'var(--text-secondary)',
            transition: 'all 0.15s ease'
          }}
        >
          <Clock size={16} />
          <span>Audit Trail</span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: activeTab === 'audit' ? 'var(--primary)' : 'var(--bg-elevated)',
              color: activeTab === 'audit' ? '#071f15' : 'var(--text-muted)'
            }}
          >
            {orgLogs.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Agencies & Branches */}
      {activeTab === 'agencies' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-pill)',
                padding: '8px 16px',
                width: '320px'
              }}
            >
              <Search size={15} color="var(--text-secondary)" />
              <input
                type="text"
                placeholder="Search branches by name, city, or code..."
                value={agencySearch}
                onChange={(e) => setAgencySearch(e.target.value)}
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

            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAddAgencyOpen(true)}
              icon={<Plus size={15} />}
            >
              Add New Branch / Agency
            </Button>
          </div>

          {filteredAgencies.length === 0 ? (
            <div
              className="card"
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <GitBranch size={40} color="var(--text-muted)" />
              <h3 style={{ fontSize: '17px', color: 'var(--text-primary)' }}>No agencies found</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                {orgAgencies.length === 0
                  ? 'This organization has not set up any regional branches or sub-agencies yet.'
                  : 'No branches match your current search criteria.'}
              </p>
              <Button variant="primary" size="sm" onClick={() => setIsAddAgencyOpen(true)} icon={<Plus size={14} />}>
                Add First Branch
              </Button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
              {filteredAgencies.map((agency) => (
                <div
                  key={agency.id}
                  className="card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  {/* Top: Name, Code & Status */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--primary-soft)',
                            color: 'var(--primary-text)',
                            border: '1px solid var(--primary-border)',
                            fontFamily: 'monospace'
                          }}
                        >
                          {agency.code}
                        </span>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {agency.name}
                        </h4>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        <MapPin size={13} color="var(--primary-text)" />
                        <span>{agency.city}, {agency.state}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-pill)',
                          backgroundColor: agency.status === 'Active' ? 'rgba(22, 163, 74, 0.12)' : 'rgba(100, 116, 139, 0.12)',
                          color: agency.status === 'Active' ? 'var(--success)' : 'var(--text-muted)'
                        }}
                      >
                        {agency.status}
                      </span>
                      <Toggle
                        size="sm"
                        checked={agency.status === 'Active'}
                        onChange={() => toggleAgencyStatus(agency.id)}
                      />
                    </div>
                  </div>

                  {/* Channel Endpoints (WhatsApp, IG, FB) */}
                  <div
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-elevated)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '2px' }}>
                      CONNECTED CHANNELS
                    </div>
                    {agency.channels.whatsapp && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                        <Phone size={13} color="var(--success)" />
                        <span style={{ fontWeight: 600 }}>WhatsApp:</span>
                        <span style={{ fontFamily: 'monospace' }}>{agency.channels.whatsapp}</span>
                      </div>
                    )}
                    {agency.channels.instagram && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                        <InstagramIcon size={13} color="#E4405F" />
                        <span style={{ fontWeight: 600 }}>Instagram:</span>
                        <span>{agency.channels.instagram}</span>
                      </div>
                    )}
                    {agency.channels.facebook && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                        <FacebookIcon size={13} color="#1877F2" />
                        <span style={{ fontWeight: 600 }}>Facebook:</span>
                        <span>{agency.channels.facebook}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer stats: Manager, Agents, Leads */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '8px',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--border)',
                      textAlign: 'center',
                      fontSize: '11px'
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Manager</div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {agency.managerName}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Staff Seats</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {agency.agentsCount} agents
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Leads Handled</div>
                      <div style={{ fontWeight: 700, color: 'var(--primary-text)', marginTop: '2px' }}>
                        {agency.leadsCount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Licensed Modules */}
      {activeTab === 'modules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Feature Licensing & Capabilities
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Toggle features on or off in real-time. Changes take effect immediately for all branches and agents under this organization.
              </p>
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={() => setIsModuleDrawerOpen(true)}
              icon={<Layers size={15} />}
            >
              Open Module Manager
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {AVAILABLE_MODULES.map((mod) => {
              const isEnabled = org.modules.includes(mod.name);
              return (
                <div
                  key={mod.id}
                  className="card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    border: isEnabled ? '1px solid var(--primary-border)' : '1px solid var(--border)',
                    backgroundColor: isEnabled ? 'var(--bg-surface)' : 'var(--bg-elevated)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isEnabled ? 'var(--primary-soft)' : 'var(--bg-hover)',
                        color: isEnabled ? 'var(--primary-text)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {mod.iconName === 'MessageCircle' && <MessageCircle size={22} />}
                      {mod.iconName === 'Instagram' && <InstagramIcon size={22} />}
                      {mod.iconName === 'Facebook' && <FacebookIcon size={22} />}
                      {mod.iconName === 'Kanban' && <TrendingUp size={22} />}
                      {mod.iconName === 'Megaphone' && <Zap size={22} />}
                      {mod.iconName === 'BarChart2' && <Activity size={22} />}
                      {mod.iconName === 'Download' && <Server size={22} />}
                      {mod.iconName === 'GitBranch' && <GitBranch size={22} />}
                    </div>

                    <Toggle
                      size="sm"
                      checked={isEnabled}
                      onChange={() => handleToggleModule(mod.name)}
                    />
                  </div>

                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {mod.name}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                      {mod.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border)', fontSize: '11px' }}>
                    <span style={{ fontWeight: 600, color: isEnabled ? 'var(--success)' : 'var(--text-muted)' }}>
                      {isEnabled ? '● Active License' : '○ Disabled'}
                    </span>
                    <button
                      onClick={() => handleToggleModule(mod.name)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-text)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      {isEnabled ? 'Turn Off' : 'Enable'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Staff & Users */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Tenant Personnel & Permissions ({orgUsers.length})
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                All staff accounts provisioned under {org.name}
              </p>
            </div>
            <Link href="/master/users">
              <Button variant="outline" size="sm" icon={<ExternalLink size={14} />}>
                Manage All Platform Users
              </Button>
            </Link>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead style={{ backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-strong)', color: 'var(--text-muted)' }}>
                  <tr>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Member</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Email</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Role</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Last Login</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orgUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No users provisioned under this organization yet.
                      </td>
                    </tr>
                  ) : (
                    orgUsers.map((u) => (
                      <tr
                        key={u.id}
                        style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s ease' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: 'var(--radius-pill)',
                                backgroundColor: 'var(--primary-soft)',
                                color: 'var(--primary-text)',
                                fontWeight: 700,
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {u.avatarInitials}
                            </div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {u.name}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                          {u.email}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <RoleBadge role={u.role} />
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor: u.status === 'Active' ? 'rgba(22, 163, 74, 0.12)' : 'rgba(220, 38, 38, 0.12)',
                              color: u.status === 'Active' ? 'var(--success)' : 'var(--danger)'
                            }}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                          {u.lastLogin}
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resetUserPassword(u.id)}
                              icon={<Key size={12} />}
                            >
                              Reset
                            </Button>
                            <Button
                              variant={u.status === 'Active' ? 'danger' : 'outline'}
                              size="sm"
                              onClick={() => toggleUserStatus(u.id)}
                            >
                              {u.status === 'Active' ? 'Disable' : 'Enable'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Meta Channels & API Health */}
      {activeTab === 'channels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Meta Cloud API Integrations & Tokens
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Inspect live token expiry, webhook endpoints, and channel connectivity for {org.name}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {/* WhatsApp Card */}
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(22, 163, 74, 0.12)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>WhatsApp Cloud API</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Meta Graph v20.0</span>
                  </div>
                </div>
                <span className="badge badge-healthy">Connected</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Business Phone:</strong> {org.phone}</div>
                <div><strong>Token Health:</strong> Healthy (Auto-renewed)</div>
                <div><strong>Delivery Latency:</strong> 42ms</div>
              </div>
            </div>

            {/* Instagram Card */}
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(228, 64, 95, 0.12)', color: '#E4405F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <InstagramIcon size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Instagram Direct</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Graph DM Webhook</span>
                  </div>
                </div>
                <span className="badge badge-healthy">Connected</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Handle:</strong> @{org.name.toLowerCase().replace(/\s+/g, '')}</div>
                <div><strong>Permissions:</strong> messages, comments</div>
                <div><strong>Token Expiry:</strong> 54 days remaining</div>
              </div>
            </div>

            {/* Facebook Messenger Card */}
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(24, 119, 242, 0.12)', color: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FacebookIcon size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Facebook Messenger</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Page Messaging API</span>
                  </div>
                </div>
                <span className="badge badge-healthy">Connected</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Page:</strong> {org.name} Official</div>
                <div><strong>Lead Ads Sync:</strong> Active (Instant webhook)</div>
                <div><strong>Token Expiry:</strong> 54 days remaining</div>
              </div>
            </div>
          </div>

          {/* Webhook Endpoint Details */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Webhook Endpoint Configuration
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Callback URL
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <code style={{ fontSize: '12px', color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    https://api.codycrm.io/v1/webhooks/{org.id}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(`https://api.codycrm.io/v1/webhooks/${org.id}`, 'URL')}
                    icon={copiedKey === 'URL' ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                  >
                    {copiedKey === 'URL' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Verify Token
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <code style={{ fontSize: '12px', color: 'var(--text-primary)', flex: 1, fontFamily: 'monospace' }}>
                    cody_verify_{org.id.replace(/-/g, '_')}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(`cody_verify_${org.id.replace(/-/g, '_')}`, 'Token')}
                    icon={copiedKey === 'Token' ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                  >
                    {copiedKey === 'Token' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Audit Trail */}
      {activeTab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Audit History for {org.name}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Immutable administrative log of system operations, credential resets, and status updates
            </p>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead style={{ backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-strong)', color: 'var(--text-muted)' }}>
                  <tr>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Timestamp</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Action</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Details</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Performed By</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {orgLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No audit logs recorded for this organization yet.
                      </td>
                    </tr>
                  ) : (
                    orgLogs.map((log) => (
                      <tr
                        key={log.id}
                        style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s ease' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={{ padding: '14px 20px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {log.timestamp}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                              fontFamily: 'monospace'
                            }}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', color: 'var(--text-primary)', maxWidth: '340px' }}>
                          {log.details}
                        </td>
                        <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>
                          {log.performedBy}
                        </td>
                        <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {log.ipAddress}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <ManageModulesDrawer
        isOpen={isModuleDrawerOpen}
        onClose={() => setIsModuleDrawerOpen(false)}
        organization={org}
      />

      <CredentialsModal
        isOpen={isCredentialsOpen}
        onClose={() => setIsCredentialsOpen(false)}
        organization={org}
      />

      <AddAgencyModal
        isOpen={isAddAgencyOpen}
        onClose={() => setIsAddAgencyOpen(false)}
        organizationId={org.id}
        organizationName={org.name}
      />
    </div>
  );
}
