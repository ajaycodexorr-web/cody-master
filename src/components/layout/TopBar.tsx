'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  ChevronRight,
  X,
  ExternalLink,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useMasterData } from '@/context/MasterDataContext';

export const TopBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { organizations, users } = useMasterData();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  // Notifications state
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      title: 'Token Expiring Soon',
      desc: 'GoldCash Finance Instagram token expires in 6 days.',
      time: '1 hr ago',
      type: 'warning'
    },
    {
      id: 2,
      title: 'High Webhook Error Spike',
      desc: 'TechStar Agency WhatsApp webhook failed with 500 error.',
      time: '3 hr ago',
      type: 'danger'
    },
    {
      id: 3,
      title: 'New Organization Created',
      desc: 'Prime Automobiles setup completed with 12 active users.',
      time: '5 hr ago',
      type: 'success'
    }
  ]);

  // Live formatted clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setCurrentTime(`${formatted} • ${timeStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setShowSearchModal(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Breadcrumbs generator
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    return parts.map((part) => {
      if (part === 'master') return 'Master';
      if (part === 'dashboard') return 'Dashboard';
      if (part === 'organizations') return 'Organizations';
      if (part === 'users') return 'Platform Users';
      if (part === 'integrations') return 'Integrations & Webhooks';
      if (part === 'audit-logs') return 'Audit Logs';
      if (part === 'settings') return 'Settings';
      return part.charAt(0).toUpperCase() + part.slice(1);
    });
  };

  const breadcrumbs = getBreadcrumbs();

  // Search results
  const filteredOrgs = searchQuery.trim()
    ? organizations.filter((o) =>
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.adminEmail.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredUsers = searchQuery.trim()
    ? users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.organization.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <header
        style={{
          height: '70px',
          backgroundColor: '#0d1411',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}
      >
        {/* Left: Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={14} color="var(--text-muted)" />}
                <span
                  style={{
                    color: isLast ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: isLast ? 600 : 400
                  }}
                >
                  {crumb}
                </span>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Global Search Bar with Cmd+K */}
          <div
            onClick={() => setShowSearchModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-pill)',
              padding: '7px 14px',
              width: '260px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '13px',
              transition: 'border-color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary-border)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <Search size={15} color="var(--text-secondary)" />
            <span style={{ flex: 1, userSelect: 'none' }}>Quick search...</span>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)'
              }}
            >
              ⌘K
            </span>
          </div>

          {/* Current Date / Time Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              padding: '6px 12px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border)'
            }}
          >
            <Calendar size={13} color="var(--primary)" />
            <span>{currentTime || 'Loading...'}</span>
          </div>

          {/* Notification Bell with Badge */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              style={{
                position: 'relative',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-pill)',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Bell size={17} />
              {notificationsList.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#07130e',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-glow)'
                  }}
                >
                  {notificationsList.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '320px',
                    backgroundColor: '#111916',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-modal)',
                    padding: '16px',
                    zIndex: 100
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--border)'
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                      System Alerts ({notificationsList.length})
                    </span>
                    <button
                      onClick={() => setNotificationsList([])}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      Clear all
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notificationsList.length === 0 ? (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px 0', fontSize: '12px' }}>
                        No new notifications
                      </div>
                    ) : (
                      notificationsList.map((n) => (
                        <div
                          key={n.id}
                          style={{
                            padding: '10px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-elevated)',
                            border: '1px solid var(--border)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>
                              {n.title}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{n.time}</span>
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                            {n.desc}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--primary-soft)',
                border: '1px solid var(--primary-border)',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
            >
              {user?.initials || 'SA'}
            </div>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '220px',
                    backgroundColor: '#111916',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-modal)',
                    padding: '8px',
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                      Super Admin
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      admin@codymaster.com
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      router.push('/master/settings');
                      setShowProfileMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <Shield size={14} />
                    <span>Master Settings</span>
                  </button>

                  <button
                    onClick={logout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--danger)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '4px'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Quick Search Overlay Modal (Cmd+K) */}
      <AnimatePresence>
        {showSearchModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '100px'
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearchModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(5, 8, 7, 0.8)',
                backdropFilter: 'blur(8px)'
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '560px',
                backgroundColor: '#111916',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-modal)',
                overflow: 'hidden',
                zIndex: 100000
              }}
            >
              {/* Search Input Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border)'
                }}
              >
                <Search size={18} color="var(--primary)" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search organizations, users, channels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => setShowSearchModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search Results */}
              <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '12px' }}>
                {!searchQuery.trim() ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    Type an organization name, admin email, or team member to search instantly.
                  </div>
                ) : filteredOrgs.length === 0 && filteredUsers.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No results found for &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  <>
                    {filteredOrgs.length > 0 && (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)', padding: '4px 8px', textTransform: 'uppercase' }}>
                          Organizations
                        </div>
                        {filteredOrgs.map((org) => (
                          <div
                            key={org.id}
                            onClick={() => {
                              setShowSearchModal(false);
                              router.push('/master/organizations');
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 12px',
                              borderRadius: 'var(--radius-md)',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {org.name}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {org.adminEmail} • {org.category}
                              </div>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--primary)' }}>View</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {filteredUsers.length > 0 && (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--info)', padding: '4px 8px', textTransform: 'uppercase' }}>
                          Platform Users
                        </div>
                        {filteredUsers.map((u) => (
                          <div
                            key={u.id}
                            onClick={() => {
                              setShowSearchModal(false);
                              router.push('/master/users');
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 12px',
                              borderRadius: 'var(--radius-md)',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {u.name}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {u.email} • {u.organization}
                              </div>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{u.role}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
