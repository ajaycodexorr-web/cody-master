import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { MasterDataProvider } from '@/context/MasterDataContext';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap'
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Cody-Master | Super Admin Control Panel',
  description: 'One Dashboard to Rule Every Organization. Multi-tenant provisioning, Meta Cloud API token health, and platform telemetry.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <ToastProvider>
          <AuthProvider>
            <MasterDataProvider>
              {children}
            </MasterDataProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
