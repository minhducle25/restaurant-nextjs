import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Locale } from '@/config'
import type { Metadata } from 'next'
import evnConfig from '@/config'
import InfoPageWrapper from '@/components/info-page-wrapper'

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
    <InfoPageWrapper>
      <div className='space-y-8'>
        <h1 className='text-3xl font-bold'>{t('title')}</h1>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold text-orange-400'>{t('storyTitle')}</h2>
          <p className='opacity-75 leading-relaxed'>{t('storyContent')}</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold text-orange-400'>{t('missionTitle')}</h2>
          <p className='opacity-75 leading-relaxed'>{t('missionContent')}</p>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold text-orange-400'>{t('valuesTitle')}</h2>
          <ul className='list-disc list-inside space-y-1 opacity-75 leading-relaxed'>
            <li>{t('value1')}</li>
            <li>{t('value2')}</li>
            <li>{t('value3')}</li>
            <li>{t('value4')}</li>
          </ul>
        </section>

        <section className='space-y-3'>
          <h2 className='text-xl font-semibold text-orange-400'>{t('contactTitle')}</h2>
          <p className='opacity-75 leading-relaxed'>{t('contactContent')}</p>
        </section>
      </div>
    </InfoPageWrapper>
  )
}
