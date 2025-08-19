import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { FirebaseProvider } from '@/contexts/FirebaseContext';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FieldPulse Dashboard',
  description: 'A modern dashboard for FieldPulse API integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <FirebaseProvider>
            {children}
          </FirebaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
