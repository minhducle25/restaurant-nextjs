'use client'

import { useEffect } from 'react'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('Error')

  useEffect(() => {
    // Log error to error reporting service (Sentry, LogRocket, etc.)
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-black dark:to-gray-900 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-red-600 to-orange-400 rounded-2xl flex items-center justify-center text-white shadow-[0_0_40px_rgba(239,68,68,0.5)]">
            <AlertTriangle size={48} />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
            {t('title', { default: 'Oops! Something went wrong' })}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {t('description', { 
              default: 'An unexpected error occurred. Please try again or return to the home page.' 
            })}
          </p>

          {/* Error details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
              <summary className="cursor-pointer font-semibold text-sm text-gray-700 dark:text-gray-300">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={reset}
            className="gap-2 bg-orange-500 hover:bg-orange-600"
          >
            <RefreshCw size={20} />
            {t('tryAgain', { default: 'Try Again' })}
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline" className="gap-2">
              <Home size={20} />
              {t('backHome', { default: 'Back to Home' })}
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 dark:text-gray-500">
          {t('persistentError', { 
            default: 'If the problem persists, please contact support.' 
          })}
        </p>
      </div>
    </div>
  )
}
