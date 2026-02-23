import type { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import AppProvider from '@/components/app-provider'
import { GoogleAnalytics } from '@/components/analytics'
import { getTranslations } from 'next-intl/server'
import { Locale } from '@/config'
import evnConfig from '@/config'
import NextTopLoader from 'nextjs-toploader'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'HomePage' })
  return {
    metadataBase: new URL(evnConfig.NEXT_PUBLIC_URL),
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`
    },
    description: t('description'),
    openGraph: {
      type: 'website',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      siteName: t('title'),
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: '/banner.png',
          width: 1200,
          height: 630,
          alt: t('title')
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/banner.png']
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ]
    },
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: t('title')
    },
    formatDetection: {
      telephone: true,
      email: true,
      address: true
    }
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover'
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale?: string }>
}>) {
  const { locale } = await params
  return (
    <html lang={locale ?? 'vi'} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)} suppressHydrationWarning >
        {evnConfig.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={evnConfig.NEXT_PUBLIC_GA_ID} />
        )}
        <AppProvider>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} disableTransitionOnChange>
          <NextTopLoader color='#f97316' showSpinner={false} />
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  )
}
