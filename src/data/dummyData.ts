export interface Organization {
  id: string;
  name: string;
  category: 'Automotive' | 'Finance' | 'Real Estate' | 'Retail' | 'Healthcare' | 'Other';
  status: 'Active' | 'Inactive' | 'Suspended';
  adminEmail: string;
  phone: string;
  timezone: string;
  maxUsers: number;
  activeUsers: number;
  leadsCount: number;
  messagesThisMonth: number;
  modules: string[];
  createdAt: string;
  avatarColor: string;
  tempPassword?: string;
}

export interface Agency {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  city: string;
  state: string;
  status: 'Active' | 'Inactive';
  managerName: string;
  agentsCount: number;
  channels: {
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
  };
  leadsCount: number;
  messagesCount: number;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: 'Org Admin' | 'Branch Manager' | 'Agent';
  status: 'Active' | 'Disabled';
  lastLogin: string;
  avatarInitials: string;
}

export interface TokenHealthItem {
  id: string;
  organization: string;
  channel: 'WhatsApp' | 'Instagram' | 'Facebook';
  status: 'Healthy' | 'Expiring Soon' | 'Disconnected';
  identifier: string; // phone / page ID / handle
  lastActivity: string;
  tokenExpires: string;
}

export interface WebhookEvent {
  id: string;
  timestamp: string;
  organization: string;
  channel: 'WhatsApp' | 'Instagram' | 'Facebook';
  eventType: 'MESSAGE_RECEIVED' | 'DELIVERY_RECEIPT' | 'READ_RECEIPT' | 'IG_DM_RECEIVED' | 'FB_MESSAGE_RECEIVED';
  status: '200 OK' | '500 Error';
  latency: string;
}

export interface ApiUsageItem {
  organization: string;
  apiCalls: number;
  errors: number;
  successRate: string;
  peakHour: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: 'CREATE_ORGANIZATION' | 'TOGGLE_MODULE' | 'SUSPEND_ORGANIZATION' | 'RESET_ADMIN_PASSWORD' | 'DEACTIVATE_USER' | 'UPDATE_MODULE_LIMITS' | 'EDIT_ORGANIZATION';
  targetOrganization: string;
  details: string;
  performedBy: string;
  ipAddress: string;
  payload: Record<string, unknown>;
}

export const AVAILABLE_MODULES = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Cloud API',
    description: 'Direct Meta Cloud API integration for automated WhatsApp communications',
    iconName: 'MessageCircle'
  },
  {
    id: 'instagram',
    name: 'Instagram Direct',
    description: 'Real-time DM automation, story mentions, and customer query replies',
    iconName: 'Instagram'
  },
  {
    id: 'facebook',
    name: 'Facebook Messenger',
    description: 'Sync official page conversations, lead ads, and automated FAQs',
    iconName: 'Facebook'
  },
  {
    id: 'pipeline',
    name: 'Sales Pipeline',
    description: 'Kanban deal stages, stage automation, and lead value forecasting',
    iconName: 'Kanban'
  },
  {
    id: 'broadcast',
    name: 'Broadcast Campaigns',
    description: 'Mass template messaging with audience segmenting and analytics',
    iconName: 'Megaphone'
  },
  {
    id: 'analytics',
    name: 'Analytics and Reports',
    description: 'Comprehensive agent performance metrics, response times, and charts',
    iconName: 'BarChart2'
  },
  {
    id: 'export',
    name: 'Data Export',
    description: 'Automated CSV/JSON lead data dumps and CRM external synchronization',
    iconName: 'Download'
  },
  {
    id: 'branch',
    name: 'Multi-Branch Support',
    description: 'Regional dealer access controls, territory separation, and branch managers',
    iconName: 'GitBranch'
  }
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Prime Automobiles',
    category: 'Automotive',
    status: 'Active',
    adminEmail: 'admin@primeauto.com',
    phone: '+91 98765 43210',
    timezone: 'Asia/Kolkata (IST)',
    maxUsers: 15,
    activeUsers: 12,
    leadsCount: 1240,
    messagesThisMonth: 3890,
    modules: ['WhatsApp Cloud API', 'Sales Pipeline', 'Analytics and Reports'],
    createdAt: '2026-01-10',
    avatarColor: '#71ebb8',
    tempPassword: 'PA-Admin@2026!'
  },
  {
    id: 'org-2',
    name: 'GoldCash Finance',
    category: 'Finance',
    status: 'Active',
    adminEmail: 'admin@goldcash.com',
    phone: '+91 99887 76655',
    timezone: 'Asia/Kolkata (IST)',
    maxUsers: 10,
    activeUsers: 8,
    leadsCount: 876,
    messagesThisMonth: 2100,
    modules: ['WhatsApp Cloud API', 'Instagram Direct', 'Sales Pipeline'],
    createdAt: '2026-02-15',
    avatarColor: '#f59e0b',
    tempPassword: 'GC-Secure#992'
  },
  {
    id: 'org-3',
    name: 'TechStar Agency',
    category: 'Other',
    status: 'Suspended',
    adminEmail: 'admin@techstar.io',
    phone: '+91 88776 65544',
    timezone: 'Asia/Kolkata (IST)',
    maxUsers: 8,
    activeUsers: 5,
    leadsCount: 320,
    messagesThisMonth: 450,
    modules: ['WhatsApp Cloud API', 'Facebook Messenger'],
    createdAt: '2026-03-01',
    avatarColor: '#ef4444',
    tempPassword: 'TS-PassKey!88'
  },
  {
    id: 'org-4',
    name: 'Sharma Motors',
    category: 'Automotive',
    status: 'Active',
    adminEmail: 'admin@sharmamotors.in',
    phone: '+91 91234 56789',
    timezone: 'Asia/Kolkata (IST)',
    maxUsers: 25,
    activeUsers: 20,
    leadsCount: 4580,
    messagesThisMonth: 12300,
    modules: [
      'WhatsApp Cloud API',
      'Instagram Direct',
      'Facebook Messenger',
      'Sales Pipeline',
      'Analytics and Reports',
      'Broadcast Campaigns'
    ],
    createdAt: '2025-11-20',
    avatarColor: '#3b82f6',
    tempPassword: 'SM-Fleet$2026'
  },
  {
    id: 'org-5',
    name: 'AutoDeals India',
    category: 'Automotive',
    status: 'Inactive',
    adminEmail: 'admin@autodealsindia.com',
    phone: '+91 77665 54433',
    timezone: 'Asia/Kolkata (IST)',
    maxUsers: 5,
    activeUsers: 3,
    leadsCount: 90,
    messagesThisMonth: 120,
    modules: ['WhatsApp Cloud API'],
    createdAt: '2026-04-05',
    avatarColor: '#8aad9c',
    tempPassword: 'AD-India%771'
  },
  {
    id: 'org-6',
    name: 'FreshMart Retail',
    category: 'Retail',
    status: 'Active',
    adminEmail: 'admin@freshmart.co',
    phone: '+91 94567 12345',
    timezone: 'Asia/Kolkata (IST)',
    maxUsers: 10,
    activeUsers: 7,
    leadsCount: 430,
    messagesThisMonth: 980,
    modules: ['WhatsApp Cloud API', 'Sales Pipeline'],
    createdAt: '2026-04-12',
    avatarColor: '#10b981',
    tempPassword: 'FM-Store@442'
  }
];

export const INITIAL_USERS: PlatformUser[] = [
  {
    id: 'user-1',
    name: 'Rajesh Kumar',
    email: 'raj@primeauto.com',
    organization: 'Prime Automobiles',
    role: 'Org Admin',
    status: 'Active',
    lastLogin: '2 min ago',
    avatarInitials: 'RK'
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    email: 'priya@goldcash.com',
    organization: 'GoldCash Finance',
    role: 'Org Admin',
    status: 'Active',
    lastLogin: '1 hr ago',
    avatarInitials: 'PS'
  },
  {
    id: 'user-3',
    name: 'Amit Singh',
    email: 'amit@primeauto.com',
    organization: 'Prime Automobiles',
    role: 'Branch Manager',
    status: 'Active',
    lastLogin: '3 hr ago',
    avatarInitials: 'AS'
  },
  {
    id: 'user-4',
    name: 'Sunita Devi',
    email: 'sunita@techstar.io',
    organization: 'TechStar Agency',
    role: 'Agent',
    status: 'Disabled',
    lastLogin: '2 days ago',
    avatarInitials: 'SD'
  },
  {
    id: 'user-5',
    name: 'Ravi Patel',
    email: 'ravi@sharmamotors.in',
    organization: 'Sharma Motors',
    role: 'Org Admin',
    status: 'Active',
    lastLogin: '10 min ago',
    avatarInitials: 'RP'
  },
  {
    id: 'user-6',
    name: 'Kavya Nair',
    email: 'kavya@sharmamotors.in',
    organization: 'Sharma Motors',
    role: 'Agent',
    status: 'Active',
    lastLogin: '45 min ago',
    avatarInitials: 'KN'
  },
  {
    id: 'user-7',
    name: 'Deepak Gupta',
    email: 'deepak@freshmart.co',
    organization: 'FreshMart Retail',
    role: 'Org Admin',
    status: 'Active',
    lastLogin: '1 day ago',
    avatarInitials: 'DG'
  },
  {
    id: 'user-8',
    name: 'Meena Joshi',
    email: 'meena@autodealsindia.com',
    organization: 'AutoDeals India',
    role: 'Agent',
    status: 'Active',
    lastLogin: '4 hr ago',
    avatarInitials: 'MJ'
  },
  {
    id: 'user-9',
    name: 'Arjun Reddy',
    email: 'arjun@goldcash.com',
    organization: 'GoldCash Finance',
    role: 'Branch Manager',
    status: 'Active',
    lastLogin: '30 min ago',
    avatarInitials: 'AR'
  },
  {
    id: 'user-10',
    name: 'Fatima Khan',
    email: 'fatima@primeauto.com',
    organization: 'Prime Automobiles',
    role: 'Agent',
    status: 'Active',
    lastLogin: '20 min ago',
    avatarInitials: 'FK'
  }
];

export const INITIAL_TOKEN_HEALTH: TokenHealthItem[] = [
  {
    id: 'tok-1',
    organization: 'Prime Automobiles',
    channel: 'WhatsApp',
    status: 'Healthy',
    identifier: '+91 98765 43210',
    lastActivity: '2 min ago',
    tokenExpires: '60 days'
  },
  {
    id: 'tok-2',
    organization: 'GoldCash Finance',
    channel: 'WhatsApp',
    status: 'Healthy',
    identifier: '+91 99887 76655',
    lastActivity: '5 min ago',
    tokenExpires: '45 days'
  },
  {
    id: 'tok-3',
    organization: 'GoldCash Finance',
    channel: 'Instagram',
    status: 'Expiring Soon',
    identifier: '@goldcash_india',
    lastActivity: '1 hr ago',
    tokenExpires: '6 days'
  },
  {
    id: 'tok-4',
    organization: 'TechStar Agency',
    channel: 'WhatsApp',
    status: 'Disconnected',
    identifier: '+91 88776 65544',
    lastActivity: '3 days ago',
    tokenExpires: 'Expired'
  },
  {
    id: 'tok-5',
    organization: 'Sharma Motors',
    channel: 'WhatsApp',
    status: 'Healthy',
    identifier: '+91 91234 56789',
    lastActivity: '1 min ago',
    tokenExpires: '89 days'
  },
  {
    id: 'tok-6',
    organization: 'Sharma Motors',
    channel: 'Instagram',
    status: 'Healthy',
    identifier: '@sharmamotors',
    lastActivity: '20 min ago',
    tokenExpires: '71 days'
  },
  {
    id: 'tok-7',
    organization: 'Sharma Motors',
    channel: 'Facebook',
    status: 'Healthy',
    identifier: 'Sharma Motors Page',
    lastActivity: '1 hr ago',
    tokenExpires: '89 days'
  },
  {
    id: 'tok-8',
    organization: 'AutoDeals India',
    channel: 'WhatsApp',
    status: 'Expiring Soon',
    identifier: '+91 77665 54433',
    lastActivity: '6 hr ago',
    tokenExpires: '4 days'
  }
];

export const INITIAL_WEBHOOK_EVENTS: WebhookEvent[] = [
  { id: 'wh-1', timestamp: '2026-10-21 12:28:44', organization: 'Prime Automobiles', channel: 'WhatsApp', eventType: 'MESSAGE_RECEIVED', status: '200 OK', latency: '42ms' },
  { id: 'wh-2', timestamp: '2026-10-21 12:27:12', organization: 'Sharma Motors', channel: 'Instagram', eventType: 'IG_DM_RECEIVED', status: '200 OK', latency: '68ms' },
  { id: 'wh-3', timestamp: '2026-10-21 12:25:30', organization: 'GoldCash Finance', channel: 'WhatsApp', eventType: 'DELIVERY_RECEIPT', status: '200 OK', latency: '35ms' },
  { id: 'wh-4', timestamp: '2026-10-21 12:24:05', organization: 'TechStar Agency', channel: 'WhatsApp', eventType: 'MESSAGE_RECEIVED', status: '500 Error', latency: '312ms' },
  { id: 'wh-5', timestamp: '2026-10-21 12:22:18', organization: 'Sharma Motors', channel: 'Facebook', eventType: 'FB_MESSAGE_RECEIVED', status: '200 OK', latency: '74ms' },
  { id: 'wh-6', timestamp: '2026-10-21 12:20:50', organization: 'Prime Automobiles', channel: 'WhatsApp', eventType: 'READ_RECEIPT', status: '200 OK', latency: '28ms' },
  { id: 'wh-7', timestamp: '2026-10-21 12:18:11', organization: 'GoldCash Finance', channel: 'Instagram', eventType: 'IG_DM_RECEIVED', status: '200 OK', latency: '82ms' },
  { id: 'wh-8', timestamp: '2026-10-21 12:16:35', organization: 'FreshMart Retail', channel: 'WhatsApp', eventType: 'MESSAGE_RECEIVED', status: '200 OK', latency: '51ms' },
  { id: 'wh-9', timestamp: '2026-10-21 12:14:02', organization: 'Sharma Motors', channel: 'WhatsApp', eventType: 'DELIVERY_RECEIPT', status: '200 OK', latency: '33ms' },
  { id: 'wh-10', timestamp: '2026-10-21 12:12:49', organization: 'AutoDeals India', channel: 'WhatsApp', eventType: 'MESSAGE_RECEIVED', status: '500 Error', latency: '420ms' },
  { id: 'wh-11', timestamp: '2026-10-21 12:10:22', organization: 'Prime Automobiles', channel: 'WhatsApp', eventType: 'MESSAGE_RECEIVED', status: '200 OK', latency: '39ms' },
  { id: 'wh-12', timestamp: '2026-10-21 12:08:14', organization: 'GoldCash Finance', channel: 'WhatsApp', eventType: 'READ_RECEIPT', status: '200 OK', latency: '31ms' },
  { id: 'wh-13', timestamp: '2026-10-21 12:05:01', organization: 'Sharma Motors', channel: 'Instagram', eventType: 'IG_DM_RECEIVED', status: '200 OK', latency: '59ms' },
  { id: 'wh-14', timestamp: '2026-10-21 12:02:45', organization: 'FreshMart Retail', channel: 'WhatsApp', eventType: 'DELIVERY_RECEIPT', status: '200 OK', latency: '44ms' },
  { id: 'wh-15', timestamp: '2026-10-21 12:00:10', organization: 'Sharma Motors', channel: 'Facebook', eventType: 'FB_MESSAGE_RECEIVED', status: '200 OK', latency: '79ms' },
  { id: 'wh-16', timestamp: '2026-10-21 11:58:33', organization: 'Prime Automobiles', channel: 'WhatsApp', eventType: 'MESSAGE_RECEIVED', status: '200 OK', latency: '40ms' },
  { id: 'wh-17', timestamp: '2026-10-21 11:55:20', organization: 'TechStar Agency', channel: 'WhatsApp', eventType: 'DELIVERY_RECEIPT', status: '500 Error', latency: '510ms' },
  { id: 'wh-18', timestamp: '2026-10-21 11:52:15', organization: 'Sharma Motors', channel: 'WhatsApp', eventType: 'MESSAGE_RECEIVED', status: '200 OK', latency: '37ms' },
  { id: 'wh-19', timestamp: '2026-10-21 11:50:00', organization: 'GoldCash Finance', channel: 'WhatsApp', eventType: 'MESSAGE_RECEIVED', status: '200 OK', latency: '45ms' },
  { id: 'wh-20', timestamp: '2026-10-21 11:47:32', organization: 'Prime Automobiles', channel: 'WhatsApp', eventType: 'DELIVERY_RECEIPT', status: '200 OK', latency: '29ms' }
];

export const INITIAL_API_USAGE: ApiUsageItem[] = [
  { organization: 'Sharma Motors', apiCalls: 84320, errors: 42, successRate: '99.95%', peakHour: '14:00 - 15:00' },
  { organization: 'Prime Automobiles', apiCalls: 45120, errors: 18, successRate: '99.96%', peakHour: '11:00 - 12:00' },
  { organization: 'GoldCash Finance', apiCalls: 28900, errors: 124, successRate: '99.57%', peakHour: '16:00 - 17:00' },
  { organization: 'FreshMart Retail', apiCalls: 12400, errors: 9, successRate: '99.92%', peakHour: '18:00 - 19:00' },
  { organization: 'TechStar Agency', apiCalls: 6200, errors: 410, successRate: '93.38%', peakHour: '10:00 - 11:00' },
  { organization: 'AutoDeals India', apiCalls: 1840, errors: 78, successRate: '95.76%', peakHour: '13:00 - 14:00' }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: 'Oct 21 11:02',
    action: 'CREATE_ORGANIZATION',
    targetOrganization: 'Prime Automobiles',
    details: 'Created with 12 user limit, modules: WA, Pipeline, Analytics',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: {
      action: 'CREATE_ORGANIZATION',
      organizationId: 'org-1',
      name: 'Prime Automobiles',
      maxUsers: 15,
      enabledModules: ['WhatsApp Cloud API', 'Sales Pipeline', 'Analytics and Reports'],
      adminEmail: 'admin@primeauto.com',
      triggeredBy: 'admin@codymaster.com'
    }
  },
  {
    id: 'log-2',
    timestamp: 'Oct 21 10:45',
    action: 'TOGGLE_MODULE',
    targetOrganization: 'GoldCash Finance',
    details: 'Enabled Instagram module',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: {
      action: 'TOGGLE_MODULE',
      organizationId: 'org-2',
      moduleName: 'Instagram Direct',
      status: 'enabled',
      timestamp: '2026-10-21T10:45:00Z'
    }
  },
  {
    id: 'log-3',
    timestamp: 'Oct 21 10:30',
    action: 'SUSPEND_ORGANIZATION',
    targetOrganization: 'TechStar Agency',
    details: 'Reason: Payment overdue',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: {
      action: 'SUSPEND_ORGANIZATION',
      organizationId: 'org-3',
      previousStatus: 'Active',
      newStatus: 'Suspended',
      reason: 'Billing invoice #981 unpaid past 45-day grace period'
    }
  },
  {
    id: 'log-4',
    timestamp: 'Oct 21 09:15',
    action: 'RESET_ADMIN_PASSWORD',
    targetOrganization: 'AutoDeals India',
    details: 'Password reset issued for admin@autodealsindia.com',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: {
      action: 'RESET_ADMIN_PASSWORD',
      targetEmail: 'admin@autodealsindia.com',
      forceResetOnLogin: true,
      expiryHours: 24
    }
  },
  {
    id: 'log-5',
    timestamp: 'Oct 20 18:00',
    action: 'DEACTIVATE_USER',
    targetOrganization: 'Prime Automobiles',
    details: 'Disabled user: sunita@techstar.io',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: {
      action: 'DEACTIVATE_USER',
      userId: 'user-4',
      userEmail: 'sunita@techstar.io',
      status: 'Disabled'
    }
  },
  {
    id: 'log-6',
    timestamp: 'Oct 20 15:30',
    action: 'UPDATE_MODULE_LIMITS',
    targetOrganization: 'Sharma Motors',
    details: 'Max users changed: 10 to 20',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: {
      action: 'UPDATE_MODULE_LIMITS',
      previousMaxUsers: 10,
      newMaxUsers: 20,
      approvedPlan: 'Enterprise Scale'
    }
  },
  {
    id: 'log-7',
    timestamp: 'Oct 20 12:00',
    action: 'CREATE_ORGANIZATION',
    targetOrganization: 'FreshMart Retail',
    details: 'Created with 7 user limit',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: {
      action: 'CREATE_ORGANIZATION',
      organizationId: 'org-6',
      name: 'FreshMart Retail',
      maxUsers: 10,
      adminEmail: 'admin@freshmart.co'
    }
  },
  {
    id: 'log-8',
    timestamp: 'Oct 19 16:45',
    action: 'TOGGLE_MODULE',
    targetOrganization: 'Sharma Motors',
    details: 'Enabled Broadcast Campaigns module',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: {
      action: 'TOGGLE_MODULE',
      moduleName: 'Broadcast Campaigns',
      organizationId: 'org-4',
      status: 'enabled'
    }
  },
  {
    id: 'log-9',
    timestamp: 'Oct 19 14:20',
    action: 'EDIT_ORGANIZATION',
    targetOrganization: 'GoldCash Finance',
    details: 'Updated max users: 5 to 8',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: {
      action: 'EDIT_ORGANIZATION',
      fieldsChanged: ['maxUsers'],
      oldValue: 5,
      newValue: 8
    }
  },
  {
    id: 'log-10',
    timestamp: 'Oct 18 11:00',
    action: 'CREATE_ORGANIZATION',
    targetOrganization: 'GoldCash Finance',
    details: 'Initial setup',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: {
      action: 'CREATE_ORGANIZATION',
      organizationId: 'org-2',
      name: 'GoldCash Finance',
      adminEmail: 'admin@goldcash.com'
    }
  },
  {
    id: 'log-11',
    timestamp: 'Oct 17 09:30',
    action: 'TOGGLE_MODULE',
    targetOrganization: 'Prime Automobiles',
    details: 'Enabled Sales Pipeline module',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: { action: 'TOGGLE_MODULE', moduleName: 'Sales Pipeline', status: 'enabled' }
  },
  {
    id: 'log-12',
    timestamp: 'Oct 16 14:10',
    action: 'EDIT_ORGANIZATION',
    targetOrganization: 'TechStar Agency',
    details: 'Updated official contact phone',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: { action: 'EDIT_ORGANIZATION', phone: '+91 88776 65544' }
  },
  {
    id: 'log-13',
    timestamp: 'Oct 15 16:00',
    action: 'UPDATE_MODULE_LIMITS',
    targetOrganization: 'Sharma Motors',
    details: 'Allowed Broadcast templates limit raised to 50',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: { action: 'UPDATE_MODULE_LIMITS', templateLimit: 50 }
  },
  {
    id: 'log-14',
    timestamp: 'Oct 14 11:25',
    action: 'RESET_ADMIN_PASSWORD',
    targetOrganization: 'Prime Automobiles',
    details: 'Password reset issued by request',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: { action: 'RESET_ADMIN_PASSWORD', target: 'admin@primeauto.com' }
  },
  {
    id: 'log-15',
    timestamp: 'Oct 13 10:00',
    action: 'CREATE_ORGANIZATION',
    targetOrganization: 'TechStar Agency',
    details: 'Initial onboarding and module setup',
    performedBy: 'Super Admin',
    ipAddress: '103.21.45.67',
    payload: { action: 'CREATE_ORGANIZATION', name: 'TechStar Agency', adminEmail: 'admin@techstar.io' }
  }
];

export const ORG_GROWTH_DATA = [
  { month: 'Jan', count: 2 },
  { month: 'Feb', count: 4 },
  { month: 'Mar', count: 5 },
  { month: 'Apr', count: 7 },
  { month: 'May', count: 9 },
  { month: 'Jun', count: 12 },
  { month: 'Jul', count: 14 },
  { month: 'Aug', count: 16 },
  { month: 'Sep', count: 18 },
  { month: 'Oct', count: 19 },
  { month: 'Nov', count: 22 },
  { month: 'Dec', count: 24 }
];

export const MODULE_ADOPTION_DATA = [
  { name: 'Sales Pipeline', percentage: 92, color: '#71ebb8' },
  { name: 'WhatsApp', percentage: 78, color: '#22c55e' },
  { name: 'Analytics', percentage: 60, color: '#3b82f6' },
  { name: 'Instagram', percentage: 45, color: '#ec4899' },
  { name: 'Facebook', percentage: 30, color: '#8b5cf6' }
];

export const RECENT_ACTIVITIES = [
  { action: 'Organization Created', organization: 'Prime Automobiles', performedBy: 'Super Admin', time: '2 min ago', type: 'create' },
  { action: 'Module Enabled: Instagram', organization: 'GoldCash Finance', performedBy: 'Super Admin', time: '15 min ago', type: 'module' },
  { action: 'Org Suspended', organization: 'TechStar Agency', performedBy: 'Super Admin', time: '1 hr ago', type: 'suspend' },
  { action: 'Password Reset Issued', organization: 'AutoDeals India', performedBy: 'Super Admin', time: '3 hr ago', type: 'security' },
  { action: 'New Module: Broadcast', organization: 'Sharma Motors', performedBy: 'Super Admin', time: 'Yesterday', type: 'module' }
];

export const INITIAL_AGENCIES: Agency[] = [
  {
    id: 'agency-1',
    organizationId: 'org-1',
    name: 'Prime Auto - Delhi Central',
    code: 'PA-DEL-01',
    city: 'New Delhi',
    state: 'Delhi',
    status: 'Active',
    managerName: 'Amit Singh',
    agentsCount: 5,
    channels: {
      whatsapp: '+91 98765 43210',
      instagram: '@primeauto_delhi',
      facebook: 'Prime Automobiles Delhi Hub'
    },
    leadsCount: 680,
    messagesCount: 2150
  },
  {
    id: 'agency-2',
    organizationId: 'org-1',
    name: 'Prime Auto - Noida Expressway',
    code: 'PA-NOI-02',
    city: 'Noida',
    state: 'Uttar Pradesh',
    status: 'Active',
    managerName: 'Kunal Kapoor',
    agentsCount: 4,
    channels: {
      whatsapp: '+91 98765 88990',
      instagram: '@primeauto_noida'
    },
    leadsCount: 390,
    messagesCount: 1120
  },
  {
    id: 'agency-3',
    organizationId: 'org-1',
    name: 'Prime Auto - Gurgaon CyberCity',
    code: 'PA-GGN-03',
    city: 'Gurgaon',
    state: 'Haryana',
    status: 'Active',
    managerName: 'Sanjay Mehra',
    agentsCount: 3,
    channels: {
      whatsapp: '+91 98765 11223'
    },
    leadsCount: 170,
    messagesCount: 620
  },
  {
    id: 'agency-4',
    organizationId: 'org-2',
    name: 'GoldCash - Connaught Place',
    code: 'GC-CP-01',
    city: 'New Delhi',
    state: 'Delhi',
    status: 'Active',
    managerName: 'Arjun Reddy',
    agentsCount: 5,
    channels: {
      whatsapp: '+91 99887 76655',
      instagram: '@goldcash_india'
    },
    leadsCount: 520,
    messagesCount: 1450
  },
  {
    id: 'agency-5',
    organizationId: 'org-2',
    name: 'GoldCash - Bandra Kurla Complex',
    code: 'GC-BKC-02',
    city: 'Mumbai',
    state: 'Maharashtra',
    status: 'Active',
    managerName: 'Rohan Deshmukh',
    agentsCount: 3,
    channels: {
      whatsapp: '+91 99887 44332',
      instagram: '@goldcash_mumbai'
    },
    leadsCount: 356,
    messagesCount: 650
  },
  {
    id: 'agency-6',
    organizationId: 'org-4',
    name: 'Sharma Motors - Mumbai Flagship',
    code: 'SM-MUM-01',
    city: 'Mumbai',
    state: 'Maharashtra',
    status: 'Active',
    managerName: 'Ravi Patel',
    agentsCount: 8,
    channels: {
      whatsapp: '+91 91234 56789',
      instagram: '@sharmamotors',
      facebook: 'Sharma Motors Page'
    },
    leadsCount: 2450,
    messagesCount: 6800
  },
  {
    id: 'agency-7',
    organizationId: 'org-4',
    name: 'Sharma Motors - Pune West',
    code: 'SM-PUN-02',
    city: 'Pune',
    state: 'Maharashtra',
    status: 'Active',
    managerName: 'Vijay Kadam',
    agentsCount: 6,
    channels: {
      whatsapp: '+91 91234 33445',
      instagram: '@sharmamotors_pune'
    },
    leadsCount: 1280,
    messagesCount: 3400
  },
  {
    id: 'agency-8',
    organizationId: 'org-4',
    name: 'Sharma Motors - Ahmedabad Hub',
    code: 'SM-AHM-03',
    city: 'Ahmedabad',
    state: 'Gujarat',
    status: 'Active',
    managerName: 'Jatin Shah',
    agentsCount: 6,
    channels: {
      whatsapp: '+91 91234 88776'
    },
    leadsCount: 850,
    messagesCount: 2100
  },
  {
    id: 'agency-9',
    organizationId: 'org-3',
    name: 'TechStar Agency - Koramangala',
    code: 'TS-BLR-01',
    city: 'Bengaluru',
    state: 'Karnataka',
    status: 'Inactive',
    managerName: 'Sunita Devi',
    agentsCount: 5,
    channels: {
      whatsapp: '+91 88776 65544',
      facebook: 'TechStar Digital'
    },
    leadsCount: 320,
    messagesCount: 450
  },
  {
    id: 'agency-10',
    organizationId: 'org-5',
    name: 'AutoDeals - Indore Outlet',
    code: 'AD-IND-01',
    city: 'Indore',
    state: 'Madhya Pradesh',
    status: 'Inactive',
    managerName: 'Meena Joshi',
    agentsCount: 3,
    channels: {
      whatsapp: '+91 77665 54433'
    },
    leadsCount: 90,
    messagesCount: 120
  },
  {
    id: 'agency-11',
    organizationId: 'org-6',
    name: 'FreshMart - Malleshwaram Depot',
    code: 'FM-BLR-01',
    city: 'Bengaluru',
    state: 'Karnataka',
    status: 'Active',
    managerName: 'Deepak Gupta',
    agentsCount: 7,
    channels: {
      whatsapp: '+91 94567 12345'
    },
    leadsCount: 430,
    messagesCount: 980
  }
];
