import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sama Sama Tour - Explore Indonesia with Expert Local Guides',
  description: 'Discover the beauty of Indonesia with Sama Sama Tour. We offer customized tour packages to Bali, Lombok, Yogyakarta, Komodo, Raja Ampat and more destinations with expert local guides.',
  keywords: 'Indonesia travel, Bali tour, Lombok vacation, Indonesian tour package, Raja Ampat, Komodo tour, travel agency Indonesia',
  authors: [{ name: 'Sama Sama Tour' }],
  openGraph: {
    type: 'website',
    title: 'Sama Sama Tour - Explore Indonesia with Expert Local Guides',
    description: 'Discover the beauty of Indonesia with Sama Sama Tour. We offer customized tour packages to Bali, Lombok, Yogyakarta, Komodo, Raja Ampat and more destinations with expert local guides.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Sama Sama Tour - Indonesia Travel',
      },
    ],
    url: 'https://samamatour.com/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sama Sama Tour - Explore Indonesia with Expert Local Guides',
    description: 'Discover the beauty of Indonesia with Sama Sama Tour. We offer customized tour packages to Bali, Lombok, Yogyakarta, Komodo, Raja Ampat and more destinations with expert local guides.',
    images: ['https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'],
  },
  manifest: '/manifest.json',
  themeColor: '#1D9A8B',
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="preload" href="https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" as="image" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "Sama Sama Tour",
              "url": "https://samamatour.com",
              "logo": "https://samamatour.com/logo.webp",
              "description": "Discover the beauty of Indonesia with Sama Sama Tour. We offer customized tour packages with expert local guides.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jl. Sunset Road No. 88",
                "addressLocality": "Kuta, Bali",
                "postalCode": "80361",
                "addressCountry": "ID"
              },
              "telephone": "+6282236037774",
              "email": "info@samamatour.com"
            })
          }}
        />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}