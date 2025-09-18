"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RetroWindow } from "@/components/retro-window"
import { Badge } from "@/components/ui/badge"
import { useTier } from "@/hooks/use-tier"
import { User, MessageCircle } from "lucide-react"
import Link from "next/link"

const mockUniversityAmbassadors = [
  {
    id: 1,
    name: "أحمد محمد العلي",
    major: "القانون",
    university: "الجامعة الأردنية",
    year: "السنة الرابعة",
    rating: 4.8,
    specialties: ["القانون المدني", "القانون الجنائي"],
    available: true,
  },
  {
    id: 2,
    name: "فاطمة عبدالله",
    major: "تقنية المعلومات",
    university: "جامعة العلوم والتكنولوجيا الأردنية",
    year: "السنة الثالثة",
    rating: 4.9,
    specialties: ["البرمجة", "قواعد البيانات"],
    available: false,
  },
]

const mockOtherAmbassadors = [
  {
    id: 3,
    name: "نورا الشهري",
    major: "تقنية المعلومات",
    university: "جامعة اليرموك",
    year: "السنة الرابعة",
    rating: 4.6,
    specialties: ["أمن المعلومات", "الشبكات"],
    available: true,
  },
  {
    id: 4,
    name: "محمد علي الأحمد",
    major: "إدارة الأعمال",
    university: "جامعة مؤتة",
    year: "السنة الخامسة",
    rating: 4.7,
    specialties: ["إدارة المشاريع", "التسويق"],
    available: true,
  },
]

export default function AmbassadorsPage() {
  const [showOthers, setShowOthers] = useState(false)
  const [filters, setFilters] = useState({
    university: "all",
    major: "all",
  })
  const { canAccess } = useTier()

  const filteredOtherAmbassadors = mockOtherAmbassadors.filter((ambassador) => {
    return (
      (filters.university === "all" || ambassador.university === filters.university) &&
      (filters.major === "all" || ambassador.major === filters.major)
    )
  })

  const handleConsultation = (ambassadorId: number) => {
    if (!canAccess("premium")) {
      alert("الاستشارات متاحة للمشتركين المميزين فقط. يرجى ترقية اشتراكك.")
      return
    }
    alert(`سيتم توصيلك بالسفير قريباً...`)
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-6xl mx-auto">
        <RetroWindow title="السفراء الأكاديميون">
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/dashboard" className="retro-button bg-gray-200 hover:bg-gray-300 px-4 py-2">
                ← العودة للوحة التحكم
              </Link>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                السفراء الأكاديميون
              </h1>
              <p style={{ color: "var(--ink)", opacity: 0.8 }}>تواصل مع السفراء للحصول على المساعدة الأكاديمية</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--ink)" }}>
                سفراء من جامعتك
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {mockUniversityAmbassadors.map((ambassador) => (
                  <div key={ambassador.id} className="retro-window bg-white">
                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="font-semibold mb-1" style={{ color: "var(--ink)" }}>
                          {ambassador.name}
                        </h3>
                        <p className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                          {ambassador.university}
                        </p>
                        <p className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                          {ambassador.year}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">التقييم:</span>
                        <Badge variant="secondary" className="text-xs">
                          ⭐ {ambassador.rating}
                        </Badge>
                        <Badge
                          className={`text-xs ${
                            ambassador.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {ambassador.available ? "متاح" : "مشغول"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">التخصصات:</p>
                        <div className="flex flex-wrap gap-1">
                          {ambassador.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button
                          asChild
                          className="retro-button w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={!ambassador.available}
                        >
                          <Link href={`/ambassadors/${ambassador.id}/profile`}>
                            <User className="w-4 h-4 ml-2" />
                            عرض الصفحة الشخصية
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="retro-button w-full bg-green-600 hover:bg-green-700 text-white"
                          disabled={!ambassador.available}
                        >
                          <Link href={`/ambassadors/${ambassador.id}/chat`}>
                            <MessageCircle className="w-4 h-4 ml-2" />
                            بدء محادثة
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold" style={{ color: "var(--ink)" }}>
                    سفراء آخرين
                  </h2>
                  <Button
                    onClick={() => setShowOthers(!showOthers)}
                    className="retro-button bg-gray-200 hover:bg-gray-300"
                  >
                    {showOthers ? "إخفاء" : "عرض سفراء آخرين"}
                  </Button>
                </div>

                {showOthers && (
                  <>
                    <div className="retro-window bg-gray-50 p-4">
                      <div className="flex gap-4">
                        <Select
                          value={filters.university}
                          onValueChange={(value) => setFilters({ ...filters, university: value })}
                        >
                          <SelectTrigger className="retro-button w-48">
                            <SelectValue placeholder="اختر الجامعة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">جميع الجامعات</SelectItem>
                            <SelectItem value="الجامعة الأردنية">الجامعة الأردنية</SelectItem>
                            <SelectItem value="جامعة اليرموك">جامعة اليرموك</SelectItem>
                            <SelectItem value="جامعة مؤتة">جامعة مؤتة</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={filters.major}
                          onValueChange={(value) => setFilters({ ...filters, major: value })}
                        >
                          <SelectTrigger className="retro-button w-48">
                            <SelectValue placeholder="اختر التخصص" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">جميع التخصصات</SelectItem>
                            <SelectItem value="القانون">القانون</SelectItem>
                            <SelectItem value="تقنية المعلومات">تقنية المعلومات</SelectItem>
                            <SelectItem value="إدارة الأعمال">إدارة الأعمال</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredOtherAmbassadors.map((ambassador) => (
                        <div key={ambassador.id} className="retro-window bg-white">
                          <div className="p-4 space-y-4">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">{ambassador.name}</h3>
                              <p className="text-sm text-gray-600">{ambassador.university}</p>
                              <p className="text-sm text-gray-600">{ambassador.year}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">التقييم:</span>
                              <Badge variant="secondary" className="text-xs">
                                ⭐ {ambassador.rating}
                              </Badge>
                              <Badge
                                className={`text-xs ${
                                  ambassador.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {ambassador.available ? "متاح" : "مشغول"}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">التخصصات:</p>
                              <div className="flex flex-wrap gap-1">
                                {ambassador.specialties.map((specialty) => (
                                  <Badge key={specialty} variant="outline" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Button
                                asChild
                                className="retro-button w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={!ambassador.available}
                              >
                                <Link href={`/ambassadors/${ambassador.id}/profile`}>
                                  <User className="w-4 h-4 ml-2" />
                                  عرض الصفحة الشخصية
                                </Link>
                              </Button>
                              <Button
                                asChild
                                className="retro-button w-full bg-green-600 hover:bg-green-700 text-white"
                                disabled={!ambassador.available}
                              >
                                <Link href={`/ambassadors/${ambassador.id}/chat`}>
                                  <MessageCircle className="w-4 h-4 ml-2" />
                                  بدء محادثة
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
