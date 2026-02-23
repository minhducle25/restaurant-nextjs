import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {/* Animated Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center text-white font-extrabold text-2xl shadow-[0_0_30px_rgba(249,115,22,0.5)] animate-pulse">
            M
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>

        {/* Loading Text */}
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  )
}
