'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', title?: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { id, type, title, message, duration };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Floating Container at Bottom-Right */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '380px',
          width: '100%',
          pointerEvents: 'none'
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const icons = {
              success: <CheckCircle2 size={18} color="#22c55e" />,
              error: <AlertCircle size={18} color="#ef4444" />,
              info: <Info size={18} color="#3b82f6" />,
              warning: <AlertTriangle size={18} color="#f59e0b" />
            };

            const borderColors = {
              success: 'rgba(34, 197, 94, 0.3)',
              error: 'rgba(239, 68, 68, 0.3)',
              info: 'rgba(59, 130, 246, 0.3)',
              warning: 'rgba(245, 158, 11, 0.3)'
            };

            const bgGlow = {
              success: 'rgba(34, 197, 94, 0.1)',
              error: 'rgba(239, 68, 68, 0.1)',
              info: 'rgba(59, 130, 246, 0.1)',
              warning: 'rgba(245, 158, 11, 0.1)'
            };

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                  pointerEvents: 'auto',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--bg-surface)',
                  backgroundColor: '#111916',
                  border: `1px solid ${borderColors[toast.type]}`,
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  {icons[toast.type]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {toast.title && (
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {toast.title}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {toast.message}
                  </div>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <X size={14} />
                </button>

                {/* Progress bar */}
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: (toast.duration || 4000) / 1000, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '3px',
                    background: borderColors[toast.type]
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
