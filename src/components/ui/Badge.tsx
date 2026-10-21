'use client';

import React from 'react';

export type StatusBadgeType =
  | 'Active'
  | 'Inactive'
  | 'Suspended'
  | 'Expiring Soon'
  | 'Healthy'
  | 'Disconnected'
  | 'Disabled';

export type RoleBadgeType = 'Org Admin' | 'Branch Manager' | 'Agent' | 'Super Admin';

export type ActionBadgeType =
  | 'CREATE_ORGANIZATION'
  | 'TOGGLE_MODULE'
  | 'SUSPEND_ORGANIZATION'
  | 'RESET_ADMIN_PASSWORD'
  | 'DEACTIVATE_USER'
  | 'UPDATE_MODULE_LIMITS'
  | 'EDIT_ORGANIZATION';

interface StatusBadgeProps {
  status: StatusBadgeType | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeClass = 'badge-inactive';
  let hasPulse = false;

  switch (status) {
    case 'Active':
      badgeClass = 'badge-active';
      hasPulse = true;
      break;
    case 'Healthy':
      badgeClass = 'badge-healthy';
      hasPulse = true;
      break;
    case 'Inactive':
    case 'Disabled':
      badgeClass = 'badge-inactive';
      break;
    case 'Suspended':
    case 'Disconnected':
      badgeClass = 'badge-suspended';
      break;
    case 'Expiring Soon':
      badgeClass = 'badge-expiring';
      break;
    default:
      badgeClass = 'badge-inactive';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {hasPulse && <span className="pulse-dot" />}
      {status}
    </span>
  );
};

interface RoleBadgeProps {
  role: RoleBadgeType | string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  let roleClass = 'badge-role-agent';

  switch (role) {
    case 'Super Admin':
    case 'Org Admin':
      roleClass = 'badge-role-admin';
      break;
    case 'Branch Manager':
      roleClass = 'badge-role-manager';
      break;
    case 'Agent':
    default:
      roleClass = 'badge-role-agent';
      break;
  }

  return <span className={`badge ${roleClass}`}>{role}</span>;
};

interface ActionBadgeProps {
  action: ActionBadgeType | string;
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({ action }) => {
  let color = '#8aad9c';
  let bg = 'rgba(138, 173, 156, 0.12)';
  let border = 'rgba(138, 173, 156, 0.25)';

  switch (action) {
    case 'CREATE_ORGANIZATION':
      color = '#22c55e';
      bg = 'rgba(34, 197, 94, 0.15)';
      border = 'rgba(34, 197, 94, 0.3)';
      break;
    case 'TOGGLE_MODULE':
    case 'UPDATE_MODULE_LIMITS':
      color = '#3b82f6';
      bg = 'rgba(59, 130, 246, 0.15)';
      border = 'rgba(59, 130, 246, 0.3)';
      break;
    case 'SUSPEND_ORGANIZATION':
    case 'DEACTIVATE_USER':
      color = '#ef4444';
      bg = 'rgba(239, 68, 68, 0.15)';
      border = 'rgba(239, 68, 68, 0.3)';
      break;
    case 'RESET_ADMIN_PASSWORD':
      color = '#f59e0b';
      bg = 'rgba(245, 158, 11, 0.15)';
      border = 'rgba(245, 158, 11, 0.3)';
      break;
    case 'EDIT_ORGANIZATION':
    default:
      color = '#8aad9c';
      bg = 'rgba(138, 173, 156, 0.12)';
      border = 'rgba(138, 173, 156, 0.25)';
      break;
  }

  return (
    <span
      className="badge"
      style={{
        backgroundColor: bg,
        color: color,
        borderColor: border,
        fontSize: '10px',
        letterSpacing: '0.04em'
      }}
    >
      {action.replace(/_/g, ' ')}
    </span>
  );
};
