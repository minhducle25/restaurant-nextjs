import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-black dark:to-gray-900 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-linear-to-tr from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center text-white font-extrabold text-4xl shadow-[0_0_40px_rgba(249,115,22,0.5)] animate-pulse">
            M
          </div>
        </div>

        {/* 404 Text */}
        <div className="space-y-4">
          <h1 className="text-9xl font-black text-orange-500 dark:text-orange-400 animate-bounce">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {t('title', { default: 'Page Not Found' })}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {t('description', { 
              default: 'The page you are looking for does not exist or has been moved.' 
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button size="lg" className="gap-2 bg-orange-500 hover:bg-orange-600">
              <Home size={20} />
              {t('backHome', { default: 'Back to Home' })}
            </Button>
          </Link>
          <Link href="/dishes">
            <Button size="lg" variant="outline" className="gap-2">
              <Search size={20} />
              {t('viewMenu', { default: 'View Menu' })}
            </Button>
          </Link>
        </div>

        {/* Popular Links */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            {t('popularPages', { default: 'Popular Pages:' })}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 underline">
              {t('home', { default: 'Home' })}
            </Link>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <Link href="/about" className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 underline">
              {t('about', { default: 'About' })}
            </Link>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <Link href="/terms" className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 underline">
              {t('terms', { default: 'Terms' })}
            </Link>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <Link href="/privacy" className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 underline">
              {t('privacy', { default: 'Privacy' })}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
