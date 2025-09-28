"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "../components/retro-window"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { ArrowRight, MessageCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function AmbassadorsPage() {
  const supabase = createClient()

  const [ambassadors, setAmbassadors] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [majorFilter, setMajorFilter] = useState("all")
  const [universityFilter, setUniversityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // fetch ambassadors
  useEffect(() => {
    const fetchAmbassadors = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "ambassador")

      if (error) {
        console.error("Error fetching ambassadors:", error.message)
      } else {
        setAmbassadors(data || [])
      }
    }

    fetchAmbassadors()
  }, [supabase])

  // filters
  const filteredAmbassadors = ambassadors.filter((amb) => {
    const matchesSearch =
      amb.name?.toLowerCase().includes(search.toLowerCase()) ||
      amb.major?.toLowerCase().includes(search.toLowerCase()) ||
      amb.university?.toLowerCase().includes(search.toLowerCase())

    const matchesMajor =
      majorFilter === "all" || amb.major === majorFilter

    const matchesUniversity =
      universityFilter === "all" || amb.university === universityFilter

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && amb.available) ||
      (statusFilter === "busy" && !amb.available)

    return matchesSearch && matchesMajor && matchesUniversity && matchesStatus
  })

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
                  <Input
                    placeholder="ابحث عن سفير..."
                    className="retro-button"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Select onValueChange={(val) => setMajorFilter(val)}>
                    <SelectTrigger className="retro-button">
                      <SelectValue placeholder="التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع التخصصات</SelectItem>
                      <SelectItem value="قانون">قانون</SelectItem>
                      <SelectItem value="تقنية">تقنية</SelectItem>
                      <SelectItem value="طب">طب</SelectItem>
                      <SelectItem value="إدارة أعمال">إدارة أعمال</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(val) => setUniversityFilter(val)}>
                    <SelectTrigger className="retro-button">
                      <SelectValue placeholder="الجامعة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الجامعات</SelectItem>
                      <SelectItem value="الجامعة الأردنية">
                        الجامعة الأردنية
                      </SelectItem>
                      <SelectItem value="جامعة العلوم والتكنولوجيا">
                        جامعة العلوم والتكنولوجيا
                      </SelectItem>
                      <SelectItem value="جامعة مؤتة">جامعة مؤتة</SelectItem>
                      <SelectItem value="جامعة اليرموك">
                        جامعة اليرموك
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(val) => setStatusFilter(val)}>
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

            {/* Ambassadors list */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAmbassadors.map((amb) => (
                <div key={amb.id} className="retro-window bg-white">
                  <div className="p-6">
                    {/* Ambassador Header */}
                    <div className="text-center mb-6">
                      <h3 className="font-bold text-xl mb-2 text-gray-800">
                        السفير : {amb.name}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-blue-600">
                          التخصص : {amb.major}
                        </p>
                        <p className="text-sm text-gray-600">
                          الجامعة : {amb.university}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        asChild
                        className="retro-button w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Link
                          href={`https://wa.me/${amb.phone}`}
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
              {filteredAmbassadors.length === 0 && (
                <p className="text-center col-span-full text-gray-500">
                  لا يوجد سفراء حسب الفلاتر المختارة
                </p>
              )}
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
