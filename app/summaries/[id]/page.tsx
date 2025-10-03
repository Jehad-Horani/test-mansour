"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import PixelIcon from "@/app/components/pixel-icon"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
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
  is_approved: boolean
  created_at: string
}

interface DownloadStatus {
  canDownload: boolean
  subscriptionTier: string | null
  downloadsThisMonth: number
  isLoggedIn: boolean
}

const supabase = createClient()

export default function SummaryDetailPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>({
    canDownload: false,
    subscriptionTier: null,
    downloadsThisMonth: 0,
    isLoggedIn: false,
  })
  const [isDownloading, setIsDownloading] = useState(false)

  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const initialize = async () => {
      if (params.id) {
        await Promise.all([
          fetchSummary(params.id as string),
          checkDownloadLimit()
        ])
      }
    }
    initialize()
  }, [params.id])

  const checkDownloadLimit = async (): Promise<DownloadStatus> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { 
          canDownload: false, 
          subscriptionTier: null, 
          downloadsThisMonth: 0,
          isLoggedIn: false 
        }
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        return { 
          canDownload: false, 
          subscriptionTier: null, 
          downloadsThisMonth: 0,
          isLoggedIn: true 
        }
      }

      const tier = profile?.subscription_tier || "free"

      // Premium users have unlimited downloads
      if (tier !== "free") {
        const status = { 
          canDownload: true, 
          subscriptionTier: tier, 
          downloadsThisMonth: 0,
          isLoggedIn: true 
        }
        setDownloadStatus(status)
        return status
      }

      // For free users, check monthly download count
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: downloads, error: downloadsError } = await supabase
        .from("downloads")
        .select("id")
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth.toISOString())

      if (downloadsError) {
        console.error("Error fetching downloads:", downloadsError)
        const status = { 
          canDownload: false, 
          subscriptionTier: tier, 
          downloadsThisMonth: 0,
          isLoggedIn: true 
        }
        setDownloadStatus(status)
        return status
      }

      const downloadCount = downloads?.length || 0
      const canDownload = downloadCount < 1

      const status = { 
        canDownload, 
        subscriptionTier: tier, 
        downloadsThisMonth: downloadCount,
        isLoggedIn: true 
      }
      setDownloadStatus(status)
      return status
    } catch (error) {
      console.error("Error checking download limit:", error)
      const status = { 
        canDownload: false, 
        subscriptionTier: null, 
        downloadsThisMonth: 0,
        isLoggedIn: false 
      }
      setDownloadStatus(status)
      return status
    }
  }

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

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // Prevent multiple simultaneous downloads
    if (isDownloading) {
      return
    }

    // Check if user is logged in
    if (!downloadStatus.isLoggedIn) {
      alert("يجب تسجيل الدخول لتحميل الملخص.")
      router.push("/auth/login")
      return
    }

    if (!summary) {
      return
    }

    try {
      setIsDownloading(true)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert("يجب تسجيل الدخول لتحميل الملخص.")
        router.push("/auth/login")
        return
      }

      // Re-check download limit right before downloading
      const currentStatus = await checkDownloadLimit()

      if (!currentStatus.canDownload) {
        if (currentStatus.subscriptionTier === "free") {
          alert(
            `لقد وصلت لحد التحميل لهذا الشهر. قمت بتحميل ${currentStatus.downloadsThisMonth} ملف. ` +
            "يمكنك الترقية للاشتراك المميز للحصول على تحميلات غير محدودة."
          )
        } else {
          alert("حدث خطأ في التحقق من حالة الاشتراك. يرجى المحاولة مرة أخرى.")
        }
        return
      }

      // Record the download FIRST (before opening file)
      const { error: insertError } = await supabase
        .from("downloads")
        .insert({
          user_id: user.id,
          file_id: summary.id,
          created_at: new Date().toISOString(),
        })

      if (insertError) {
        console.error("Error recording download:", insertError)
        alert("حدث خطأ أثناء تسجيل التحميل. يرجى المحاولة مرة أخرى.")
        return
      }

      // Open the file URL
      window.open(summary.file_url, "_blank")

      // Update download status after successful download
      await checkDownloadLimit()

      // Show success message for free users
      if (currentStatus.subscriptionTier === "free") {
        alert("تم التحميل بنجاح! لقد استخدمت تحميلك المجاني لهذا الشهر.")
      }

    } catch (error) {
      console.error("Error during download:", error)
      alert("حدث خطأ أثناء التحميل. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsDownloading(false)
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

  const getDownloadButtonText = () => {
    if (!downloadStatus.isLoggedIn) {
      return "سجل الدخول للتحميل"
    }
    if (isDownloading) {
      return "جاري التحميل..."
    }
    if (!downloadStatus.canDownload && downloadStatus.subscriptionTier === "free") {
      return "تم استخدام التحميل المجاني"
    }
    return "تحميل الملخص"
  }

  const getDownloadStatusMessage = () => {
    if (!downloadStatus.isLoggedIn) {
      return (
        <div className="bg-yellow-50 border-2 border-yellow-400 p-4 mb-4 text-center">
          <p className="text-yellow-800">
            يجب تسجيل الدخول لتحميل الملخصات
          </p>
        </div>
      )
    }

    if (downloadStatus.subscriptionTier === "free") {
      if (downloadStatus.canDownload) {
        return (
          <div className="bg-green-50 border-2 border-green-400 p-4 mb-4 text-center">
            <p className="text-green-800">
              ✓ يمكنك تحميل ملف واحد هذا الشهر
            </p>
          </div>
        )
      } else {
        return (
          <div className="bg-orange-50 border-2 border-orange-400 p-4 mb-4 text-center">
            <p className="text-orange-800 mb-2">
              ⚠️ لقد استخدمت تحميلك المجاني لهذا الشهر ({downloadStatus.downloadsThisMonth}/1)
            </p>
            <p className="text-sm text-orange-700">
              قم بالترقية للاشتراك المميز للحصول على تحميلات غير محدودة
            </p>
          </div>
        )
      }
    }

    return null
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

  const isDownloadDisabled = !downloadStatus.isLoggedIn || (!downloadStatus.canDownload && downloadStatus.subscriptionTier === "free") || isDownloading

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
              <div className="p-6">
                {/* Download Status Message */}
                {getDownloadStatusMessage()}

                <div className="text-center">
                  <PixelIcon 
                    type="download" 
                    className={`w-12 h-12 mx-auto mb-4 ${isDownloading ? "animate-bounce" : ""}`}
                  />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    {downloadStatus.isLoggedIn ? "جاهز للتحميل" : "يتطلب تسجيل الدخول"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {downloadStatus.isLoggedIn 
                      ? "اضغط على الزر أدناه لتحميل الملخص"
                      : "سجل الدخول أولاً لتتمكن من تحميل الملخص"
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {downloadStatus.isLoggedIn ? (
                      <Button 
                        asChild={!isDownloadDisabled}
                        className="retro-button" 
                        style={{ 
                          background: isDownloadDisabled ? "var(--gray-400)" : "var(--primary)", 
                          color: "white",
                          opacity: isDownloadDisabled ? 0.5 : 1,
                          cursor: isDownloadDisabled ? "not-allowed" : "pointer"
                        }}
                        disabled={isDownloadDisabled}
                      >
                        {isDownloadDisabled ? (
                          <span>
                            <PixelIcon type="download" className="w-4 h-4 ml-2" />
                            {getDownloadButtonText()}
                          </span>
                        ) : (
                          <a 
                            href={summary.file_url} 
                            onClick={handleDownload}
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <PixelIcon type="download" className="w-4 h-4 ml-2" />
                            {getDownloadButtonText()}
                          </a>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        asChild
                        className="retro-button" 
                        style={{ background: "var(--primary)", color: "white" }}
                      >
                        <Link href="/auth/login">
                          <PixelIcon type="user" className="w-4 h-4 ml-2" />
                          تسجيل الدخول
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="outline" className="retro-button bg-transparent">
                      <Link href="/summaries">تصفح المزيد من الملخصات</Link>
                    </Button>
                  </div>

                  {/* Upgrade prompt for free users who hit the limit */}
                  {downloadStatus.subscriptionTier === "free" && !downloadStatus.canDownload && (
                    <div className="mt-6 pt-6 border-t-2 border-orange-200">
                      <p className="text-sm text-gray-700 mb-3">
                        هل تريد المزيد من التحميلات؟
                      </p>
                      <Button 
                        asChild
                        className="retro-button"
                        style={{ background: "var(--accent)", color: "white" }}
                      >
                        <Link href="/pricing">
                          ترقية الاشتراك
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}