'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Building2,
  CheckCircle2,
  Users,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Zap,
  Layers,
  Shield,
  Clock,
  Eye
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { ORG_GROWTH_DATA, MODULE_ADOPTION_DATA, RECENT_ACTIVITIES } from '@/data/dummyData';
import { useMasterData } from '@/context/MasterDataContext';

export default function DashboardPage() {
  const router = useRouter();
  const { organizations, users } = useMasterData();
  const [hoveredPoint, setHoveredPoint] = useState<{ month: string; count: number } | null>(null);

  // Stats calculation
  const totalOrgs = 24;
  const activeOrgs = 19;
  const platformUsers = 247;
  const messagesToday = 4832;

  // Active orgs quick view (take top 3 active)
  const activeQuickViewOrgs = organizations.filter((o) => o.status === 'Active').slice(0, 3);

  // SVG Line Chart coordinates math
  const chartWidth = 640;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const maxVal = 28;

  const points = ORG_GROWTH_DATA.map((d, i) => {
    const x = paddingX + (i / (ORG_GROWTH_DATA.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.count / maxVal) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Title & Welcome Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Platform Overview
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Real-time status of all tenants, message volume, and module adoption rates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="outline"
            size="md"
            onClick={() => router.push('/master/integrations')}
            icon={<Zap size={15} color="var(--primary)" />}
          >
            Token Health
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => router.push('/master/organizations')}
            icon={<Building2 size={15} />}
          >
            View Organizations
          </Button>
        </div>
      </div>

      {/* 4 Animated Counter Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <StatCard
          title="Total Organizations"
          value={totalOrgs}
          icon={<Building2 size={20} />}
          accentColor="#71ebb8"
          trend={{ value: '12% this month', isPositive: true }}
          subtitle="Registered businesses"
        />
        <StatCard
          title="Active Organizations"
          value={activeOrgs}
          icon={<CheckCircle2 size={20} />}
          accentColor="#22c55e"
          trend={{ value: '79.1% uptime', isPositive: true }}
          subtitle="Currently active"
        />
        <StatCard
          title="Platform Users"
          value={platformUsers}
          icon={<Users size={20} />}
          accentColor="#3b82f6"
          trend={{ value: '+18 this week', isPositive: true }}
          subtitle="Total agents & managers"
        />
        <StatCard
          title="Messages Today"
          value={messagesToday}
          icon={<MessageSquare size={20} />}
          accentColor="#f59e0b"
          trend={{ value: '+24% vs yesterday', isPositive: true }}
          subtitle="Meta API throughput"
        />
      </div>

      {/* Charts Row: Line Chart (60%) + Donut Chart (40%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Left: Organization Growth Line Chart */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Organization Growth
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Cumulative tenant onboarding over last 12 months
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--primary)',
                fontWeight: 600,
                backgroundColor: 'var(--primary-soft)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)'
              }}
            >
              <TrendingUp size={14} />
              <span>+1,100% YoY</span>
            </div>
          </div>

          {/* SVG Chart */}
          <div style={{ position: 'relative', width: '100%', height: '220px', flex: 1 }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#71ebb8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#71ebb8" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid Lines */}
              {[7, 14, 21, 28].map((val) => {
                const y = chartHeight - paddingY - (val / maxVal) * (chartHeight - paddingY * 2);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="var(--border)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      fill="var(--text-muted)"
                      fontSize="10"
                      textAnchor="end"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Gradient Area Fill */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                d={areaD}
                fill="url(#primaryAreaGrad)"
              />

              {/* Main Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                d={pathD}
                fill="none"
                stroke="#71ebb8"
                strokeWidth="3"
                filter="url(#glow)"
              />

              {/* Point Circles & X-Labels */}
              {points.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.month === pt.month ? 6 : 4}
                    fill={hoveredPoint?.month === pt.month ? '#71ebb8' : '#111916'}
                    stroke="#71ebb8"
                    strokeWidth="2.5"
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <text
                    x={pt.x}
                    y={chartHeight - 8}
                    fill={hoveredPoint?.month === pt.month ? 'var(--primary)' : 'var(--text-muted)'}
                    fontSize="11"
                    textAnchor="middle"
                    fontWeight={hoveredPoint?.month === pt.month ? 'bold' : 'normal'}
                  >
                    {pt.month}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '20px',
                  backgroundColor: '#18231e',
                  border: '1px solid var(--primary-border)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-glow)',
                  fontSize: '12px',
                  color: 'var(--text-primary)'
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>{hoveredPoint.month}: </span>
                <strong style={{ color: 'var(--primary)' }}>{hoveredPoint.count} Organizations</strong>
              </div>
            )}
          </div>
        </div>

        {/* Right: Module Adoption Donut Chart */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Module Adoption
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Feature licensing density across all active orgs
            </div>
          </div>

          {/* Donut Graphic & Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
            {/* SVG Donut */}
            <div style={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="38" fill="none" stroke="var(--bg-elevated)" strokeWidth="12" />
                {/* Visual stacked rings */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#71ebb8"
                  strokeWidth="12"
                  strokeDasharray={`${92 * 2.38} 238`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="26"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="8"
                  strokeDasharray={`${78 * 1.63} 163`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="16"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="6"
                  strokeDasharray={`${60 * 1.0} 100`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>92%</span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Pipeline
                </span>
              </div>
            </div>

            {/* Legend List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              {MODULE_ADOPTION_DATA.map((item) => (
                <div key={item.name}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: item.color
                        }}
                      />
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</span>
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{item.percentage}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        backgroundColor: item.color,
                        borderRadius: '2px'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Orgs Quick View — 3 Cards Row */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Active Organizations Quick View
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Top organizations operating with highest message volume
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/master/organizations')}
            icon={<ArrowUpRight size={14} />}
          >
            See All 24 Orgs
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {activeQuickViewOrgs.map((org) => (
            <motion.div
              key={org.id}
              whileHover={{ y: -3, borderColor: 'var(--border-strong)' }}
              className="card"
              style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: `${org.avatarColor}20`,
                      border: `1px solid ${org.avatarColor}40`,
                      color: org.avatarColor,
                      fontSize: '15px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {org.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                      {org.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {org.category} • {org.activeUsers} active users
                    </div>
                  </div>
                </div>
                <StatusBadge status={org.status} />
              </div>

              {/* Channel Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {org.modules.slice(0, 3).map((m) => (
                  <span
                    key={m}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-pill)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {m.replace('Cloud API', '').replace('Direct', '').replace('Messenger', '')}
                  </span>
                ))}
                {org.modules.length > 3 && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      backgroundColor: 'var(--primary-soft)',
                      borderRadius: 'var(--radius-pill)',
                      color: 'var(--primary)'
                    }}
                  >
                    +{org.modules.length - 3}
                  </span>
                )}
              </div>

              {/* Stats Footer & View Button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border)'
                }}
              >
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{org.leadsCount.toLocaleString()}</strong> leads •{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{org.messagesThisMonth.toLocaleString()}</strong> msgs
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/master/organizations')}
                  icon={<Eye size={12} />}
                >
                  View
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recent Administrative Activity
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Real-time audit log of Super Admin interventions
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/master/audit-logs')}
            icon={<ArrowUpRight size={14} />}
          >
            Audit Trail
          </Button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Action</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Organization</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Performed By</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ACTIVITIES.map((row, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor:
                            row.type === 'create'
                              ? 'var(--primary)'
                              : row.type === 'suspend'
                              ? 'var(--danger)'
                              : row.type === 'security'
                              ? 'var(--warning)'
                              : 'var(--info)'
                        }}
                      />
                      <span>{row.action}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                    {row.organization}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--primary-soft)',
                        color: 'var(--primary)',
                        fontSize: '11px',
                        fontWeight: 600
                      }}
                    >
                      {row.performedBy}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      <span>{row.time}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
