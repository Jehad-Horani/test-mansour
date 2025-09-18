"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs() {
  const pathname = usePathname()

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: "الرئيسية", href: "/" }]

    const pathMap: Record<string, string> = {
      dashboard: "لوحة التحكم",
      admin: "لوحة الإدارة",
      market: "السوق",
      ambassadors: "السفراء",
      community: "المجتمع",
      pricing: "الأسعار",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      auth: "المصادقة",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      cart: "السلة",
      checkout: "الدفع",
      messages: "الرسائل",
      notifications: "الإشعارات",
      help: "المساعدة",
      contact: "اتصل بنا",
      support: "الدعم",
      guide: "الدليل",
      sessions: "الجلسات الدراسية",
      schedule: "الجدول الدراسي",
      exams: "الامتحانات",
      notebooks: "الملاحظات",
      users: "المستخدمون",
      content: "المحتوى",
      reports: "التقارير",
      analytics: "الإحصائيات",
      announcements: "الإعلانات",
      book: "حجز",
      chat: "محادثة",
      sell: "بيع",
      ask: "اسأل سؤال",
      edit: "تعديل",
      new: "جديد",
      payment: "الدفع",
      review: "مراجعة",
      success: "نجح",
      error: "خطأ",
      "forgot-password": "نسيت كلمة المرور",
      standard: "الباقة المعيارية",
      onboarding: "الجولة التعريفية",
      welcome: "مرحباً",
      privacy: "سياسة الخصوصية",
      terms: "شروط الاستخدام",
    }

    let currentPath = ""
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const label = pathMap[segment] || segment

      // Don't add href for the last segment (current page)
      const href = index === segments.length - 1 ? undefined : currentPath
      breadcrumbs.push({ label, href })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  // Don't show breadcrumbs on homepage
  if (pathname === "/") return null

  return (
    <nav className="flex items-center gap-2 text-sm mb-4 p-3 retro-window bg-white">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronLeft className="w-3 h-3 text-gray-400" />}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:underline transition-colors" style={{ color: "var(--primary)" }}>
              {index === 0 && <Home className="w-3 h-3 inline ml-1" />}
              {crumb.label}
            </Link>
          ) : (
            <span style={{ color: "var(--ink)" }} className="font-medium">
              {crumb.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
