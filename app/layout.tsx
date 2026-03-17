import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ToastProvider } from './components/Toast'
import LaunchBanner from './components/LaunchBanner'

const BASE_URL = 'https://gather.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Gather — Real connections. Real places. Real people.',
    template: '%s | Gather',
  },
  description:
    'In a world of endless scrolling and digital noise, Gather helps you find people to do things with — hiking, cooking, board games, yoga — in person, in your neighborhood, for real. No algorithm. No feed. No doom.',
  keywords: [
    'local meetups', 'community app', 'make friends', 'social connection',
    'loneliness', 'activities near me', 'friendship app', 'anti-loneliness',
    'group activities', 'local events', 'real connections',
  ],
  authors: [{ name: 'Gather' }],
  creator: 'Gather',
  publisher: 'Gather PBC',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Gather',
    title: 'Gather — Stop scrolling. Start gathering.',
    description:
      'Find real people doing real things near you. Hiking, cooking, board games, yoga. No algorithm. No feed. No doom.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Gather — Real connections start here' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gather — Stop scrolling. Start gathering.',
    description: 'Find real people doing real things near you. No algorithm. No feed. No doom.',
    images: ['/opengraph-image'],
    creator: '@gatherapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  alternates: { canonical: BASE_URL },
  category: 'social',
}

export const viewport: Viewport = {
  themeColor: '#ff750d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Gather',
              description: 'Find real people doing real things near you.',
              url: BASE_URL,
              applicationCategory: 'SocialNetworkingApplication',
              operatingSystem: 'All',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '312' },
            }),
          }}
        />
      </head>
      <body className="noise min-h-screen bg-cream-50 antialiased">
        <ToastProvider>
          <LaunchBanner />
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
