'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlugZap,
  Activity,
  BarChart3,
  RefreshCw,
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  Clock
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '@/components/ui/BrandIcons';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { useMasterData } from '@/context/MasterDataContext';
import { INITIAL_API_USAGE, TokenHealthItem } from '@/data/dummyData';

export default function IntegrationsPage() {
  const { tokenHealth, webhookEvents, refreshWebhooks, notifyTokenAdmin } = useMasterData();

  const [activeTab, setActiveTab] = useState<'tokens' | 'webhooks' | 'usage'>('tokens');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters for Token Health
  const [tokenStatusFilter, setTokenStatusFilter] = useState<'All' | 'Healthy' | 'Expiring' | 'Disconnected'>('All');
  const [tokenChannelFilter, setTokenChannelFilter] = useState<'All' | 'WhatsApp' | 'Instagram' | 'Facebook'>('All');

  // Filtered Tokens
  const filteredTokens = tokenHealth.filter((item) => {
    let statusMatch = true;
    if (tokenStatusFilter === 'Healthy') statusMatch = item.status === 'Healthy';
    if (tokenStatusFilter === 'Expiring') statusMatch = item.status === 'Expiring Soon';
    if (tokenStatusFilter === 'Disconnected') statusMatch = item.status === 'Disconnected';

    let channelMatch = true;
    if (tokenChannelFilter !== 'All') channelMatch = item.channel === tokenChannelFilter;

    return statusMatch && channelMatch;
  });

  const handleRefreshWebhooks = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 500));
    refreshWebhooks();
    setIsRefreshing(false);
  };

  const getChannelIcon = (ch: TokenHealthItem['channel']) => {
    switch (ch) {
      case 'WhatsApp':
        return <MessageCircle size={16} color="#22c55e" />;
      case 'Instagram':
        return <InstagramIcon size={16} color="#ec4899" />;
      case 'Facebook':
        return <FacebookIcon size={16} color="#3b82f6" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Integrations & Token Health
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Monitor Meta Cloud API bearer tokens, webhook event streams, and platform usage limits
          </p>
        </div>

        {activeTab === 'webhooks' && (
          <Button
            variant="outline"
            size="md"
            onClick={handleRefreshWebhooks}
            isLoading={isRefreshing}
            icon={<RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />}
          >
            Refresh Stream
          </Button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '2px'
        }}
      >
        {[
          { id: 'tokens', label: 'Token Health', icon: ShieldCheck, count: tokenHealth.length },
          { id: 'webhooks', label: 'Webhook Events', icon: Activity, count: webhookEvents.length },
          { id: 'usage', label: 'API Usage', icon: BarChart3, count: null }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'tokens' | 'webhooks' | 'usage')}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: 'transparent',
                border: 'none',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  style={{
                    fontSize: '11px',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: isActive ? 'var(--primary-soft)' : 'var(--bg-elevated)',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)'
                  }}
                >
                  {tab.count}
                </span>
              )}

              {/* Animated Tab Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--primary)',
                    boxShadow: 'var(--shadow-glow)'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: TOKEN HEALTH */}
      {activeTab === 'tokens' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            {/* Status Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '4px' }}>Status:</span>
              {(['All', 'Healthy', 'Expiring', 'Disconnected'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTokenStatusFilter(filter)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: tokenStatusFilter === filter ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: tokenStatusFilter === filter ? 'var(--primary-soft)' : 'var(--bg-surface)',
                    color: tokenStatusFilter === filter ? 'var(--primary)' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Channel Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '4px' }}>Channel:</span>
              {(['All', 'WhatsApp', 'Instagram', 'Facebook'] as const).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setTokenChannelFilter(ch)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: tokenChannelFilter === ch ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: tokenChannelFilter === ch ? 'var(--primary-soft)' : 'var(--bg-surface)',
                    color: tokenChannelFilter === ch ? 'var(--primary)' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Token Health Table */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--text-muted)'
                  }}
                >
                  <tr>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Organization</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Channel</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Phone / Page / Handle</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Last Activity</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Token Expires</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTokens.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.organization}
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getChannelIcon(item.channel)}
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.channel}</span>
                        </div>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <StatusBadge status={item.status} />
                      </td>

                      <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {item.identifier}
                      </td>

                      <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          <span>{item.lastActivity}</span>
                        </div>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            fontWeight: 600,
                            color:
                              item.status === 'Disconnected'
                                ? 'var(--danger)'
                                : item.status === 'Expiring Soon'
                                ? 'var(--warning)'
                                : 'var(--text-secondary)'
                          }}
                        >
                          {item.tokenExpires}
                        </span>
                      </td>

                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        {item.status !== 'Healthy' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => notifyTokenAdmin(item.id)}
                            icon={<Bell size={12} color="#f59e0b" />}
                          >
                            Notify Admin
                          </Button>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WEBHOOK EVENTS */}
      {activeTab === 'webhooks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Live incoming webhook payloads from Meta Cloud API
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--success)' }}>
              <span className="pulse-dot" style={{ backgroundColor: 'var(--success)' }} />
              <span>Real-Time Stream Active</span>
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto', maxHeight: '580px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead
                  style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'var(--bg-elevated)',
                    borderBottom: '1px solid var(--border-strong)',
                    color: 'var(--text-muted)',
                    zIndex: 10
                  }}
                >
                  <tr>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Timestamp</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Organization</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Channel</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Event Type</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>HTTP Status</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {webhookEvents.map((evt, idx) => (
                    <motion.tr
                      key={evt.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '12px 20px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {evt.timestamp}
                      </td>

                      <td style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {evt.organization}
                      </td>

                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getChannelIcon(evt.channel)}
                          <span style={{ color: 'var(--text-secondary)' }}>{evt.channel}</span>
                        </div>
                      </td>

                      <td style={{ padding: '12px 20px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--primary-text)' }}>
                        {evt.eventType}
                      </td>

                      <td style={{ padding: '12px 20px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: evt.status === '200 OK' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: evt.status === '200 OK' ? '#22c55e' : '#ef4444',
                            border: `1px solid ${evt.status === '200 OK' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                          }}
                        >
                          {evt.status}
                        </span>
                      </td>

                      <td style={{ padding: '12px 20px', textAlign: 'right', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {evt.latency}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: API USAGE */}
      {activeTab === 'usage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Visual Usage Bar Chart */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                API Calls per Organization (Current Month)
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Normalized load comparison across licensed tenants
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {INITIAL_API_USAGE.map((item) => {
                const maxCalls = 100000;
                const percentage = Math.round((item.apiCalls / maxCalls) * 100);

                return (
                  <div key={item.organization}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.organization}</span>
                      <span style={{ color: 'var(--primary)', fontFamily: 'monospace', fontWeight: 600 }}>
                        {item.apiCalls.toLocaleString()} calls
                      </span>
                    </div>

                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: 'linear-gradient(90deg, #71ebb8 0%, #3b82f6 100%)',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API Metrics Table */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--text-muted)'
                  }}
                >
                  <tr>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Organization</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Total API Calls</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Errors Count</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>Success Rate</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Peak Traffic Hour</th>
                  </tr>
                </thead>
                <tbody>
                  {INITIAL_API_USAGE.map((row) => (
                    <tr
                      key={row.organization}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {row.organization}
                      </td>

                      <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {row.apiCalls.toLocaleString()}
                      </td>

                      <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: row.errors > 50 ? 'var(--danger)' : 'var(--text-muted)' }}>
                        {row.errors}
                      </td>

                      <td style={{ padding: '14px 20px', color: 'var(--success)', fontWeight: 600 }}>
                        {row.successRate}
                      </td>

                      <td style={{ padding: '14px 20px', textAlign: 'right', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {row.peakHour}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
