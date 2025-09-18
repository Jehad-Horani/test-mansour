"use client"

import { useState } from "react"
import Link from "next/link"
import { RetroWindow } from "@/app/components/retro-window"

interface Message {
  id: string
  subject: string
  content: string
  type: "individual" | "bulk" | "announcement" | "support" | "automated"
  recipients: {
    type: "user" | "group" | "major" | "university" | "tier" | "all"
    targets: string[]
    count: number
  }
  sender: string
  status: "draft" | "sent" | "scheduled" | "failed"
  priority: "low" | "medium" | "high" | "urgent"
  createdDate: string
  sentDate?: string
  scheduledDate?: string
  deliveryStats: {
    sent: number
    delivered: number
    read: number
    replied: number
  }
  template?: string
}

interface SupportTicket {
  id: string
  subject: string
  message: string
  user: {
    id: string
    name: string
    email: string
    major: string
  }
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: "technical" | "account" | "billing" | "content" | "other"
  createdDate: string
  lastReply?: string
  assignedTo?: string
}

export default function AdminMessagesPage() {
  const [activeTab, setActiveTab] = useState<"messages" | "compose" | "tickets" | "templates">("messages")
  const [selectedMessageType, setSelectedMessageType] = useState<"all" | "individual" | "bulk" | "announcement">("all")
  const [selectedTicketStatus, setSelectedTicketStatus] = useState<"all" | "open" | "in-progress" | "resolved">("all")

  // Mock messages data
  const mockMessages: Message[] = [
    {
      id: "msg-1",
      subject: "مرحباً بك في منصة تخصص",
      content: "نرحب بك في منصة تخصص الأكاديمية. نتمنى لك تجربة مفيدة ومثمرة.",
      type: "individual",
      recipients: {
        type: "user",
        targets: ["user-law-1"],
        count: 1,
      },
      sender: "مدير النظام",
      status: "sent",
      priority: "medium",
      createdDate: "2024-01-15T10:00:00Z",
      sentDate: "2024-01-15T10:05:00Z",
      deliveryStats: {
        sent: 1,
        delivered: 1,
        read: 1,
        replied: 0,
      },
      template: "welcome-message",
    },
    {
      id: "msg-2",
      subject: "تحديث مهم على المنصة",
      content: "تم إطلاق ميزات جديدة على المنصة. يرجى مراجعة التحديثات الجديدة.",
      type: "bulk",
      recipients: {
        type: "all",
        targets: [],
        count: 1247,
      },
      sender: "مدير النظام",
      status: "sent",
      priority: "high",
      createdDate: "2024-01-12T14:00:00Z",
      sentDate: "2024-01-12T15:00:00Z",
      deliveryStats: {
        sent: 1247,
        delivered: 1198,
        read: 856,
        replied: 23,
      },
    },
    {
      id: "msg-3",
      subject: "تذكير بانتهاء الاشتراك",
      content: "ينتهي اشتراكك المميز خلال 7 أيام. يرجى تجديد الاشتراك للاستمرار في الاستفادة من الميزات.",
      type: "automated",
      recipients: {
        type: "tier",
        targets: ["premium"],
        count: 156,
      },
      sender: "النظام الآلي",
      status: "scheduled",
      priority: "medium",
      createdDate: "2024-01-14T09:00:00Z",
      scheduledDate: "2024-01-20T09:00:00Z",
      deliveryStats: {
        sent: 0,
        delivered: 0,
        read: 0,
        replied: 0,
      },
      template: "subscription-reminder",
    },
  ]

  // Mock support tickets data
  const mockTickets: SupportTicket[] = [
    {
      id: "ticket-1",
      subject: "مشكلة في رفع الملفات",
      message: "لا أستطيع رفع ملفات PDF على المنصة، تظهر رسالة خطأ.",
      user: {
        id: "user-law-1",
        name: "أحمد محمد السالم",
        email: "ahmed.salem@example.com",
        major: "القانون",
      },
      status: "open",
      priority: "medium",
      category: "technical",
      createdDate: "2024-01-15T11:30:00Z",
    },
    {
      id: "ticket-2",
      subject: "استفسار حول الاشتراك المميز",
      message: "أريد معرفة الفرق بين الاشتراك القياسي والمميز.",
      user: {
        id: "user-it-1",
        name: "فاطمة عبدالله النمر",
        email: "fatima.alnamir@example.com",
        major: "تقنية المعلومات",
      },
      status: "in-progress",
      priority: "low",
      category: "billing",
      createdDate: "2024-01-14T16:20:00Z",
      lastReply: "2024-01-15T09:15:00Z",
      assignedTo: "مدير النظام",
    },
    {
      id: "ticket-3",
      subject: "محتوى غير مناسب",
      message: "هناك محتوى غير مناسب تم رفعه من قبل أحد المستخدمين.",
      user: {
        id: "user-med-1",
        name: "نورا الشهري",
        email: "nora.alshahri@example.com",
        major: "الطب",
      },
      status: "resolved",
      priority: "high",
      category: "content",
      createdDate: "2024-01-13T14:45:00Z",
      lastReply: "2024-01-14T10:30:00Z",
      assignedTo: "مدير النظام",
    },
  ]

  const filteredMessages = mockMessages.filter((message) => {
    return selectedMessageType === "all" || message.type === selectedMessageType
  })

  const filteredTickets = mockTickets.filter((ticket) => {
    return selectedTicketStatus === "all" || ticket.status === selectedTicketStatus
  })

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
      open: "bg-red-100 text-red-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
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

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <RetroWindow title="أدوات التواصل">
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="mb-6 flex items-center gap-2 border-b border-gray-300">
              <button
                onClick={() => setActiveTab("messages")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "messages" ? "bg-retro-accent text-white" : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                الرسائل المرسلة
              </button>
              <button
                onClick={() => setActiveTab("compose")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "compose" ? "bg-retro-accent text-white" : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                إنشاء رسالة
              </button>
              <button
                onClick={() => setActiveTab("tickets")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "tickets" ? "bg-retro-accent text-white" : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                تذاكر الدعم
              </button>
              <button
                onClick={() => setActiveTab("templates")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "templates" ? "bg-retro-accent text-white" : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                القوالب
              </button>
            </div>

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-black">الرسائل المرسلة</h3>
                    <select
                      value={selectedMessageType}
                      onChange={(e) => setSelectedMessageType(e.target.value as any)}
                      className="px-3 py-1 border border-gray-400 bg-white text-black text-sm"
                    >
                      <option value="all">جميع الأنواع</option>
                      <option value="individual">فردية</option>
                      <option value="bulk">جماعية</option>
                      <option value="announcement">إعلانات</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setActiveTab("compose")}
                    className="retro-button bg-green-500 text-white px-4 py-2 hover:bg-green-600"
                  >
                    رسالة جديدة
                  </button>
                </div>

                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <div key={message.id} className="border border-gray-400 bg-white p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-black">{message.subject}</h4>
                          <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded ${getStatusColor(message.status)}`}>
                            {message.status === "draft"
                              ? "مسودة"
                              : message.status === "sent"
                                ? "مرسل"
                                : message.status === "scheduled"
                                  ? "مجدول"
                                  : "فشل"}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(message.priority)}`}>
                            {message.priority === "low"
                              ? "منخفضة"
                              : message.priority === "medium"
                                ? "متوسطة"
                                : message.priority === "high"
                                  ? "عالية"
                                  : "عاجلة"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <strong>المرسل:</strong> {message.sender}
                        </div>
                        <div>
                          <strong>المستلمين:</strong> {message.recipients.count}
                        </div>
                        <div>
                          <strong>تاريخ الإنشاء:</strong> {new Date(message.createdDate).toLocaleDateString("ar-SA")}
                        </div>
                        <div>
                          <strong>معدل القراءة:</strong>{" "}
                          {message.deliveryStats.sent > 0
                            ? Math.round((message.deliveryStats.read / message.deliveryStats.sent) * 100)
                            : 0}
                          %
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>📤 مرسل: {message.deliveryStats.sent}</span>
                        <span>✅ مُسلم: {message.deliveryStats.delivered}</span>
                        <span>👁️ مقروء: {message.deliveryStats.read}</span>
                        <span>💬 ردود: {message.deliveryStats.replied}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/messages/${message.id}`}
                          className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600"
                        >
                          التفاصيل
                        </Link>
                        {message.status === "draft" && (
                          <button className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600">
                            إرسال
                          </button>
                        )}
                        <button className="retro-button bg-purple-500 text-white px-3 py-1 text-sm hover:bg-purple-600">
                          نسخ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compose Tab */}
            {activeTab === "compose" && (
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">إنشاء رسالة جديدة</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">موضوع الرسالة</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                        placeholder="اكتب موضوع الرسالة..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">نوع الرسالة</label>
                      <select className="w-full px-3 py-2 border border-gray-400 bg-white text-black">
                        <option value="individual">رسالة فردية</option>
                        <option value="bulk">رسالة جماعية</option>
                        <option value="announcement">إعلان</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">المستلمين</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">نوع المستلم</label>
                        <select className="w-full px-3 py-2 border border-gray-400 bg-white text-black text-sm">
                          <option value="all">جميع المستخدمين</option>
                          <option value="major">حسب التخصص</option>
                          <option value="university">حسب الجامعة</option>
                          <option value="tier">حسب نوع الاشتراك</option>
                          <option value="user">مستخدم محدد</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">التخصص (اختياري)</label>
                        <select className="w-full px-3 py-2 border border-gray-400 bg-white text-black text-sm">
                          <option value="">جميع التخصصات</option>
                          <option value="law">القانون</option>
                          <option value="it">تقنية المعلومات</option>
                          <option value="medical">الطب</option>
                          <option value="business">إدارة الأعمال</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">الأولوية</label>
                        <select className="w-full px-3 py-2 border border-gray-400 bg-white text-black text-sm">
                          <option value="medium">متوسطة</option>
                          <option value="low">منخفضة</option>
                          <option value="high">عالية</option>
                          <option value="urgent">عاجلة</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">محتوى الرسالة</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                      rows={6}
                      placeholder="اكتب محتوى الرسالة..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">جدولة الإرسال (اختياري)</label>
                      <input
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">قالب الرسالة (اختياري)</label>
                      <select className="w-full px-3 py-2 border border-gray-400 bg-white text-black">
                        <option value="">بدون قالب</option>
                        <option value="welcome">رسالة ترحيب</option>
                        <option value="reminder">تذكير</option>
                        <option value="announcement">إعلان</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="retro-button bg-green-500 text-white px-4 py-2 hover:bg-green-600">
                      إرسال الآن
                    </button>
                    <button className="retro-button bg-blue-500 text-white px-4 py-2 hover:bg-blue-600">
                      جدولة الإرسال
                    </button>
                    <button className="retro-button bg-gray-500 text-white px-4 py-2 hover:bg-gray-600">
                      حفظ كمسودة
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Support Tickets Tab */}
            {activeTab === "tickets" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-black">تذاكر الدعم</h3>
                    <select
                      value={selectedTicketStatus}
                      onChange={(e) => setSelectedTicketStatus(e.target.value as any)}
                      className="px-3 py-1 border border-gray-400 bg-white text-black text-sm"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="open">مفتوح</option>
                      <option value="in-progress">قيد المعالجة</option>
                      <option value="resolved">محلول</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-400 bg-white p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-black">{ticket.subject}</h4>
                          <p className="text-sm text-gray-600 mt-1">{ticket.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded ${getStatusColor(ticket.status)}`}>
                            {ticket.status === "open"
                              ? "مفتوح"
                              : ticket.status === "in-progress"
                                ? "قيد المعالجة"
                                : ticket.status === "resolved"
                                  ? "محلول"
                                  : "مغلق"}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority === "low"
                              ? "منخفضة"
                              : ticket.priority === "medium"
                                ? "متوسطة"
                                : ticket.priority === "high"
                                  ? "عالية"
                                  : "عاجلة"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <strong>المستخدم:</strong> {ticket.user.name}
                        </div>
                        <div>
                          <strong>التخصص:</strong> {ticket.user.major}
                        </div>
                        <div>
                          <strong>الفئة:</strong>{" "}
                          {ticket.category === "technical"
                            ? "تقني"
                            : ticket.category === "account"
                              ? "حساب"
                              : ticket.category === "billing"
                                ? "فوترة"
                                : ticket.category === "content"
                                  ? "محتوى"
                                  : "أخرى"}
                        </div>
                        <div>
                          <strong>تاريخ الإنشاء:</strong> {new Date(ticket.createdDate).toLocaleDateString("ar-SA")}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/tickets/${ticket.id}`}
                          className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600"
                        >
                          عرض التفاصيل
                        </Link>
                        <button className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600">
                          رد
                        </button>
                        {ticket.status === "open" && (
                          <button className="retro-button bg-orange-500 text-white px-3 py-1 text-sm hover:bg-orange-600">
                            تعيين لي
                          </button>
                        )}
                        <button className="retro-button bg-purple-500 text-white px-3 py-1 text-sm hover:bg-purple-600">
                          إغلاق
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === "templates" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black">قوالب الرسائل</h3>
                  <button className="retro-button bg-green-500 text-white px-4 py-2 hover:bg-green-600">
                    إنشاء قالب جديد
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-400 bg-white p-4">
                    <h4 className="font-semibold text-black mb-2">رسالة ترحيب</h4>
                    <p className="text-sm text-gray-600 mb-3">مرحباً بك في منصة تخصص! نحن سعداء لانضمامك إلينا...</p>
                    <div className="flex items-center gap-2">
                      <button className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600">
                        تعديل
                      </button>
                      <button className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600">
                        استخدام
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-400 bg-white p-4">
                    <h4 className="font-semibold text-black mb-2">تذكير الاشتراك</h4>
                    <p className="text-sm text-gray-600 mb-3">ينتهي اشتراكك المميز قريباً. يرجى التجديد...</p>
                    <div className="flex items-center gap-2">
                      <button className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600">
                        تعديل
                      </button>
                      <button className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600">
                        استخدام
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
