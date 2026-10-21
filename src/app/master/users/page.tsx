'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  MoreVertical,
  Shield,
  Key,
  UserX,
  UserCheck,
  Clock,
  Building,
  Mail,
  UserCheck2
} from 'lucide-react';
import { RoleBadge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PlatformUser } from '@/data/dummyData';
import { useMasterData } from '@/context/MasterDataContext';
import { useToast } from '@/context/ToastContext';

export default function UsersPage() {
  const { users, organizations, toggleUserStatus, resetUserPassword } = useMasterData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrgFilter, setSelectedOrgFilter] = useState('All');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  // Actions dropdown active row
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Profile modal
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<PlatformUser | null>(null);

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.organization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOrg = selectedOrgFilter === 'All' || u.organization === selectedOrgFilter;
    const matchesRole = selectedRoleFilter === 'All' || u.role === selectedRoleFilter;
    const matchesStatus = selectedStatusFilter === 'All' || u.status === selectedStatusFilter;

    return matchesSearch && matchesOrg && matchesRole && matchesStatus;
  });

  const orgNames = Array.from(new Set(users.map((u) => u.organization)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Platform Users
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Inspect permissions, manage staff credentials, and view active sessions across all tenants
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: 'var(--primary)' }}>{filteredUsers.length}</strong> of {users.length} users
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '16px',
          alignItems: 'center'
        }}
      >
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-pill)',
            padding: '8px 16px'
          }}
        >
          <Search size={15} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search by name, email, or organization..."
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

        {/* Organization Filter */}
        <select
          className="select-field"
          value={selectedOrgFilter}
          onChange={(e) => setSelectedOrgFilter(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: 'var(--radius-pill)' }}
        >
          <option value="All">All Organizations</option>
          {orgNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {/* Role Filter */}
        <select
          className="select-field"
          value={selectedRoleFilter}
          onChange={(e) => setSelectedRoleFilter(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: 'var(--radius-pill)' }}
        >
          <option value="All">All Roles</option>
          <option value="Org Admin">Org Admin</option>
          <option value="Branch Manager">Branch Manager</option>
          <option value="Agent">Agent</option>
        </select>

        {/* Status Filter */}
        <select
          className="select-field"
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: 'var(--radius-pill)' }}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Disabled">Disabled</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', maxHeight: '640px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead
              style={{
                position: 'sticky',
                top: 0,
                backgroundColor: '#111916',
                borderBottom: '1px solid var(--border-strong)',
                color: 'var(--text-muted)',
                zIndex: 10
              }}
            >
              <tr>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Name & Avatar</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Email Address</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Organization</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Last Login</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No users matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Avatar + Name */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: 'var(--bg-elevated)',
                            border: '1px solid var(--border-strong)',
                            color: 'var(--primary)',
                            fontWeight: 700,
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {u.avatarInitials}
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {u.name}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      {u.email}
                    </td>

                    {/* Organization */}
                    <td style={{ padding: '14px 20px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building size={14} color="var(--primary)" />
                        <span>{u.organization}</span>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td style={{ padding: '14px 20px' }}>
                      <RoleBadge role={u.role} />
                    </td>

                    {/* Status Toggle */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Toggle
                          size="sm"
                          checked={u.status === 'Active'}
                          onChange={() => toggleUserStatus(u.id)}
                        />
                        <span
                          style={{
                            fontSize: '12px',
                            color: u.status === 'Active' ? 'var(--success)' : 'var(--text-muted)',
                            fontWeight: 500
                          }}
                        >
                          {u.status}
                        </span>
                      </div>
                    </td>

                    {/* Last Login */}
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        <span>{u.lastLogin}</span>
                      </div>
                    </td>

                    {/* Actions Dropdown */}
                    <td style={{ padding: '14px 20px', textAlign: 'right', position: 'relative' }}>
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === u.id ? null : u.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeMenuId === u.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            style={{
                              position: 'absolute',
                              right: '20px',
                              top: '40px',
                              width: '180px',
                              backgroundColor: '#18231e',
                              border: '1px solid var(--border-strong)',
                              borderRadius: 'var(--radius-md)',
                              boxShadow: 'var(--shadow-modal)',
                              padding: '6px',
                              zIndex: 50,
                              textAlign: 'left'
                            }}
                          >
                            <button
                              onClick={() => {
                                setSelectedUserForProfile(u);
                                setActiveMenuId(null);
                              }}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '12px',
                                cursor: 'pointer',
                                borderRadius: 'var(--radius-sm)'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <Shield size={14} color="var(--primary)" />
                              <span>View Profile</span>
                            </button>

                            <button
                              onClick={() => {
                                resetUserPassword(u.id);
                                setActiveMenuId(null);
                              }}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '12px',
                                cursor: 'pointer',
                                borderRadius: 'var(--radius-sm)'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <Key size={14} color="#f59e0b" />
                              <span>Reset Password</span>
                            </button>

                            <button
                              onClick={() => {
                                toggleUserStatus(u.id);
                                setActiveMenuId(null);
                              }}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                background: 'transparent',
                                border: 'none',
                                color: u.status === 'Active' ? 'var(--danger)' : 'var(--success)',
                                fontSize: '12px',
                                cursor: 'pointer',
                                borderRadius: 'var(--radius-sm)'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              {u.status === 'Active' ? (
                                <>
                                  <UserX size={14} />
                                  <span>Disable Account</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck2 size={14} />
                                  <span>Enable Account</span>
                                </>
                              )}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile Modal */}
      <Modal
        isOpen={Boolean(selectedUserForProfile)}
        onClose={() => setSelectedUserForProfile(null)}
        title="User Account Details"
        subtitle={`Permissions and session history for ${selectedUserForProfile?.name}`}
        maxWidth="480px"
      >
        {selectedUserForProfile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--primary-soft)',
                  border: '2px solid var(--primary)',
                  color: 'var(--primary)',
                  fontWeight: 800,
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {selectedUserForProfile.avatarInitials}
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedUserForProfile.name}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {selectedUserForProfile.email}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                padding: '16px',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assigned Tenant</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedUserForProfile.organization}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Role Level</div>
                <div style={{ marginTop: '4px' }}>
                  <RoleBadge role={selectedUserForProfile.role} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Account Status</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: selectedUserForProfile.status === 'Active' ? 'var(--success)' : 'var(--danger)', marginTop: '2px' }}>
                  {selectedUserForProfile.status}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Last Seen</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedUserForProfile.lastLogin}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  resetUserPassword(selectedUserForProfile.id);
                  setSelectedUserForProfile(null);
                }}
                icon={<Key size={14} />}
                style={{ flex: 1 }}
              >
                Issue Password Reset
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setSelectedUserForProfile(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
