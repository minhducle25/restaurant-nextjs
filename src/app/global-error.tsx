'use client'

import { useEffect } from 'react'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 via-white to-orange-50 px-4">
          <div className="max-w-xl w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white">
                <AlertCircle size={40} />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Critical Error
              </h1>
              <p className="text-gray-600">
                A critical error occurred. Please refresh the page.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={reset}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Refresh Page
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => (window.location.href = '/')}
              >
                <Home size={18} className="mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
