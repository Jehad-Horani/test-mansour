"use client"

import { useState } from "react"
import Link from "next/link"
import { RetroWindow } from "@/components/retro-window"

interface Announcement {
  id: string
  title: string
  content: string
  type: "news" | "update" | "maintenance" | "event" | "urgent"
  priority: "low" | "medium" | "high" | "urgent"
  status: "draft" | "published" | "scheduled" | "archived"
  targetAudience: {
    majors: ("law" | "it" | "medical" | "business" | "all")[]
    tiers: ("free" | "standard" | "premium" | "all")[]
    universities: string[]
  }
  author: string
  createdDate: string
  publishDate: string
  expiryDate?: string
  views: number
  engagement: {
    likes: number
    shares: number
    comments: number
  }
  attachments?: string[]
}

export default function AnnouncementManagementPage() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "news" | "update" | "maintenance" | "event" | "urgent">(
    "all",
  )
  const [selectedStatus, setSelectedStatus] = useState<"all" | "draft" | "published" | "scheduled" | "archived">("all")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<string | null>(null)

  // Mock announcement data
  const mockAnnouncements: Announcement[] = [
    {
      id: "ann-1",
      title: "تحديث جديد على منصة تخصص",
      content:
        "نحن سعداء لإعلان إطلاق التحديث الجديد للمنصة والذي يتضمن ميزات جديدة لتحسين تجربة المستخدم وإضافة أدوات جديدة للدراسة.",
      type: "update",
      priority: "high",
      status: "published",
      targetAudience: {
        majors: ["all"],
        tiers: ["all"],
        universities: [],
      },
      author: "مدير النظام",
      createdDate: "2024-01-10T09:00:00Z",
      publishDate: "2024-01-10T12:00:00Z",
      views: 1247,
      engagement: {
        likes: 89,
        shares: 23,
        comments: 15,
      },
    },
    {
      id: "ann-2",
      title: "صيانة مجدولة للخادم",
      content: "سيتم إجراء صيانة مجدولة للخادم يوم الجمعة من الساعة 2:00 ص إلى 6:00 ص. قد تواجه انقطاع في الخدمة.",
      type: "maintenance",
      priority: "urgent",
      status: "scheduled",
      targetAudience: {
        majors: ["all"],
        tiers: ["all"],
        universities: [],
      },
      author: "مدير النظام",
      createdDate: "2024-01-12T14:00:00Z",
      publishDate: "2024-01-18T20:00:00Z",
      expiryDate: "2024-01-19T08:00:00Z",
      views: 0,
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0,
      },
    },
    {
      id: "ann-3",
      title: "ورشة عمل للطلاب الجدد",
      content:
        "ندعوكم لحضور ورشة عمل تعريفية للطلاب الجدد حول كيفية استخدام المنصة والاستفادة من جميع الميزات المتاحة.",
      type: "event",
      priority: "medium",
      status: "published",
      targetAudience: {
        majors: ["all"],
        tiers: ["free"],
        universities: ["جامعة الملك سعود", "جامعة الملك فهد للبترول والمعادن"],
      },
      author: "مدير النظام",
      createdDate: "2024-01-08T11:00:00Z",
      publishDate: "2024-01-08T15:00:00Z",
      expiryDate: "2024-01-25T23:59:00Z",
      views: 456,
      engagement: {
        likes: 34,
        shares: 12,
        comments: 8,
      },
    },
    {
      id: "ann-4",
      title: "إضافة ميزة السوق الأكاديمي",
      content: "تم إضافة ميزة جديدة تتيح للطلاب بيع وشراء الكتب الأكاديمية المستعملة بسهولة وأمان.",
      type: "news",
      priority: "medium",
      status: "draft",
      targetAudience: {
        majors: ["all"],
        tiers: ["standard", "premium"],
        universities: [],
      },
      author: "مدير النظام",
      createdDate: "2024-01-15T10:00:00Z",
      publishDate: "2024-01-16T09:00:00Z",
      views: 0,
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0,
      },
    },
  ]

  const filteredAnnouncements = mockAnnouncements.filter((announcement) => {
    const typeMatch = selectedFilter === "all" || announcement.type === selectedFilter
    const statusMatch = selectedStatus === "all" || announcement.status === selectedStatus
    return typeMatch && statusMatch
  })

  const getTypeLabel = (type: string) => {
    const labels = {
      news: "أخبار",
      update: "تحديث",
      maintenance: "صيانة",
      event: "فعالية",
      urgent: "عاجل",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      archived: "bg-yellow-100 text-yellow-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleDeleteAnnouncement = (announcementId: string) => {
    console.log(`[v0] Deleting announcement: ${announcementId}`)
    // Here you would implement the delete functionality
  }

  const handlePublishAnnouncement = (announcementId: string) => {
    console.log(`[v0] Publishing announcement: ${announcementId}`)
    // Here you would implement the publish functionality
  }

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <RetroWindow title="إدارة الإعلانات">
          <div className="p-6">
            {/* Header Actions */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-black">الإعلانات والأخبار</h2>
                <span className="text-sm text-gray-600">({filteredAnnouncements.length} إعلان)</span>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="retro-button bg-green-500 text-white px-4 py-2 hover:bg-green-600"
              >
                إنشاء إعلان جديد
              </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black">نوع الإعلان:</label>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="px-3 py-1 border border-gray-400 bg-white text-black text-sm"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="news">أخبار</option>
                  <option value="update">تحديث</option>
                  <option value="maintenance">صيانة</option>
                  <option value="event">فعالية</option>
                  <option value="urgent">عاجل</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black">الحالة:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="px-3 py-1 border border-gray-400 bg-white text-black text-sm"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                  <option value="scheduled">مجدول</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </div>
            </div>

            {/* Create/Edit Form */}
            {(showCreateForm || editingAnnouncement) && (
              <div className="mb-6 p-4 border border-gray-400 bg-gray-50">
                <h3 className="font-semibold text-black mb-4">
                  {editingAnnouncement ? "تعديل الإعلان" : "إنشاء إعلان جديد"}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">عنوان الإعلان</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                        placeholder="اكتب عنوان الإعلان..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">نوع الإعلان</label>
                      <select className="w-full px-3 py-2 border border-gray-400 bg-white text-black">
                        <option value="news">أخبار</option>
                        <option value="update">تحديث</option>
                        <option value="maintenance">صيانة</option>
                        <option value="event">فعالية</option>
                        <option value="urgent">عاجل</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">محتوى الإعلان</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                      rows={4}
                      placeholder="اكتب محتوى الإعلان..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">الأولوية</label>
                      <select className="w-full px-3 py-2 border border-gray-400 bg-white text-black">
                        <option value="low">منخفضة</option>
                        <option value="medium">متوسطة</option>
                        <option value="high">عالية</option>
                        <option value="urgent">عاجلة</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">تاريخ النشر</label>
                      <input
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">تاريخ الانتهاء (اختياري)</label>
                      <input
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">الجمهور المستهدف</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">التخصصات</label>
                        <div className="space-y-1">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" defaultChecked />
                            جميع التخصصات
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" />
                            القانون
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" />
                            تقنية المعلومات
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" />
                            الطب
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" />
                            إدارة الأعمال
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">نوع الاشتراك</label>
                        <div className="space-y-1">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" defaultChecked />
                            جميع الاشتراكات
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" />
                            مجاني
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" />
                            قياسي
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" />
                            مميز
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">الجامعات المحددة</label>
                        <textarea
                          className="w-full px-2 py-1 border border-gray-400 bg-white text-black text-sm"
                          rows={3}
                          placeholder="اتركه فارغاً لجميع الجامعات أو اكتب أسماء الجامعات..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="retro-button bg-green-500 text-white px-4 py-2 hover:bg-green-600">
                      {editingAnnouncement ? "حفظ التعديلات" : "إنشاء الإعلان"}
                    </button>
                    <button className="retro-button bg-blue-500 text-white px-4 py-2 hover:bg-blue-600">
                      حفظ كمسودة
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateForm(false)
                        setEditingAnnouncement(null)
                      }}
                      className="retro-button bg-gray-500 text-white px-4 py-2 hover:bg-gray-600"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <div key={announcement.id} className="border border-gray-400 bg-white">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-black">{announcement.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority === "low"
                              ? "منخفضة"
                              : announcement.priority === "medium"
                                ? "متوسطة"
                                : announcement.priority === "high"
                                  ? "عالية"
                                  : "عاجلة"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(announcement.status)}`}>
                          {announcement.status === "draft"
                            ? "مسودة"
                            : announcement.status === "published"
                              ? "منشور"
                              : announcement.status === "scheduled"
                                ? "مجدول"
                                : "مؤرشف"}
                        </span>
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                          {getTypeLabel(announcement.type)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <strong>المؤلف:</strong> {announcement.author}
                      </div>
                      <div>
                        <strong>تاريخ الإنشاء:</strong> {new Date(announcement.createdDate).toLocaleDateString("ar-SA")}
                      </div>
                      <div>
                        <strong>تاريخ النشر:</strong> {new Date(announcement.publishDate).toLocaleDateString("ar-SA")}
                      </div>
                      <div>
                        <strong>المشاهدات:</strong> {announcement.views}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>👍 {announcement.engagement.likes}</span>
                      <span>📤 {announcement.engagement.shares}</span>
                      <span>💬 {announcement.engagement.comments}</span>
                      {announcement.expiryDate && (
                        <span>⏰ ينتهي: {new Date(announcement.expiryDate).toLocaleDateString("ar-SA")}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingAnnouncement(announcement.id)}
                        className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600"
                      >
                        تعديل
                      </button>

                      {announcement.status === "draft" && (
                        <button
                          onClick={() => handlePublishAnnouncement(announcement.id)}
                          className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600"
                        >
                          نشر
                        </button>
                      )}

                      <Link
                        href={`/admin/announcements/${announcement.id}/analytics`}
                        className="retro-button bg-purple-500 text-white px-3 py-1 text-sm hover:bg-purple-600"
                      >
                        الإحصائيات
                      </Link>

                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="retro-button bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600"
                      >
                        حذف
                      </button>

                      <button className="retro-button bg-gray-500 text-white px-3 py-1 text-sm hover:bg-gray-600">
                        أرشفة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-8 text-gray-600">لا توجد إعلانات تطابق المعايير المحددة</div>
            )}
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
