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
  const t = await getTranslations({ locale, namespace: 'AboutPage' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${evnConfig.NEXT_PUBLIC_URL}/${locale}/about`
    }
  }
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'AboutPage' })

  return (
    <div className='max-w-3xl mx-auto py-10 px-4 space-y-8'>
      <h1 className='text-3xl font-bold'>{t('title')}</h1>

      <section className='space-y-3'>
        <h2 className='text-xl font-semibold'>{t('storyTitle')}</h2>
        <p className='text-muted-foreground leading-relaxed'>{t('storyContent')}</p>
      </section>

      <section className='space-y-3'>
        <h2 className='text-xl font-semibold'>{t('missionTitle')}</h2>
        <p className='text-muted-foreground leading-relaxed'>{t('missionContent')}</p>
      </section>

      <section className='space-y-3'>
        <h2 className='text-xl font-semibold'>{t('valuesTitle')}</h2>
        <ul className='list-disc list-inside space-y-1 text-muted-foreground leading-relaxed'>
          <li>{t('value1')}</li>
          <li>{t('value2')}</li>
          <li>{t('value3')}</li>
          <li>{t('value4')}</li>
        </ul>
      </section>

      <section className='space-y-3'>
        <h2 className='text-xl font-semibold'>{t('contactTitle')}</h2>
        <p className='text-muted-foreground leading-relaxed'>{t('contactContent')}</p>
      </section>
    </div>
  )
}
