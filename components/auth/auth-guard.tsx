"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserContext } from '@/contexts/user-context'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/login',
  fallback 
}: AuthGuardProps) {
  const { user, loading, isLoggedIn, error } = useUserContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && requireAuth && !isLoggedIn) {
      console.log('[AUTH GUARD] Redirecting unauthenticated user to:', redirectTo)
      router.push(redirectTo)
    }
  }, [loading, isLoggedIn, requireAuth, redirectTo, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>جاري التحقق من الهوية...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">خطأ في المصادقة</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  // Show fallback if not authenticated and required
  if (requireAuth && !isLoggedIn) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>جاري التوجيه لصفحة تسجيل الدخول...</p>
        </div>
      </div>
    )
  }

  // Render children if authenticated or auth not required
  return <>{children}</>
}