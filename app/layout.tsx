import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bizplannaija - AI-Powered Business Landing Pages',
  description: 'Create stunning, professional landing pages for your Nigerian business in minutes with AI-powered content generation.',
  generator: 'v0.dev'
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
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
