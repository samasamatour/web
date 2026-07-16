import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { SITE_URL } from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sama Sama Tour',
    template: '%s | Sama Sama Tour',
  },
  description:
    'Sama Sama Tour provides bilingual corporate outing packages in Indonesia with complete itineraries and transparent pricing.',
  applicationName: 'Sama Sama Tour',
  authors: [{ name: 'Sama Sama Tour' }],
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.jpg',
  },
  openGraph: {
    type: 'website',
    title: 'Sama Sama Tour',
    description:
      'Corporate outing and team-building programs across Indonesia for local and global markets.',
    url: SITE_URL,
    siteName: 'Sama Sama Tour',
    images: [
      {
        url: '/logo.jpeg',
        width: 1000,
        height: 1000,
        alt: 'Sama Sama Tour & Exploration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sama Sama Tour',
    description:
      'Corporate outing and team-building programs across Indonesia for local and global markets.',
    images: ['/logo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans bg-background text-foreground">{children}</body>
    </html>
  );
}
