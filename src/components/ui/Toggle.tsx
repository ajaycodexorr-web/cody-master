'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md'
}) => {
  const isSmall = size === 'sm';
  const width = isSmall ? 36 : 44;
  const height = isSmall ? 20 : 24;
  const circleSize = isSmall ? 14 : 18;
  const offset = isSmall ? 16 : 20;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: `${width}px`,
        height: `${height}px`,
        padding: '3px',
        backgroundColor: checked ? 'var(--primary)' : 'var(--bg-elevated)',
        border: `1px solid ${checked ? 'var(--primary-hover)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-pill)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
        outline: 'none',
        flexShrink: 0
      }}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          display: 'block',
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          backgroundColor: checked ? '#081711' : 'var(--text-secondary)',
          borderRadius: '50%',
          transform: checked ? `translateX(${offset}px)` : 'translateX(0px)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
        }}
      />
    </button>
  );
};
