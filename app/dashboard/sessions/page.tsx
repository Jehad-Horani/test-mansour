"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RetroWindow } from "@/components/retro-window"
import { RetroToggle } from "@/components/retro-toggle"
import { Badge } from "@/components/ui/badge"
import { useTier } from "@/hooks/use-tier"
import Link from "next/link"

const mockSessions = [
  {
    id: 1,
    title: "جلسة مراجعة القانون المدني",
    instructor: "د. أحمد العلي",
    date: "2024-02-10",
    time: "19:00 - 21:00",
    participants: 12,
    maxParticipants: 15,
    price: "مجاني",
    status: "متاح",
    description: "مراجعة شاملة لأهم مواضيع القانون المدني مع حل الأسئلة الشائعة",
    level: "متوسط",
    duration: "ساعتان",
  },
  {
    id: 2,
    title: "ورشة البرمجة المتقدمة",
    instructor: "م. سارة الأحمد",
    date: "2024-02-12",
    time: "20:00 - 22:00",
    participants: 8,
    maxParticipants: 10,
    price: "50 دينار",
    status: "متاح",
    description: "تعلم تقنيات البرمجة المتقدمة وأفضل الممارسات في التطوير",
    level: "متقدم",
    duration: "ساعتان",
  },
  {
    id: 3,
    title: "مراجعة إدارة الأعمال",
    instructor: "د. محمد الزهراني",
    date: "2024-02-08",
    time: "18:00 - 20:00",
    participants: 20,
    maxParticipants: 20,
    price: "30 دينار",
    status: "مكتمل",
    description: "مراجعة مكثفة لمبادئ إدارة الأعمال والاستراتيجيات الحديثة",
    level: "مبتدئ",
    duration: "ساعتان",
  },
  {
    id: 4,
    title: "جلسة حل مسائل الرياضيات",
    instructor: "د. فاطمة النور",
    date: "2024-02-14",
    time: "16:00 - 18:00",
    participants: 5,
    maxParticipants: 12,
    price: "مجاني",
    status: "متاح",
    description: "حل المسائل الصعبة في الرياضيات مع شرح الطرق المختلفة",
    level: "متوسط",
    duration: "ساعتان",
  },
]

export default function SessionsPage() {
  const { canAccess } = useTier()
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [searchTerm, setSearchTerm] = useState("")

  const categories = ["الكل", "قانون", "برمجة", "إدارة أعمال", "رياضيات", "علوم"]

  const filteredSessions = mockSessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "الكل" || session.title.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  const handleBookSession = (sessionId: number) => {
    if (!canAccess("premium")) {
      alert("الجلسات الدراسية متاحة للمشتركين المميزين فقط. يرجى ترقية اشتراكك.")
      return
    }
    alert(`تم حجز الجلسة بنجاح! سيتم إرسال رابط الانضمام قبل موعد الجلسة بـ 15 دقيقة.`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح":
        return "bg-green-100 text-green-800"
      case "مكتمل":
        return "bg-red-100 text-red-800"
      case "قريباً":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "مبتدئ":
        return "bg-green-100 text-green-700"
      case "متوسط":
        return "bg-yellow-100 text-yellow-700"
      case "متقدم":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      <RetroToggle />

      {/* Header */}
      <section className="retro-window mx-4 mt-4 mb-6">
        <div className="retro-window-title">
          <span>الجلسات الدراسية - انضم للجلسات الجماعية التفاعلية</span>
        </div>
        <div className="p-4">
          <Link href="/dashboard" className="retro-button inline-block mb-4">
            ← العودة للوحة التحكم
          </Link>
        </div>
      </section>

      <div className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Premium Notice */}
          {!canAccess("premium") && (
            <RetroWindow title="خدمة مميزة" className="mb-6 bg-yellow-50 border-yellow-400">
              <div className="text-center p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">الجلسات الدراسية - خدمة مميزة</h3>
                <p className="text-yellow-700 mb-4">
                  للانضمام للجلسات الدراسية الجماعية، يرجى ترقية اشتراكك للخطة المميزة
                </p>
                <Button className="retro-button bg-yellow-600 hover:bg-yellow-700 text-white">
                  ترقية للخطة المميزة
                </Button>
              </div>
            </RetroWindow>
          )}

          {/* Search and Filter */}
          <RetroWindow title="البحث والتصفية" className="mb-6">
            <div className="p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  className="retro-input w-full"
                  placeholder="البحث في الجلسات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="retro-input w-full"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "var(--ink)" }}>عدد الجلسات: {filteredSessions.length}</span>
                <span style={{ color: "var(--ink)" }}>
                  الجلسات المتاحة: {filteredSessions.filter((s) => s.status === "متاح").length}
                </span>
              </div>
            </div>
          </RetroWindow>

          {/* Sessions Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--ink)" }}>
              الجلسات القادمة ({filteredSessions.length})
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map((session) => (
                <RetroWindow key={session.id} title={session.title} className="hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    {/* Session Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
                        <Badge className={getLevelColor(session.level)}>{session.level}</Badge>
                      </div>

                      <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                        المدرب: {session.instructor}
                      </p>

                      <p className="text-sm text-gray-600">{session.description}</p>
                    </div>

                    {/* Session Details */}
                    <div className="space-y-2 text-sm" style={{ color: "var(--ink)" }}>
                      <div className="flex justify-between">
                        <span className="text-gray-600">التاريخ:</span>
                        <span>{new Date(session.date).toLocaleDateString("ar")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الوقت:</span>
                        <span>{session.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">المدة:</span>
                        <span>{session.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">السعر:</span>
                        <span className="font-semibold">{session.price}</span>
                      </div>
                    </div>

                    {/* Participants Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: "var(--ink)" }}>المشاركون</span>
                        <span style={{ color: "var(--ink)" }}>
                          {session.participants}/{session.maxParticipants}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(session.participants / session.maxParticipants) * 100}%`,
                            backgroundColor: session.status === "مكتمل" ? "#ef4444" : "var(--primary)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleBookSession(session.id)}
                      disabled={session.status !== "متاح" || !canAccess("premium")}
                      className="retro-button w-full disabled:opacity-50"
                      style={{
                        background:
                          session.status === "متاح" && canAccess("premium") ? "var(--primary)" : "var(--border)",
                        color: "white",
                      }}
                    >
                      {session.status === "مكتمل"
                        ? "الجلسة مكتملة"
                        : canAccess("premium")
                          ? "احجز مقعدك"
                          : "احجز مقعدك (مميز)"}
                    </Button>
                  </div>
                </RetroWindow>
              ))}
            </div>

            {filteredSessions.length === 0 && (
              <RetroWindow title="لا توجد جلسات" className="text-center">
                <div className="p-8">
                  <p className="text-gray-600 mb-4">لا توجد جلسات تطابق معايير البحث</p>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("الكل")
                    }}
                    className="retro-button"
                  >
                    إعادة تعيين البحث
                  </Button>
                </div>
              </RetroWindow>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
