"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"

export function AuthDebug() {
  const { user, profile, loading, error, signOut } = useAuth()

  if (loading) {
    return (
      <div className="p-4 border rounded">
        <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
        <div className="text-center text-sm">جاري التحقق من المصادقة...</div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>حالة المصادقة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            خطأ: {error}
          </div>
        )}
        
        {user ? (
          <div>
            <p className="text-green-600 mb-2">✓ مسجل دخول: {user.email}</p>
            {profile && (
              <div className="text-sm text-gray-600 mb-2">
                <p>الاسم: {profile.name}</p>
                <p>الدور: {profile.role}</p>
                <p>الاشتراك: {profile.subscription_tier}</p>
              </div>
            )}
            <Button onClick={signOut} variant="outline" className="w-full bg-transparent">
              تسجيل خروج
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-red-600">✗ غير مسجل دخول</p>
            <p className="text-sm text-gray-600">
              يرجى استخدام صفحة <a href="/auth/login" className="text-blue-600 hover:underline">تسجيل الدخول</a> للدخول إلى النظام
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
