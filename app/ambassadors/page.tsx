"use client"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "../components/retro-window"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Badge } from "@/app/components/ui/badge"
import { Star, ArrowRight, MessageCircle, User } from "lucide-react"
import Link from "next/link"

export default function AmbassadorsPage() {
  const ambassadors = [
    {
      id: 1,
      name: "د. أحمد محمد السالم",
      specialty: "القانون التجاري",
      university: "الجامعة الأردنية",
      rating: 4.9,
      sessions: 127,
      image: "/placeholder.svg?height=100&width=100&text=أحمد+السالم",
      experience: "15 سنة",
      languages: ["العربية", "الإنجليزية"],
      available: true,
    },
    {
      id: 2,
      name: "م. فاطمة علي أحمد",
      specialty: "هندسة البرمجيات",
      university: "جامعة العلوم والتكنولوجيا الأردنية",
      rating: 4.8,
      sessions: 89,
      image: "/placeholder.svg?height=100&width=100&text=فاطمة+أحمد",
      experience: "12 سنة",
      languages: ["العربية", "الإنجليزية"],
      available: true,
    },
    {
      id: 3,
      name: "د. سارة أحمد محمد",
      specialty: "الطب الباطني",
      university: "جامعة مؤتة",
      rating: 5.0,
      sessions: 156,
      image: "/placeholder.svg?height=100&width=100&text=سارة+محمد",
      experience: "18 سنة",
      languages: ["العربية"],
      available: false,
    },
    {
      id: 4,
      name: "د. محمد علي الأحمد",
      specialty: "إدارة الأعمال",
      university: "جامعة اليرموك",
      rating: 4.7,
      sessions: 203,
      image: "/placeholder.svg?height=100&width=100&text=محمد+الأحمد",
      experience: "10 سنوات",
      languages: ["العربية", "الإنجليزية"],
      available: true,
    },
  ]

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              الرئيسية
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span>السفراء الأكاديميون</span>
          </div>
        </div>

        <RetroWindow title="السفراء الأكاديميون">
          <div className="space-y-6">
            {/* Filters */}
            {/* <div className="retro-window bg-gray-50">
              <div className="p-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <Input placeholder="ابحث عن سفير..." className="retro-button" />
                  <Select>
                    <SelectTrigger className="retro-button">
                      <SelectValue placeholder="التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع التخصصات</SelectItem>
                      <SelectItem value="law">قانون</SelectItem>
                      <SelectItem value="tech">تقنية</SelectItem>
                      <SelectItem value="medical">طب</SelectItem>
                      <SelectItem value="business">إدارة أعمال</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="retro-button">
                      <SelectValue placeholder="الجامعة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الجامعات</SelectItem>
                      <SelectItem value="ju">الجامعة الأردنية</SelectItem>
                      <SelectItem value="just">جامعة العلوم والتكنولوجيا</SelectItem>
                      <SelectItem value="mutah">جامعة مؤتة</SelectItem>
                      <SelectItem value="yarmouk">جامعة اليرموك</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="retro-button">
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع السفراء</SelectItem>
                      <SelectItem value="available">متاح</SelectItem>
                      <SelectItem value="busy">مشغول</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div> */}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ambassadors.map((ambassador) => (
                <div key={ambassador.id} className="retro-window bg-white">
                  <div className="p-6">
                    {/* Ambassador Header */}
                    <div className="text-center mb-6">
                      <img
                        src={ambassador.image || "/placeholder.svg"}
                        alt={ambassador.name}
                        className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-3 border-2 border-gray-300"
                      />
                      <h3 className="font-bold text-xl mb-2 text-gray-800">{ambassador.name}</h3>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-blue-600">{ambassador.specialty}</p>
                        <p className="text-sm text-gray-600">{ambassador.university}</p>
                      </div>
                    </div>

                    {/* Ambassador Stats */}
                    <div className="space-y-3 mb-6">
                      {/* <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">{ambassador.rating}</span>
                        </div>
                        <span className="text-gray-600">{ambassador.sessions} جلسة مكتملة</span>
                      </div> */}

                      {/* <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <span className="text-gray-600">سنوات الخبرة:</span>
                        <span className="font-semibold">{ambassador.experience}</span>
                      </div> */}

                      {/* <div className="text-center">
                        <Badge
                          variant={ambassador.available ? "default" : "secondary"}
                          className={`text-sm px-3 py-1 ${ambassador.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {ambassador.available ? "متاح للمحادثة" : "مشغول حالياً"}
                        </Badge>
                      </div> */}
                    </div>

                    {/* Action Buttons */}
                    {/* <div className="space-y-3">
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
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
