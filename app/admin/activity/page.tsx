"use client"

import { useState } from "react"
import { RetroWindow } from "@/components/retro-window"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Activity, Filter, Download } from "lucide-react"

export default function AdminActivityPage() {
  const [filterType, setFilterType] = useState("all")
  const [dateRange, setDateRange] = useState("today")

  const activities = [
    {
      id: 1,
      type: "user_login",
      user: "أحمد محمد",
      action: "تسجيل دخول",
      timestamp: "2024-01-15 10:30:00",
      ip: "192.168.1.100",
      details: "تسجيل دخول ناجح من الأردن",
    },
    {
      id: 2,
      type: "content_create",
      user: "فاطمة أحمد",
      action: "إنشاء محتوى",
      timestamp: "2024-01-15 09:15:00",
      ip: "192.168.1.101",
      details: "إضافة سؤال جديد في مجتمع القانون",
    },
    {
      id: 3,
      type: "admin_action",
      user: "مدير النظام",
      action: "حذف محتوى",
      timestamp: "2024-01-15 08:45:00",
      ip: "192.168.1.1",
      details: "حذف تعليق مخالف للقوانين",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_login":
        return "🔐"
      case "content_create":
        return "📝"
      case "admin_action":
        return "⚡"
      default:
        return "📊"
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "user_login":
        return "var(--accent)"
      case "content_create":
        return "var(--primary)"
      case "admin_action":
        return "#dc2626"
      default:
        return "var(--ink)"
    }
  }

  return (
    <div className="p-6">
      <RetroWindow title="نشاط النظام" className="w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6" style={{ color: "var(--primary)" }} />
              <h1 className="text-xl font-bold" style={{ color: "var(--ink)" }}>
                سجل نشاط النظام
              </h1>
            </div>
            <Button className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
              <Download className="w-4 h-4 ml-2" />
              تصدير التقرير
            </Button>
          </div>

          {/* Filters */}
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4"
            style={{ background: "var(--panel)", border: "2px inset var(--border)" }}
          >
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                نوع النشاط
              </label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="retro-input w-full">
                <option value="all">جميع الأنشطة</option>
                <option value="user_login">تسجيل الدخول</option>
                <option value="content_create">إنشاء المحتوى</option>
                <option value="admin_action">إجراءات الإدارة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                الفترة الزمنية
              </label>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="retro-input w-full">
                <option value="today">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="custom">فترة مخصصة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                البحث بالمستخدم
              </label>
              <Input placeholder="اسم المستخدم..." className="retro-input" />
            </div>

            <div className="flex items-end">
              <Button className="retro-button w-full" style={{ background: "var(--accent)", color: "white" }}>
                <Filter className="w-4 h-4 ml-2" />
                تطبيق الفلتر
              </Button>
            </div>
          </div>

          {/* Activity List */}
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 border-2"
                style={{
                  background: "var(--bg)",
                  border: "2px outset var(--border)",
                  borderRadius: "0",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center text-lg"
                      style={{ background: getActivityColor(activity.type), color: "white" }}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold" style={{ color: "var(--ink)" }}>
                          {activity.user}
                        </span>
                        <span style={{ color: "var(--ink)", opacity: 0.7 }}>{activity.action}</span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: "var(--ink)", opacity: 0.8 }}>
                        {activity.details}
                      </p>
                      <div className="flex items-center gap-4 text-xs" style={{ color: "var(--ink)", opacity: 0.6 }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {activity.timestamp}
                        </span>
                        <span>IP: {activity.ip}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="retro-button"
                    style={{ background: "var(--panel)", color: "var(--ink)" }}
                  >
                    التفاصيل
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: "2px inset var(--border)" }}>
            <span className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
              عرض 1-10 من 156 نشاط
            </span>
            <div className="flex gap-2">
              <Button className="retro-button" style={{ background: "var(--panel)", color: "var(--ink)" }}>
                السابق
              </Button>
              <Button className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                1
              </Button>
              <Button className="retro-button" style={{ background: "var(--panel)", color: "var(--ink)" }}>
                2
              </Button>
              <Button className="retro-button" style={{ background: "var(--panel)", color: "var(--ink)" }}>
                التالي
              </Button>
            </div>
          </div>
        </div>
      </RetroWindow>
    </div>
  )
}
