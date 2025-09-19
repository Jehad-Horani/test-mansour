"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { RetroWindow } from "@/app/components/retro-window"
import PixelIcon from "@/app/components/pixel-icon"
import Link from "next/link"
import { useSupabaseClient } from "../lib/supabase/client-wrapper"
import { useUserContext } from "@/contexts/user-context"

interface Summary {
  id: string
  title: string
  subject_name: string
  university_name: string
  semester: string
  college: string
  major: string
  description: string
  file_url: string
  file_name: string
  file_size: number
  user_id: string
  is_approved: boolean
  created_at: string
}

const colleges = [
  "كلية الحقوق",
  "كلية تكنولوجيا المعلومات",
  "كلية إدارة الأعمال",
  "كلية الهندسة",
  "كلية الطب",
  "كلية الصيدلة",
]

const majorsByCollege: Record<string, string[]> = {
  "كلية الحقوق": ["القانون", "الشريعة", "العلوم السياسية"],
  "كلية تكنولوجيا المعلومات": ["علوم الحاسوب", "هندسة البرمجيات", "أمن المعلومات", "الشبكات"],
  "كلية إدارة الأعمال": ["إدارة الأعمال", "المحاسبة", "التسويق", "الاقتصاد"],
  "كلية الهندسة": ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة الميكانيكية"],
  "كلية الطب": ["الطب العام", "طب الأسنان"],
  "كلية الصيدلة": ["الصيدلة", "العلوم الطبية"],
}

export default function SummariesPage() {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [filteredSummaries, setFilteredSummaries] = useState<Summary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCollege, setSelectedCollege] = useState<string>("all")
  const [selectedMajor, setSelectedMajor] = useState<string>("all")
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const { isLoggedIn } = useUserContext()

const { data, loading1, error1 } = useSupabaseClient()

  useEffect(() => {
    fetchSummaries()
  }, [])

  useEffect(() => {
    filterSummaries()
  }, [summaries, searchTerm, selectedCollege, selectedMajor])

const fetchSummaries = async () => {
  try {
    setLoading(true)

    const res = await fetch("/api/summaries") // نعمل كول على API route
    if (!res.ok) throw new Error("فشل في جلب الملخصات")

    const data = await res.json()
    setSummaries(data || [])
  } catch (error) {
    console.error("Error fetching summaries:", error)
  } finally {
    setLoading(false)
  }
}


  const filterSummaries = () => {
    let filtered = summaries

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (summary) =>
          summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          summary.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          summary.university_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // College filter
    if (selectedCollege !== "all") {
      filtered = filtered.filter((summary) => summary.college === selectedCollege)
    }

    // Major filter (advanced)
    if (selectedMajor !== "all") {
      filtered = filtered.filter((summary) => summary.major === selectedMajor)
    }

    setFilteredSummaries(filtered)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCollege("all")
    setSelectedMajor("all")
    setShowAdvancedFilter(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--panel)" }}>
        <div className="max-w-6xl mx-auto p-4">
          <RetroWindow title="جاري التحميل...">
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
              <p className="mt-4" style={{ color: "var(--ink)" }}>
                جاري تحميل الملخصات...
              </p>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <RetroWindow title="الملخصات الدراسية">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                  الملخصات الدراسية
                </h1>
                <p className="text-gray-600">تصفح وشارك الملخصات الدراسية مع زملائك الطلاب</p>
              </div>
              {isLoggedIn && (
                <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                  <Link href="/summaries/upload">
                    <PixelIcon type="upload" className="w-4 h-4 ml-2" />
                    رفع ملخص جديد
                  </Link>
                </Button>
              )}
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <Input
                  placeholder="ابحث في الملخصات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="retro-input flex-1"
                />
                <Button
                  onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                  variant="outline"
                  className="retro-button bg-transparent"
                >
                  <PixelIcon type="filter" className="w-4 h-4 ml-2" />
                  فلتر متقدم
                </Button>
              </div>

              {/* Basic Filter - College */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                    <SelectTrigger className="retro-input">
                      <SelectValue placeholder="اختر الكلية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الكليات</SelectItem>
                      {colleges.map((college) => (
                        <SelectItem key={college} value={college}>
                          {college}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Filter - Major */}
                {showAdvancedFilter && selectedCollege !== "all" && (
                  <div className="flex-1">
                    <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                      <SelectTrigger className="retro-input">
                        <SelectValue placeholder="اختر التخصص" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع التخصصات</SelectItem>
                        {majorsByCollege[selectedCollege]?.map((major) => (
                          <SelectItem key={major} value={major}>
                            {major}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button onClick={resetFilters} variant="outline" className="retro-button bg-transparent">
                  إعادة تعيين
                </Button>
              </div>
            </div>
          </div>
        </RetroWindow>

        {/* Results */}
        <div className="mt-6">
          <RetroWindow title={`النتائج (${filteredSummaries.length})`}>
            <div className="p-6">
              {filteredSummaries.length === 0 ? (
                <div className="text-center py-12">
                  <PixelIcon type="file" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    لا توجد ملخصات
                  </h3>
                  <p className="text-gray-600 mb-4">لم يتم العثور على ملخصات تطابق معايير البحث</p>
                  {isLoggedIn && (
                    <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                      <Link href="/summaries/upload">كن أول من يرفع ملخص</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSummaries.map((summary) => (
                    <div key={summary.id} className="retro-window bg-white">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-sm mb-1" style={{ color: "var(--ink)" }}>
                              {summary.title}
                            </h3>
                            <p className="text-xs text-gray-600 mb-2">{summary.subject_name}</p>
                          </div>
                          <PixelIcon type="file" className="w-6 h-6 text-gray-400" />
                        </div>

                        <div className="space-y-1 text-xs text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <PixelIcon type="building" className="w-3 h-3" />
                            <span>{summary.university_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PixelIcon type="graduation-cap" className="w-3 h-3" />
                            <span>{summary.college}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PixelIcon type="book" className="w-3 h-3" />
                            <span>{summary.major}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PixelIcon type="calendar" className="w-3 h-3" />
                            <span>{summary.semester}</span>
                          </div>
                          {summary.file_size && (
                            <div className="flex items-center gap-2">
                              <PixelIcon type="download" className="w-3 h-3" />
                              <span>{formatFileSize(summary.file_size)}</span>
                            </div>
                          )}
                        </div>

                        {summary.description && (
                          <p className="text-xs text-gray-700 mb-4 line-clamp-2">{summary.description}</p>
                        )}

                        <div className="flex gap-2">
                          <Button
                            asChild
                            size="sm"
                            className="retro-button flex-1"
                            style={{ background: "var(--primary)", color: "white" }}
                          >
                            <Link href={`/summaries/${summary.id}`}>عرض التفاصيل</Link>
                          </Button>
                          {summary.file_url && (
                            <Button asChild size="sm" variant="outline" className="retro-button bg-transparent">
                              <a href={summary.file_url} target="_blank" rel="noopener noreferrer">
                                <PixelIcon type="download" className="w-3 h-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </RetroWindow>
        </div>
      </div>
    </div>
  )
}