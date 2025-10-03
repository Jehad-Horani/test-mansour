"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { RetroWindow } from "@/app/components/retro-window"
import PixelIcon from "@/app/components/pixel-icon"
import Link from "next/link"
import { useUserContext } from "@/contexts/user-context"
import { createClient } from "@/lib/supabase/client"

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

interface DownloadStatus {
  canDownload: boolean
  subscriptionTier: string | null
  downloadsThisMonth: number
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
  "كلية تكنولوجيا المعلومات": [
    "علوم الحاسوب",
    "هندسة البرمجيات",
    "أمن المعلومات",
    "الشبكات",
    "الذكاء الاصطناعي",
    "علوم البيانات"
  ],
  "كلية إدارة الأعمال": [
    "إدارة الأعمال",
    "المحاسبة",
    "التسويق",
    "الاقتصاد",
    "المالية والمصارف",
    "إدارة الموارد البشرية",
    "نظم المعلومات الإدارية",
    "إدارة اللوجستيات وسلاسل التوريد"
  ],
  "كلية الهندسة": [
    "الهندسة المدنية",
    "الهندسة الكهربائية",
    "الهندسة الميكانيكية",
    "الهندسة المعمارية",
    "هندسة الحاسوب",
    "الهندسة الصناعية",
    "هندسة الطاقة",
    "الهندسة الكيميائية",
    "هندسة الميكاترونكس"
  ],
  "كلية الطب": ["الطب العام", "طب الأسنان", "الطب البيطري"],
  "كلية الصيدلة": ["الصيدلة", "العلوم الطبية", "التكنولوجيا الحيوية"],
  "كلية التمريض": ["التمريض", "الإسعاف والطوارئ"],
  "كلية العلوم": [
    "الرياضيات",
    "الكيمياء",
    "الفيزياء",
    "الأحياء",
    "الجيولوجيا",
    "العلوم البيئية"
  ],
  "كلية الآداب": [
    "اللغة العربية وآدابها",
    "اللغة الإنجليزية وآدابها",
    "اللغة الفرنسية",
    "اللغة الألمانية",
    "التاريخ",
    "الجغرافيا",
    "الفلسفة",
    "علم النفس",
    "الآثار"
  ],
  "كلية الإعلام": ["الصحافة", "العلاقات العامة", "الإذاعة والتلفزيون", "الإعلام الرقمي"],
  "كلية التربية": [
    "التربية الخاصة",
    "معلم صف",
    "الإرشاد التربوي",
    "التربية البدنية",
    "التربية الفنية"
  ],
  "كلية الفنون والتصميم": [
    "التصميم الجرافيكي",
    "الفنون البصرية",
    "الموسيقى",
    "المسرح",
    "التصميم الداخلي"
  ],
  "كلية السياحة والفندقة": ["إدارة السياحة", "إدارة الفنادق", "الإرشاد السياحي"],
  "كلية الزراعة": [
    "المحاصيل والإنتاج",
    "الإنتاج الحيواني",
    "الاقتصاد الزراعي",
    "وقاية النبات",
    "المياه والبيئة الزراعية"
  ]
}


const supabase = createClient()

export default function SummariesPage() {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [filteredSummaries, setFilteredSummaries] = useState<Summary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCollege, setSelectedCollege] = useState<string>("all")
  const [selectedMajor, setSelectedMajor] = useState<string>("all")
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const { isLoggedIn } = useUserContext()
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>({
    canDownload: false,
    subscriptionTier: null,
    downloadsThisMonth: 0,
  })
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  // Check download limit on mount and whenever needed
  const checkDownloadLimit = async (): Promise<DownloadStatus> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return { canDownload: false, subscriptionTier: null, downloadsThisMonth: 0 }
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        return { canDownload: false, subscriptionTier: null, downloadsThisMonth: 0 }
      }

      const tier = profile?.subscription_tier || "free"

      // Premium users have unlimited downloads
      if (tier !== "free") {
        return { canDownload: true, subscriptionTier: tier, downloadsThisMonth: 0 }
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
        return { canDownload: false, subscriptionTier: tier, downloadsThisMonth: 0 }
      }

      const downloadCount = downloads?.length || 0
      const canDownload = downloadCount < 1

      return { canDownload, subscriptionTier: tier, downloadsThisMonth: downloadCount }
    } catch (error) {
      console.error("Error checking download limit:", error)
      return { canDownload: false, subscriptionTier: null, downloadsThisMonth: 0 }
    }
  }

  useEffect(() => {
    const initializeDownloadStatus = async () => {
      const status = await checkDownloadLimit()
      setDownloadStatus(status)
    }
    initializeDownloadStatus()
  }, [])

  useEffect(() => {
    fetchSummaries()
  }, [])

  useEffect(() => {
    filterSummaries()
  }, [summaries, searchTerm, selectedCollege, selectedMajor])

  const fetchSummaries = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/summaries")
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

    if (searchTerm) {
      filtered = filtered.filter(
        (summary) =>
          summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          summary.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          summary.university_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCollege !== "all") {
      filtered = filtered.filter((summary) => summary.college === selectedCollege)
    }

    if (selectedMajor !== "all") {
      filtered = filtered.filter((summary) => summary.major === selectedMajor)
    }

    setFilteredSummaries(filtered)
  }

  const handleDownload = async (summary: Summary) => {
    // Prevent multiple simultaneous downloads
    if (downloadingId) {
      return
    }

    try {
      setDownloadingId(summary.id)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert("يجب تسجيل الدخول لتحميل الملخص.")
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
      const updatedStatus = await checkDownloadLimit()
      setDownloadStatus(updatedStatus)

      // Show success message for free users
      if (currentStatus.subscriptionTier === "free") {
        alert("تم التحميل بنجاح! لقد استخدمت تحميلك المجاني لهذا الشهر.")
      }

    } catch (error) {
      console.error("Error during download:", error)
      alert("حدث خطأ أثناء التحميل. يرجى المحاولة مرة أخرى.")
    } finally {
      setDownloadingId(null)
    }
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
                {/* Show download status for free users */}
                {downloadStatus.subscriptionTier === "free" && (
                  <p className="text-sm text-orange-600 mt-2">
                    {downloadStatus.canDownload
                      ? "✓ يمكنك تحميل ملف واحد هذا الشهر"
                      : `⚠️ لقد استخدمت تحميلك المجاني لهذا الشهر (${downloadStatus.downloadsThisMonth}/1)`
                    }
                  </p>
                )}
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
              <div className="gap-2">
                <label className="font-bold text-lg mb-1">ابحث عن اسم المادة\الجامعة او اسم الملخص :</label>
                <br />
                <Input
                  placeholder="ابحث في الملخصات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="retro-input flex-1"
                />
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
                  {filteredSummaries.map((summary) => {
                    const isDownloading = downloadingId === summary.id
                    const isDisabled = !downloadStatus.canDownload || isDownloading

                    return (
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
                              <Button
                                size="sm"
                                variant="outline"
                                className="retro-button bg-transparent"
                                onClick={() => handleDownload(summary)}
                                disabled={isDisabled}
                                style={{
                                  opacity: isDisabled ? 0.5 : 1,
                                  cursor: isDisabled ? "not-allowed" : "pointer"
                                }}
                                title={
                                  !downloadStatus.canDownload
                                    ? "لقد وصلت لحد التحميل لهذا الشهر"
                                    : isDownloading
                                      ? "جاري التحميل..."
                                      : "تحميل الملف"
                                }
                              >
                                <PixelIcon
                                  type="download"
                                  className={`w-3 h-3 ${isDownloading ? "animate-bounce" : ""}`}
                                />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </RetroWindow>
        </div>
      </div>
    </div>
  )
}