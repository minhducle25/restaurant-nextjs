import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import AppProvider from '@/components/app-provider'
import { getTranslations } from 'next-intl/server'
import { Locale, locales } from '@/config'
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
    }
  }
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
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)} suppressHydrationWarning >
        <AppProvider>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <NextTopLoader color='#f97316' showSpinner={false} />
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  )
}
