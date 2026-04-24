import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StandForge · Stand CRM',
  description:
    'Forge your sales floor. StandForge é a plataforma premium de gestão de stands imobiliários — leads, plantão, agenda e IA contextual.',
  manifest: '/manifest.json',
  applicationName: 'StandForge',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StandForge',
  },
};

export const viewport: Viewport = {
  themeColor: '#06070b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-center"
          theme="dark"
          toastOptions={{ className: 'sf-toast' }}
        />
      </body>
    </html>
  );
}
