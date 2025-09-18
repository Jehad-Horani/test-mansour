"use client"

import { useState } from "react"
import { RetroWindow } from "@/components/retro-window"

interface ContentItem {
  id: string
  type: "file" | "question" | "post" | "book"
  title: string
  description: string
  author: string
  authorId: string
  major: "law" | "it" | "medical" | "business"
  university: string
  uploadDate: string
  status: "pending" | "approved" | "rejected"
  fileSize?: string
  fileType?: string
  tags: string[]
  reportCount: number
  viewCount: number
}

export default function ContentModerationPage() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "file" | "question" | "post" | "book">("all")
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "approved" | "rejected" | "all">("pending")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showDetails, setShowDetails] = useState<string | null>(null)

  // Mock content data
  const mockContent: ContentItem[] = [
    {
      id: "content-1",
      type: "file",
      title: "محاضرة القانون المدني - الفصل الثالث",
      description: "ملف PDF يحتوي على شرح مفصل للقانون المدني",
      author: "أحمد محمد السالم",
      authorId: "user-law-1",
      major: "law",
      university: "جامعة الملك سعود",
      uploadDate: "2024-01-15T10:30:00Z",
      status: "pending",
      fileSize: "2.5 MB",
      fileType: "PDF",
      tags: ["قانون مدني", "محاضرات", "الفصل الثالث"],
      reportCount: 0,
      viewCount: 45,
    },
    {
      id: "content-2",
      type: "question",
      title: "سؤال حول البرمجة الكائنية في Java",
      description: "ما هو الفرق بين الوراثة والتغليف في البرمجة الكائنية؟",
      author: "فاطمة عبدالله النمر",
      authorId: "user-it-1",
      major: "it",
      university: "جامعة الملك فهد للبترول والمعادن",
      uploadDate: "2024-01-15T09:15:00Z",
      status: "pending",
      tags: ["جافا", "برمجة كائنية", "وراثة"],
      reportCount: 0,
      viewCount: 23,
    },
    {
      id: "content-3",
      type: "book",
      title: "كتاب أساسيات التشريح البشري",
      description: "كتاب مستعمل في حالة ممتازة للبيع",
      author: "نورا الشهري",
      authorId: "user-med-1",
      major: "medical",
      university: "جامعة الملك سعود",
      uploadDate: "2024-01-14T16:45:00Z",
      status: "pending",
      tags: ["تشريح", "طب", "كتب مستعملة"],
      reportCount: 1,
      viewCount: 67,
    },
    {
      id: "content-4",
      type: "post",
      title: "نصائح للنجاح في امتحان المحاسبة",
      description: "مجموعة من النصائح المفيدة لطلاب إدارة الأعمال",
      author: "خالد الأحمد",
      authorId: "user-bus-1",
      major: "business",
      university: "جامعة الملك عبدالعزيز",
      uploadDate: "2024-01-14T14:20:00Z",
      status: "approved",
      tags: ["محاسبة", "نصائح", "امتحانات"],
      reportCount: 0,
      viewCount: 89,
    },
  ]

  const filteredContent = mockContent.filter((item) => {
    const typeMatch = selectedFilter === "all" || item.type === selectedFilter
    const statusMatch = selectedStatus === "all" || item.status === selectedStatus
    return typeMatch && statusMatch
  })

  const handleApprove = (contentId: string) => {
    console.log(`[v0] Approving content: ${contentId}`)
    // Here you would update the content status to approved
  }

  const handleReject = (contentId: string, reason: string) => {
    console.log(`[v0] Rejecting content: ${contentId}, reason: ${reason}`)
    // Here you would update the content status to rejected with reason
  }

  const handleBulkAction = (action: "approve" | "reject") => {
    console.log(`[v0] Bulk ${action} for items:`, selectedItems)
    setSelectedItems([])
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      file: "ملف",
      question: "سؤال",
      post: "منشور",
      book: "كتاب",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getMajorLabel = (major: string) => {
    const labels = {
      law: "القانون",
      it: "تقنية المعلومات",
      medical: "الطب",
      business: "إدارة الأعمال",
    }
    return labels[major as keyof typeof labels] || major
  }

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <RetroWindow title="إدارة المحتوى">
          <div className="p-6">
            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black">نوع المحتوى:</label>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="px-3 py-1 border border-gray-400 bg-white text-black text-sm"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="file">ملفات</option>
                  <option value="question">أسئلة</option>
                  <option value="post">منشورات</option>
                  <option value="book">كتب</option>
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
                  <option value="pending">في الانتظار</option>
                  <option value="approved">مقبول</option>
                  <option value="rejected">مرفوض</option>
                </select>
              </div>

              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-black">({selectedItems.length} محدد)</span>
                  <button
                    onClick={() => handleBulkAction("approve")}
                    className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600"
                  >
                    قبول الكل
                  </button>
                  <button
                    onClick={() => handleBulkAction("reject")}
                    className="retro-button bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600"
                  >
                    رفض الكل
                  </button>
                </div>
              )}
            </div>

            {/* Content List */}
            <div className="space-y-4">
              {filteredContent.map((item) => (
                <div key={item.id} className="border border-gray-400 bg-white">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="mt-1"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-black">{item.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(item.status)}`}>
                              {item.status === "pending"
                                ? "في الانتظار"
                                : item.status === "approved"
                                  ? "مقبول"
                                  : "مرفوض"}
                            </span>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {getTypeLabel(item.type)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span>بواسطة: {item.author}</span>
                          <span>{getMajorLabel(item.major)}</span>
                          <span>{item.university}</span>
                          <span>{new Date(item.uploadDate).toLocaleDateString("ar-SA")}</span>
                          {item.fileSize && <span>الحجم: {item.fileSize}</span>}
                          <span>المشاهدات: {item.viewCount}</span>
                          {item.reportCount > 0 && <span className="text-red-600">تقارير: {item.reportCount}</span>}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          {item.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs border">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowDetails(showDetails === item.id ? null : item.id)}
                            className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600"
                          >
                            {showDetails === item.id ? "إخفاء التفاصيل" : "عرض التفاصيل"}
                          </button>

                          {item.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600"
                              >
                                قبول
                              </button>
                              <button
                                onClick={() => handleReject(item.id, "مخالف للقوانين")}
                                className="retro-button bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600"
                              >
                                رفض
                              </button>
                            </>
                          )}

                          <button className="retro-button bg-gray-500 text-white px-3 py-1 text-sm hover:bg-gray-600">
                            إرسال رسالة للمؤلف
                          </button>
                        </div>

                        {/* Detailed View */}
                        {showDetails === item.id && (
                          <div className="mt-4 p-4 bg-gray-50 border border-gray-300">
                            <h4 className="font-semibold text-black mb-2">تفاصيل المحتوى</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>معرف المحتوى:</strong> {item.id}
                              </div>
                              <div>
                                <strong>معرف المؤلف:</strong> {item.authorId}
                              </div>
                              <div>
                                <strong>تاريخ الرفع:</strong> {new Date(item.uploadDate).toLocaleString("ar-SA")}
                              </div>
                              {item.fileType && (
                                <div>
                                  <strong>نوع الملف:</strong> {item.fileType}
                                </div>
                              )}
                              <div>
                                <strong>عدد المشاهدات:</strong> {item.viewCount}
                              </div>
                              <div>
                                <strong>عدد التقارير:</strong> {item.reportCount}
                              </div>
                            </div>

                            {item.status === "pending" && (
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-black mb-1">
                                  سبب الرفض (اختياري):
                                </label>
                                <textarea
                                  className="w-full px-3 py-2 border border-gray-400 bg-white text-black text-sm"
                                  rows={3}
                                  placeholder="اكتب سبب الرفض هنا..."
                                />
                                <div className="flex gap-2 mt-2">
                                  <button className="retro-button bg-red-500 text-white px-4 py-2 text-sm hover:bg-red-600">
                                    رفض مع السبب
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredContent.length === 0 && (
              <div className="text-center py-8 text-gray-600">لا يوجد محتوى يطابق المعايير المحددة</div>
            )}
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
