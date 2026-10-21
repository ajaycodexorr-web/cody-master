'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.replace('/master/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoggedIn, isLoading, router]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        backgroundColor: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--primary)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #71ebb8 0%, #1e3a2b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#07130e',
            fontWeight: 800,
            fontSize: '20px'
          }}
        >
          C
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Connecting to Master Node...</span>
      </div>
    </div>
  );
}
