'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  Organization,
  PlatformUser,
  TokenHealthItem,
  WebhookEvent,
  AuditLog,
  INITIAL_ORGANIZATIONS,
  INITIAL_USERS,
  INITIAL_TOKEN_HEALTH,
  INITIAL_WEBHOOK_EVENTS,
  INITIAL_AUDIT_LOGS
} from '@/data/dummyData';
import { useToast } from './ToastContext';

interface MasterDataContextType {
  organizations: Organization[];
  users: PlatformUser[];
  tokenHealth: TokenHealthItem[];
  webhookEvents: WebhookEvent[];
  auditLogs: AuditLog[];
  addOrganization: (newOrg: Omit<Organization, 'id' | 'createdAt' | 'leadsCount' | 'messagesThisMonth' | 'activeUsers'>) => Organization;
  updateOrgStatus: (id: string, status: Organization['status']) => void;
  updateOrgModules: (id: string, modules: string[]) => void;
  toggleUserStatus: (id: string) => void;
  resetUserPassword: (id: string) => void;
  notifyTokenAdmin: (channelId: string) => void;
  refreshWebhooks: () => void;
  addAuditLog: (action: AuditLog['action'], targetOrg: string, details: string, payload: Record<string, unknown>) => void;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

export const MasterDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [users, setUsers] = useState<PlatformUser[]>(INITIAL_USERS);
  const [tokenHealth, setTokenHealth] = useState<TokenHealthItem[]>(INITIAL_TOKEN_HEALTH);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>(INITIAL_WEBHOOK_EVENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const { showToast } = useToast();

  const addAuditLog = (
    action: AuditLog['action'],
    targetOrganization: string,
    details: string,
    payload: Record<string, unknown>
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      action,
      targetOrganization,
      details,
      performedBy: 'Super Admin',
      ipAddress: '103.21.45.67',
      payload
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addOrganization = (
    data: Omit<Organization, 'id' | 'createdAt' | 'leadsCount' | 'messagesThisMonth' | 'activeUsers'>
  ): Organization => {
    const newId = `org-${Date.now()}`;
    const newOrg: Organization = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      activeUsers: 1,
      leadsCount: 0,
      messagesThisMonth: 0
    };

    setOrganizations((prev) => [newOrg, ...prev]);

    // Also add default Admin user for this organization
    const newUser: PlatformUser = {
      id: `user-${Date.now()}`,
      name: data.name + ' Admin',
      email: data.adminEmail,
      organization: data.name,
      role: 'Org Admin',
      status: 'Active',
      lastLogin: 'Never',
      avatarInitials: data.name.substring(0, 2).toUpperCase()
    };
    setUsers((prev) => [newUser, ...prev]);

    addAuditLog(
      'CREATE_ORGANIZATION',
      data.name,
      `Created with ${data.maxUsers} user limit, modules: ${data.modules.join(', ')}`,
      {
        organizationId: newId,
        name: data.name,
        adminEmail: data.adminEmail,
        modules: data.modules,
        maxUsers: data.maxUsers
      }
    );

    showToast(`Organization "${data.name}" created successfully`, 'success', 'Created');
    return newOrg;
  };

  const updateOrgStatus = (id: string, status: Organization['status']) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id === id) {
          const updated = { ...org, status };
          addAuditLog(
            status === 'Suspended' ? 'SUSPEND_ORGANIZATION' : 'EDIT_ORGANIZATION',
            org.name,
            `Status changed to ${status}`,
            { previousStatus: org.status, newStatus: status }
          );
          return updated;
        }
        return org;
      })
    );
    showToast(`Status updated to ${status}`, 'info');
  };

  const updateOrgModules = (id: string, modules: string[]) => {
    const target = organizations.find((o) => o.id === id);
    if (!target) return;

    setOrganizations((prev) =>
      prev.map((org) => (org.id === id ? { ...org, modules } : org))
    );

    addAuditLog(
      'TOGGLE_MODULE',
      target.name,
      `Modules updated: ${modules.length} active`,
      { organizationId: id, activeModules: modules }
    );
    showToast(`Modules for ${target.name} updated`, 'success', 'Saved');
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'Active' ? 'Disabled' : 'Active';
          addAuditLog(
            'DEACTIVATE_USER',
            u.organization,
            `User ${u.email} status changed to ${newStatus}`,
            { userId: u.id, email: u.email, newStatus }
          );
          showToast(`User ${u.name} set to ${newStatus}`, newStatus === 'Active' ? 'success' : 'warning');
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const resetUserPassword = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    addAuditLog(
      'RESET_ADMIN_PASSWORD',
      target.organization,
      `Password reset issued for ${target.email}`,
      { email: target.email, resetBy: 'Super Admin' }
    );
    showToast(`Password reset link sent to ${target.email}`, 'success', 'Password Reset');
  };

  const notifyTokenAdmin = (channelId: string) => {
    const channel = tokenHealth.find((t) => t.id === channelId);
    if (!channel) return;
    showToast(`Admin of ${channel.organization} notified regarding ${channel.channel} token!`, 'warning', 'Notification Sent');
  };

  const refreshWebhooks = () => {
    // Generate a fresh simulated incoming event
    const channels: ('WhatsApp' | 'Instagram' | 'Facebook')[] = ['WhatsApp', 'Instagram', 'Facebook'];
    const eventTypes: WebhookEvent['eventType'][] = [
      'MESSAGE_RECEIVED',
      'DELIVERY_RECEIPT',
      'READ_RECEIPT',
      'IG_DM_RECEIVED',
      'FB_MESSAGE_RECEIVED'
    ];
    const orgNames = organizations.map((o) => o.name);

    const randomChannel = channels[Math.floor(Math.random() * channels.length)];
    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const randomOrg = orgNames[Math.floor(Math.random() * orgNames.length)] || 'Prime Automobiles';

    const freshEvent: WebhookEvent = {
      id: `wh-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      organization: randomOrg,
      channel: randomChannel,
      eventType: randomEvent,
      status: Math.random() > 0.1 ? '200 OK' : '500 Error',
      latency: `${Math.floor(Math.random() * 60) + 20}ms`
    };

    setWebhookEvents((prev) => [freshEvent, ...prev.slice(0, 24)]);
    showToast('Webhook events refreshed with real-time stream', 'info', 'Refreshed');
  };

  return (
    <MasterDataContext.Provider
      value={{
        organizations,
        users,
        tokenHealth,
        webhookEvents,
        auditLogs,
        addOrganization,
        updateOrgStatus,
        updateOrgModules,
        toggleUserStatus,
        resetUserPassword,
        notifyTokenAdmin,
        refreshWebhooks,
        addAuditLog
      }}
    >
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => {
  const context = useContext(MasterDataContext);
  if (!context) {
    throw new Error('useMasterData must be used within a MasterDataProvider');
  }
  return context;
};
