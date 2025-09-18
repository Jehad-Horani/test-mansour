"use client"

import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Zap,
  Shield,
  Users,
} from "lucide-react"
import Link from "next/link"

export default function SupportPage() {
  const supportChannels = [
    {
      title: "الدعم المباشر",
      description: "تحدث مع فريق الدعم مباشرة",
      icon: <MessageCircle className="w-8 h-8" />,
      availability: "متاح الآن",
      status: "online",
      action: "بدء محادثة",
      href: "/dashboard/tickets/new",
    },
    {
      title: "الدعم الهاتفي",
      description: "اتصل بنا للحصول على مساعدة فورية",
      icon: <Phone className="w-8 h-8" />,
      availability: "9:00 ص - 6:00 م",
      status: "available",
      action: "اتصل الآن",
      href: "tel:+96261234567",
    },
    {
      title: "البريد الإلكتروني",
      description: "أرسل استفسارك وسنرد خلال 24 ساعة",
      icon: <Mail className="w-8 h-8" />,
      availability: "24/7",
      status: "always",
      action: "إرسال بريد",
      href: "mailto:support@takhassus.com",
    },
  ]

  const supportCategories = [
    {
      title: "المشاكل التقنية",
      description: "مشاكل في الموقع، تحميل الملفات، أو الأداء",
      icon: <Zap className="w-6 h-6" />,
      priority: "عالية",
      responseTime: "خلال ساعة",
    },
    {
      title: "مشاكل الحساب",
      description: "تسجيل الدخول، كلمة المرور، أو إعدادات الحساب",
      icon: <Shield className="w-6 h-6" />,
      priority: "متوسطة",
      responseTime: "خلال 4 ساعات",
    },
    {
      title: "الاستفسارات العامة",
      description: "أسئلة حول الخدمات أو كيفية الاستخدام",
      icon: <HelpCircle className="w-6 h-6" />,
      priority: "عادية",
      responseTime: "خلال 24 ساعة",
    },
    {
      title: "طلبات الميزات",
      description: "اقتراحات لتحسين المنصة أو إضافة ميزات جديدة",
      icon: <Users className="w-6 h-6" />,
      priority: "منخفضة",
      responseTime: "خلال 48 ساعة",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "available":
        return "bg-blue-500"
      case "always":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عالية":
        return "bg-red-100 text-red-800"
      case "متوسطة":
        return "bg-yellow-100 text-yellow-800"
      case "عادية":
        return "bg-blue-100 text-blue-800"
      case "منخفضة":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <RetroWindow title="الدعم الفني">
          <div className="p-6 text-center">
            <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              نحن هنا لمساعدتك
            </h1>
            <p className="text-gray-600 mb-6">فريق الدعم الفني متاح لحل جميع مشاكلك والإجابة على استفساراتك</p>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-medium">متاح 24/7</span>
            </div>
          </div>
        </RetroWindow>

        {/* Support Channels */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {supportChannels.map((channel, index) => (
            <RetroWindow key={index} className="hover:shadow-lg transition-shadow">
              <div className="p-6 text-center">
                <div className="relative mb-4">
                  <div className="p-4 rounded-lg mx-auto w-fit" style={{ background: "var(--accent)", color: "white" }}>
                    {channel.icon}
                  </div>
                  <div
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(channel.status)}`}
                  ></div>
                </div>

                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                  {channel.title}
                </h3>
                <p className="text-gray-600 mb-4">{channel.description}</p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{channel.availability}</span>
                </div>

                <Button
                  asChild
                  className="w-full retro-button"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  <Link href={channel.href}>{channel.action}</Link>
                </Button>
              </div>
            </RetroWindow>
          ))}
        </div>

        {/* Support Categories */}
        <RetroWindow title="أنواع الدعم المتاحة" className="mt-8">
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {supportCategories.map((category, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded" style={{ background: "var(--primary)", color: "white" }}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold" style={{ color: "var(--ink)" }}>
                          {category.title}
                        </h3>
                        <Badge className={getPriorityColor(category.priority)}>{category.priority}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>وقت الاستجابة: {category.responseTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RetroWindow>

        {/* Emergency Support */}
        <RetroWindow title="الدعم الطارئ" className="mt-8">
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">حالات الطوارئ</h3>
                  <p className="text-red-700 text-sm mb-4">
                    في حالة وجود مشكلة طارئة تؤثر على استخدامك للمنصة، يمكنك التواصل معنا فوراً
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                      <Link href="tel:+96261234567">
                        <Phone className="w-4 h-4 ml-2" />
                        اتصال طارئ
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="retro-button bg-transparent">
                      <Link href="/dashboard/tickets/new">
                        <MessageCircle className="w-4 h-4 ml-2" />
                        تذكرة عاجلة
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RetroWindow>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <RetroWindow title="موارد مفيدة">
            <div className="p-6 space-y-3">
              <Button asChild variant="outline" className="w-full retro-button bg-transparent justify-start">
                <Link href="/help">
                  <HelpCircle className="w-4 h-4 ml-2" />
                  الأسئلة الشائعة
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full retro-button bg-transparent justify-start">
                <Link href="/guide">
                  <Users className="w-4 h-4 ml-2" />
                  دليل المستخدم
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full retro-button bg-transparent justify-start">
                <Link href="/community">
                  <MessageCircle className="w-4 h-4 ml-2" />
                  مجتمع المساعدة
                </Link>
              </Button>
            </div>
          </RetroWindow>

          <RetroWindow title="حالة الخدمة">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded border">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">الموقع الرئيسي</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">يعمل بشكل طبيعي</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded border">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">قاعدة البيانات</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">يعمل بشكل طبيعي</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded border">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">نظام الدفع</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">يعمل بشكل طبيعي</Badge>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">آخر تحديث: منذ 5 دقائق</p>
              </div>
            </div>
          </RetroWindow>
        </div>
      </div>
    </div>
  )
}
