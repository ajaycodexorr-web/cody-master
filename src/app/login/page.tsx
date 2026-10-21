'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
  Layers,
  Activity,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('admin@codymaster.com');
  const [password, setPassword] = useState('Admin@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      showToast('Super Admin authenticated successfully', 'success', 'Welcome');
      setTimeout(() => {
        router.push('/master/dashboard');
      }, 700);
    } else {
      setErrorMessage(result.error || 'Authentication failed');
      showToast(result.error || 'Invalid credentials', 'error');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@codymaster.com');
    setPassword('Admin@2026');
    setErrorMessage('');
    showToast('Demo credentials filled', 'info');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        backgroundColor: 'var(--bg-base)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Animated Gradient Blobs */}
      <div
        className="animated-blob"
        style={{
          top: '-10%',
          left: '-5%',
          opacity: 0.6
        }}
      />
      <div
        className="animated-blob"
        style={{
          bottom: '-15%',
          right: '20%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(10, 15, 13, 0) 70%)',
          animationDuration: '16s'
        }}
      />

      {/* Left 45% Branding Panel */}
      <div
        style={{
          flex: '0 0 45%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 48px',
          position: 'relative',
          borderRight: '1px solid var(--border)',
          backgroundColor: 'rgba(17, 25, 22, 0.4)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 2
        }}
      >
        {/* Brand Logo */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #71ebb8 0%, #1e3a2b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#07130e',
                fontWeight: 800,
                fontSize: '22px',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              C
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', letterSpacing: '-0.02em' }}>
              <span style={{ fontWeight: 800, color: 'var(--primary)' }}>Cody</span>
              <span style={{ fontWeight: 300, color: 'var(--primary)', opacity: 0.9, marginLeft: '4px' }}>
                Master
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--primary-soft)',
              border: '1px solid var(--primary-border)',
              color: 'var(--primary)',
              fontSize: '11px',
              fontWeight: 600,
              marginBottom: '20px'
            }}
          >
            <ShieldCheck size={13} />
            <span>SUPER ADMIN CONTROL SYSTEM</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '40px',
              lineHeight: 1.15,
              fontWeight: 800,
              color: 'var(--text-primary)',
              maxWidth: '420px',
              letterSpacing: '-0.03em'
            }}
          >
            One Dashboard to Rule Every Organization.
          </h1>

          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              marginTop: '16px',
              maxWidth: '400px',
              lineHeight: '1.6'
            }}
          >
            Provision multi-tenant organizations, manage Meta cloud tokens, audit administrative changes, and monitor system-wide throughput from a single unified nexus.
          </p>
        </div>

        {/* 3 Floating Feature Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '40px 0' }}>
          <div
            className="float-slow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 18px',
              width: 'fit-content',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(113, 235, 184, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Building2 size={16} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Multi-Tenant Provisioning
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Instant org creation & credential dispatch
              </div>
            </div>
          </div>

          <div
            className="float-medium"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 18px',
              width: 'fit-content',
              marginLeft: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Layers size={16} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Modular Feature Activation
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                WhatsApp, Instagram, Pipeline & Broadcasts
              </div>
            </div>
          </div>

          <div
            className="float-fast"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 18px',
              width: 'fit-content',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Activity size={16} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Real-Time Token & Webhook Health
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Sub-50ms latency & proactive expiry alerts
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          © 2026 Cody-Master Technologies Inc. Super Admin Node v3.4.1
        </div>
      </div>

      {/* Right 55% Form Panel */}
      <div
        style={{
          flex: '1 1 55%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: 'rgba(17, 25, 22, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Welcome back, Admin
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Authenticate with your Master Key to access platform operations.
            </p>
          </div>

          {errorMessage && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#f87171',
                fontSize: '12px',
                marginBottom: '20px'
              }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px'
                }}
              >
                Super Admin Email
              </label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="admin@codymaster.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px'
                }}
              >
                Master Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              style={{ width: '100%', marginTop: '6px' }}
              icon={isSuccess ? <CheckCircle2 size={18} color="#091811" /> : undefined}
            >
              {isSuccess ? 'Verified! Redirecting...' : 'Sign In to Master Panel'}
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div
            style={{
              marginTop: '24px',
              padding: '14px',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Demo Master Credentials:</div>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                admin@codymaster.com / Admin@2026
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={handleFillDemo} icon={<Sparkles size={12} />}>
              Auto Fill
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
