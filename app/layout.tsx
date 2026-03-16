import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gather — Real connections, real places, real people',
  description: 'In a world of endless scrolling and digital noise, Gather helps you find people to do things with — in person, in your neighborhood, for real.',
  keywords: ['community', 'local meetups', 'social connection', 'friendship', 'activities', 'anti-loneliness'],
  openGraph: {
    title: 'Gather — Real connections start here',
    description: 'Find people to do things with. In person. For real.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise min-h-screen bg-cream-50 antialiased">
        {children}
      </body>
    </html>
  )
}
