'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Users,
  PlugZap,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/master/dashboard', icon: LayoutDashboard },
  { label: 'Organizations', href: '/master/organizations', icon: Building2 },
  { label: 'Platform Users', href: '/master/users', icon: Users },
  { label: 'Integrations', href: '/master/integrations', icon: PlugZap },
  { label: 'Audit Logs', href: '/master/audit-logs', icon: FileText },
  { label: 'Settings', href: '/master/settings', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      style={{
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 50,
        overflow: 'hidden',
        flexShrink: 0
      }}
    >
      {/* Top Section: Logo & Toggle */}
      <div>
        <div
          style={{
            height: '70px',
            padding: isCollapsed ? '0 16px' : '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid var(--border)'
          }}
        >
          {!isCollapsed && (
            <Link
              href="/master/dashboard"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #71ebb8 0%, #1e3a2b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#07130e',
                  fontWeight: 800,
                  fontSize: '16px'
                }}
              >
                C
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', letterSpacing: '-0.02em' }}>
                <span style={{ fontWeight: 800, color: 'var(--primary-text)' }}>Cody</span>
                <span style={{ fontWeight: 300, color: 'var(--primary-text)', opacity: 0.9, marginLeft: '3px' }}>Master</span>
              </div>
            </Link>
          )}

          {isCollapsed && (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #71ebb8 0%, #1e3a2b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#07130e',
                fontWeight: 800,
                fontSize: '18px'
              }}
            >
              C
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-pill)',
              width: '26px',
              height: '26px',
              display: isCollapsed ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <ChevronLeft size={14} />
          </button>
        </div>

        {/* Collapsed expand button below header */}
        {isCollapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
            <button
              onClick={onToggleCollapse}
              title="Expand Sidebar"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-pill)',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Nav Items List */}
        <nav style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/master/dashboard');

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
              >
                <Link
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isCollapsed ? '10px 0' : '10px 14px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: isCollapsed ? 'var(--radius-md)' : '0 var(--radius-md) var(--radius-md) 0',
                    borderLeft: !isCollapsed && isActive ? '4px solid var(--primary)' : '4px solid transparent',
                    backgroundColor: isActive ? 'var(--primary-soft)' : 'transparent',
                    color: isActive ? 'var(--primary-text)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '13px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.3 : 1.8} style={{ flexShrink: 0 }} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div
        style={{
          padding: isCollapsed ? '16px 8px' : '16px',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--bg-elevated)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
        >
          {/* Avatar initials */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--primary-soft)',
              border: '1px solid var(--primary-border)',
              color: 'var(--primary-text)',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {user?.initials || 'SA'}
          </div>

          {!isCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {user?.name || 'Super Admin'}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  color: 'var(--primary-text)',
                  fontWeight: 600,
                  marginTop: '1px'
                }}
              >
                <ShieldCheck size={11} />
                <span>Super Admin</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
