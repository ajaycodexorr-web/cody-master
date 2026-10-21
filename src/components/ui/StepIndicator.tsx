'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  subtitle: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginBottom: '28px'
      }}
    >
      {/* Background Connecting Line */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '32px',
          right: '32px',
          height: '2px',
          backgroundColor: 'var(--border)',
          zIndex: 1
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: 'var(--primary)',
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>

      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div
            key={idx}
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              width: '120px'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isCompleted
                  ? 'var(--primary)'
                  : isActive
                  ? 'var(--bg-surface)'
                  : 'var(--bg-elevated)',
                border: `2px solid ${
                  isCompleted || isActive ? 'var(--primary)' : 'var(--border)'
                }`,
                color: isCompleted
                  ? '#091510'
                  : isActive
                  ? 'var(--primary)'
                  : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '12px',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNum}
            </div>
            <div
              style={{
                marginTop: '8px',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--primary)' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
            >
              {step.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};
