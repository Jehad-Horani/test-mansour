"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import PixelIcon from "@/app/components/pixel-icon"
import { useParams, useRouter } from "next/navigation"
import { useSupabaseClient } from "../../lib/supabase/client-wrapper"
import Link from "next/link"

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

export default function SummaryDetailPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const params = useParams()
  const router = useRouter()
const { data, loading1, error1 } = useSupabaseClient()

  useEffect(() => {
    if (params.id) {
      fetchSummary(params.id as string)
    }
  }, [params.id])

  const fetchSummary = async (id: string) => {
  try {
    setLoading(true)

    const res = await fetch(`/api/summaries/${id}`)
    if (!res.ok) throw new Error("فشل في جلب الملخص")

    const data = await res.json()

    if (!data.is_approved) {
      setError("هذا الملخص غير متاح حالياً")
      return
    }

    setSummary(data)
  } catch (err: any) {
    console.error("Error fetching summary:", err)
    setError("حدث خطأ في تحميل الملخص")
  } finally {
    setLoading(false)
  }
}


  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--panel)" }}>
        <div className="max-w-4xl mx-auto p-4">
          <RetroWindow title="جاري التحميل...">
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
              <p className="mt-4" style={{ color: "var(--ink)" }}>
                جاري تحميل تفاصيل الملخص...
              </p>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen" style={{ background: "var(--panel)" }}>
        <div className="max-w-4xl mx-auto p-4">
          <RetroWindow title="خطأ">
            <div className="p-8 text-center">
              <PixelIcon type="alert" className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>
                {error || "الملخص غير موجود"}
              </h2>
              <Button
                onClick={() => router.back()}
                className="retro-button"
                style={{ background: "var(--primary)", color: "white" }}
              >
                العودة
              </Button>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Button onClick={() => router.back()} variant="outline" className="retro-button bg-transparent mb-4">
            <PixelIcon type="arrow-left" className="w-4 h-4 ml-2" />
            العودة
          </Button>
        </div>

        {/* Summary Details */}
        <RetroWindow title="تفاصيل الملخص">
          <div className="p-6">
            {/* Title and Subject */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                {summary.title}
              </h1>
              <p className="text-lg text-gray-700 mb-4">{summary.subject_name}</p>
            </div>

            {/* Academic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="retro-window bg-white">
                <div className="retro-window-title">
                  <span>المعلومات الأكاديمية</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <PixelIcon type="building" className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">الجامعة</p>
                      <p className="font-medium" style={{ color: "var(--ink)" }}>
                        {summary.university_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <PixelIcon type="graduation-cap" className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">الكلية</p>
                      <p className="font-medium" style={{ color: "var(--ink)" }}>
                        {summary.college}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <PixelIcon type="book" className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">التخصص</p>
                      <p className="font-medium" style={{ color: "var(--ink)" }}>
                        {summary.major}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <PixelIcon type="calendar" className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">الفصل الدراسي</p>
                      <p className="font-medium" style={{ color: "var(--ink)" }}>
                        {summary.semester}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Info */}
              <div className="retro-window bg-white">
                <div className="retro-window-title">
                  <span>معلومات الملف</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <PixelIcon type="file" className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">اسم الملف</p>
                      <p className="font-medium" style={{ color: "var(--ink)" }}>
                        {summary.file_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <PixelIcon type="download" className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">حجم الملف</p>
                      <p className="font-medium" style={{ color: "var(--ink)" }}>
                        {formatFileSize(summary.file_size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <PixelIcon type="calendar" className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">تاريخ الرفع</p>
                      <p className="font-medium" style={{ color: "var(--ink)" }}>
                        {formatDate(summary.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {summary.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--ink)" }}>
                  وصف الملخص
                </h3>
                <div className="retro-window bg-gray-50">
                  <div className="p-4">
                    <p className="text-gray-700 leading-relaxed">{summary.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Download Section */}
            <div className="retro-window bg-blue-50">
              <div className="retro-window-title">
                <span>تحميل الملخص</span>
              </div>
              <div className="p-6 text-center">
                <PixelIcon type="download" className="w-12 h-12 mx-auto mb-4"  />
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--ink)" }}>
                  جاهز للتحميل
                </h3>
                <p className="text-gray-600 mb-4">اضغط على الزر أدناه لتحميل الملخص</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                    <a href={summary.file_url} target="_blank" rel="noopener noreferrer">
                      <PixelIcon type="download" className="w-4 h-4 ml-2" />
                      تحميل الملخص
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="retro-button bg-transparent">
                    <Link href="/summaries">تصفح المزيد من الملخصات</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}