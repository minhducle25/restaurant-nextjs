import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Locale } from '@/config'
import type { Metadata } from 'next'
import evnConfig from '@/config'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'TermsPage' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${evnConfig.NEXT_PUBLIC_URL}/${locale}/terms`
    }
  }
}

export default async function TermsPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'TermsPage' })

  return (
    <div className='max-w-3xl mx-auto py-10 px-4 space-y-8'>
      <h1 className='text-3xl font-bold'>{t('title')}</h1>
      <p className='text-muted-foreground text-sm'>{t('lastUpdated')}</p>

      <section className='space-y-3'>
        <h2 className='text-xl font-semibold'>{t('section1Title')}</h2>
        <p className='text-muted-foreground leading-relaxed'>{t('section1Content')}</p>
      </section>

      <section className='space-y-3'>
        <h2 className='text-xl font-semibold'>{t('section2Title')}</h2>
        <p className='text-muted-foreground leading-relaxed'>{t('section2Content')}</p>
      </section>

      <section className='space-y-3'>
        <h2 className='text-xl font-semibold'>{t('section3Title')}</h2>
        <p className='text-muted-foreground leading-relaxed'>{t('section3Content')}</p>
      </section>

      <section className='space-y-3'>
        <h2 className='text-xl font-semibold'>{t('section4Title')}</h2>
        <p className='text-muted-foreground leading-relaxed'>{t('section4Content')}</p>
      </section>

      <section className='space-y-3'>
        <h2 className='text-xl font-semibold'>{t('section5Title')}</h2>
        <p className='text-muted-foreground leading-relaxed'>{t('section5Content')}</p>
      </section>
    </div>
  )
}
