'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

export default function PublicFooter() {
  const t = useTranslations('Footer')
  const locale = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer className='border-t bg-background mt-auto py-6 px-4'>
      <div className='max-w-5xl mx-auto flex flex-col items-center gap-3 text-sm text-muted-foreground'>
        <nav className='flex flex-wrap justify-center gap-4'>
          <Link
            href={`/${locale}/about`}
            className='hover:text-foreground transition-colors'
          >
            {t('about')}
          </Link>
          <Link
            href={`/${locale}/terms`}
            className='hover:text-foreground transition-colors'
          >
            {t('terms')}
          </Link>
          <Link
            href={`/${locale}/privacy`}
            className='hover:text-foreground transition-colors'
          >
            {t('privacy')}
          </Link>
        </nav>
        <p>{t('rights', { year })}</p>
      </div>
    </footer>
  )
}
