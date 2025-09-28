"use client"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "../components/retro-window"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Badge } from "@/app/components/ui/badge"
import { Star, ArrowRight, MessageCircle, User, Phone } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"


export default function AmbassadorsPage() {

  const { user, isLoggedIn, getTierLabel, getMajorLabel, profile } = useAuth()

  const ambassadors = [
    {
      id: user?.id,
      name: profile?.name,
      major: profile?.major,
      university: profile?.major,
      phone: profile?.phone,
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
            <div className="retro-window bg-gray-50">
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
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ambassadors.map((ambassador) => (
                <div key={ambassador.id} className="retro-window bg-white">
                  <div className="p-6">
                    {/* Ambassador Header */}
                    <div className="text-center mb-6">

                      <h3 className="font-bold text-xl mb-2 text-gray-800">{ambassador.name}</h3>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-blue-600">{ambassador.major}</p>
                        <p className="text-sm text-gray-600">{ambassador.university}</p>
                      </div>
                    </div>



                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        asChild
                        className="retro-button w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Link href={`https://wa.me/${ambassador.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <MessageCircle className="w-4 h-4 ml-2" />
                          بدء محادثة
                        </Link>
                      </Button>
                    </div>
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
