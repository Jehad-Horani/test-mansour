"use client"

import { useState } from "react"
import { RetroWindow } from "@/components/retro-window"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, MessageCircle, Share, TrendingUp, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AnnouncementAnalyticsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("7d")

  const announcement = {
    id: params.id,
    title: "إعلان مهم: تحديث نظام التسجيل",
    content: "يرجى العلم أنه سيتم تحديث نظام التسجيل يوم الجمعة القادم...",
    publishDate: "2024-01-10",
    status: "published",
  }

  const analytics = {
    views: 1250,
    interactions: 89,
    shares: 23,
    comments: 15,
    clickThrough: 7.2,
    engagement: 12.5,
  }

  const viewsData = [
    { date: "2024-01-10", views: 120 },
    { date: "2024-01-11", views: 180 },
    { date: "2024-01-12", views: 220 },
    { date: "2024-01-13", views: 190 },
    { date: "2024-01-14", views: 240 },
    { date: "2024-01-15", views: 200 },
    { date: "2024-01-16", views: 100 },
  ]

  return (
    <div className="p-6">
      <RetroWindow title={`تحليلات الإعلان #${params.id}`} className="w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.back()}
                className="retro-button"
                style={{ background: "var(--panel)", color: "var(--ink)" }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "var(--ink)" }}>
                  تحليلات الإعلان
                </h1>
                <p className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                  {announcement.title}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="retro-input">
                <option value="7d">آخر 7 أيام</option>
                <option value="30d">آخر 30 يوم</option>
                <option value="90d">آخر 3 أشهر</option>
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <Eye className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--primary)" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {analytics.views.toLocaleString()}
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                المشاهدات
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <MessageCircle className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--accent)" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {analytics.interactions}
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                التفاعلات
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <Share className="w-6 h-6 mx-auto mb-2" style={{ color: "#10b981" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {analytics.shares}
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                المشاركات
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <Users className="w-6 h-6 mx-auto mb-2" style={{ color: "#f59e0b" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {analytics.comments}
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                التعليقات
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <TrendingUp className="w-6 h-6 mx-auto mb-2" style={{ color: "#8b5cf6" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {analytics.clickThrough}%
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                معدل النقر
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <TrendingUp className="w-6 h-6 mx-auto mb-2" style={{ color: "#ef4444" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {analytics.engagement}%
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                معدل التفاعل
              </div>
            </div>
          </div>

          {/* Views Chart */}
          <div className="mb-6 p-4" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
              المشاهدات اليومية
            </h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {viewsData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full min-h-[20px] mb-2"
                    style={{
                      height: `${(day.views / Math.max(...viewsData.map((d) => d.views))) * 200}px`,
                      background: "var(--primary)",
                    }}
                  />
                  <div className="text-xs text-center" style={{ color: "var(--ink)", opacity: 0.7 }}>
                    {day.date.split("-")[2]}
                  </div>
                  <div className="text-xs font-semibold" style={{ color: "var(--ink)" }}>
                    {day.views}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcement Details */}
          <div className="p-4" style={{ background: "var(--bg)", border: "2px inset var(--border)" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
              تفاصيل الإعلان
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>
                  العنوان
                </label>
                <p className="text-sm p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                  {announcement.title}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>
                  تاريخ النشر
                </label>
                <p className="text-sm p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                  {announcement.publishDate}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>
                  المحتوى
                </label>
                <p className="text-sm p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                  {announcement.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </RetroWindow>
    </div>
  )
}
