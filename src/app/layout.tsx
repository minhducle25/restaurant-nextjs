import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import AppProvider from '@/components/app-provider'
import { getTranslations } from 'next-intl/server'
import {Locale, locales} from '@/config'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})
// export const metadata: Metadata = {
//   title: 'Big Boy Restaurant',
//   description: 'The best restaurant in the world'
// }

export async function generateMetadata({
  params
}: {params: Promise<{ locale: Locale }>}){
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'HomePage'});
  return {
    title: t('title'),
    description: 'The best restaurant in the world'
  }
}
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)} suppressHydrationWarning >
        <AppProvider>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  )
}
