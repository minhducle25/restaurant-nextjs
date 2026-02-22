'use client'

import { useState, useSyncExternalStore } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import NavItems from '@/app/[locale]/(public)/nav-items'
import { SwitchLanguage } from '@/components/switch-language'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function InfoPageWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const t = useTranslations('Footer')
  const router = useRouter()
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('system')

  const systemDark = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    () => true
  )

  const isDark = themeMode === 'system' ? systemDark : themeMode === 'dark'

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto font-sans transition-colors duration-500 ${
        isDark ? 'bg-black text-white' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* NAVBAR — same as TikTok */}
      <nav
        className={`sticky top-0 w-full z-50 px-4 md:px-6 py-3 flex items-center justify-between transition-colors ${
          isDark
            ? 'bg-black/80 backdrop-blur-md border-b border-white/10'
            : 'bg-white/80 backdrop-blur-md border-b border-slate-200'
        }`}
      >
        {/* Left: back button + Logo + Nav links */}
        <div className='flex items-center gap-4 md:gap-8'>
          <button
            onClick={() => router.back()}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? 'hover:bg-white/10 text-white'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
            aria-label='Go back'
          >
            <ArrowLeft size={20} />
          </button>
          <Link href='/' className='flex items-center gap-2 shrink-0'>
            <div className='w-9 h-9 bg-linear-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:scale-105 transition-transform'>
              BB
            </div>
            <span
              className={`text-xl font-black tracking-tight hidden sm:block ${
                isDark ? 'text-white drop-shadow-md' : 'text-slate-900'
              }`}
            >
              Big Boy
            </span>
          </Link>
          <div
            className={`hidden md:flex items-center gap-5 text-sm font-semibold ${
              isDark ? 'text-slate-200' : 'text-slate-700'
            }`}
          >
            <NavItems
              className={
                isDark
                  ? 'hover:text-orange-400 transition-colors'
                  : 'hover:text-orange-500 transition-colors'
              }
            />
          </div>
        </div>

        {/* Right: Language + Theme */}
        <div className='flex items-center gap-3'>
          <SwitchLanguage />
          <div
            className={`flex items-center p-1 rounded-full border shadow-lg backdrop-blur-md ${
              isDark
                ? 'bg-white/10 border-white/20'
                : 'bg-slate-200 border-slate-300'
            }`}
          >
            <button
              onClick={() => setThemeMode('light')}
              className={`p-1.5 rounded-full transition-all ${
                themeMode === 'light'
                  ? 'bg-orange-500 text-white shadow-md'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title='Light Mode'
            >
              <Sun size={14} />
            </button>
            <button
              onClick={() => setThemeMode('system')}
              className={`p-1.5 rounded-full transition-all ${
                themeMode === 'system'
                  ? 'bg-slate-700 text-white shadow-md'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title='System Mode'
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`p-1.5 rounded-full transition-all ${
                themeMode === 'dark'
                  ? 'bg-slate-800 text-white shadow-md border border-slate-600'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title='Dark Mode'
            >
              <Moon size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className='max-w-3xl mx-auto px-4 py-10 pb-16'>
        {children}
      </div>

      {/* FOOTER */}
      <footer
        className={`border-t py-6 px-4 ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}
      >
        <div
          className={`max-w-3xl mx-auto flex flex-wrap justify-center gap-4 text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          <Link href='/about' className='hover:text-orange-400 transition-colors'>
            {t('about')}
          </Link>
          <Link href='/terms' className='hover:text-orange-400 transition-colors'>
            {t('terms')}
          </Link>
          <Link href='/privacy' className='hover:text-orange-400 transition-colors'>
            {t('privacy')}
          </Link>
        </div>
        <p
          className={`text-center text-xs mt-3 ${
            isDark ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          {t('rights', { year: new Date().getFullYear() })}
        </p>
      </footer>
    </div>
  )
}
