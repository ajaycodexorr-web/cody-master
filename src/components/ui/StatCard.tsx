'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  accentColor: string;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  accentColor,
  subtitle,
  prefix = '',
  suffix = '',
  trend
}) => {
  const animatedValue = useAnimatedCounter(value);

  return (
    <motion.div
      whileHover={{ y: -3, borderColor: 'var(--border-strong)' }}
      transition={{ duration: 0.2 }}
      className="card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top soft accent glow in corner */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: accentColor,
          opacity: 0.08,
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: accentColor === '#71ebb8' ? 'var(--primary-soft)' : `${accentColor}18`,
            border: `1px solid ${accentColor === '#71ebb8' ? 'var(--primary-border)' : `${accentColor}33`}`,
            color: accentColor === '#71ebb8' ? 'var(--primary-text)' : accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: '28px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em'
          }}
        >
          {prefix}
          {animatedValue.toLocaleString()}
          {suffix}
        </div>

        {(subtitle || trend) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '6px',
              fontSize: '12px'
            }}
          >
            {trend && (
              <span
                style={{
                  color: trend.isPositive ? 'var(--success)' : 'var(--danger)',
                  fontWeight: 600
                }}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            )}
            {subtitle && (
              <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
