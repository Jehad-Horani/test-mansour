"use client"

import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import Link from "next/link"
import { Edit, Settings, BookOpen, Users, Award, Calendar, Upload } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, isLoggedIn, getTierLabel, getMajorLabel, profile } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>("")

  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url)
    }
  }, [profile])

  // دالة رفع الصورة - Fixed the implementation with proper bucket creation
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) {
      toast.error("يجب اختيار ملف وتسجيل الدخول")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الملف يجب أن يكون أقل من 5 ميجابايت")
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("يجب أن يكون الملف صورة")
      return
    }

    try {
      setIsUploading(true)
      
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}_${Date.now()}.${fileExt}`
      const filePath = fileName

      // First, ensure the avatars bucket exists
      const { data: buckets } = await supabase.storage.listBuckets()
      const avatarsBucket = buckets?.find(bucket => bucket.name === 'avatars')
      
      if (!avatarsBucket) {
        console.log('Creating avatars bucket...')
        const { error: bucketError } = await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
        })
        
        if (bucketError) {
          console.log('Bucket creation error (might already exist):', bucketError)
          // Continue anyway - bucket might already exist but not visible due to permissions
        }
      }

      // Upload the file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { 
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        
        // If bucket doesn't exist, try to create it and retry
        if (uploadError.message.includes('Bucket not found')) {
          console.log('Attempting to create avatars bucket...')
          await supabase.storage.createBucket('avatars', { public: true })
          
          // Retry upload
          const { data: retryData, error: retryError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, { 
              cacheControl: '3600',
              upsert: true
            })
          
          if (retryError) throw retryError
        } else {
          throw uploadError
        }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)
      
      const publicUrl = urlData.publicUrl

      // Update profile in database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)

      if (updateError) {
        console.error("Profile update error:", updateError)
        throw updateError
      }

      setAvatarUrl(publicUrl)
      toast.success("تم تحديث صورة الملف الشخصي بنجاح")
      
      // Refresh the page to show updated profile
      setTimeout(() => {
        router.refresh()
      }, 1000)

    } catch (error: any) {
      console.error("Error uploading avatar:", error)
      toast.error(`حدث خطأ أثناء رفع الصورة: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="الملف الشخصي">
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">يجب تسجيل الدخول لعرض الملف الشخصي</p>
            <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
              <Link href="/auth">تسجيل الدخول</Link>
            </Button>
          </div>
        </RetroWindow>
      </div>
    )
  }

  const stats = profile?.stats || {
    coursesEnrolled: 0,
    booksOwned: 0,
    consultations: 0,
    communityPoints: 0
  }

  const recentActivity = [
    { type: "book", title: `اشترى كتاب: أساسيات ${getMajorLabel(profile?.major)}`, date: "منذ يومين" },
    { type: "consultation", title: "حجز استشارة مع مختص", date: "منذ 3 أيام" },
    { type: "community", title: "أجاب على سؤال في المجتمع", date: "منذ أسبوع" },
    { type: "course", title: `انضم لمقرر: ${getMajorLabel(profile?.major)} المتقدم`, date: "منذ أسبوعين" },
  ]

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <RetroWindow title="الملف الشخصي">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center text-center">
                <img
                  src={avatarUrl || profile?.avatar_url || "/diverse-user-avatars.png"}
                  alt="صورة المستخدم"
                  className="w-32 h-32 border-2 border-gray-300 mb-4 object-cover rounded"
                  style={{ background: "var(--panel)" }}
                />

                {/* Input مخفي */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />

                <Button
                  size="sm"
                  className="retro-button mb-2"
                  style={{ background: "var(--accent)", color: "white" }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 ml-1" />
                  {isUploading ? "جاري الرفع..." : "تغيير الصورة"}
                </Button>
              </div>

              {/* User Details */}
              <div className="flex-1">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                      {profile?.name || "مستخدم"}
                    </h2>
                    <p className="text-gray-600 mb-1">{user?.email}</p>
                    <p className="text-gray-600 mb-1">{profile?.university || "غير محدد"}</p>
                    <p className="text-gray-600 mb-4">تخصص: {getMajorLabel(profile?.major)}</p>
                  </div>

                  <div>
                    <div className="mb-4">
                      <span className="text-sm text-gray-600">نوع الاشتراك: </span>
                      <span
                        className="font-bold px-2 py-1 text-xs rounded"
                        style={{ background: "var(--accent)", color: "white" }}
                      >
                        {getTierLabel(profile?.subscription_tier)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                    <Link href="/profile/edit">
                      <Edit className="w-4 h-4 ml-1" />
                      تعديل الملف
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="retro-button bg-transparent">
                    <Link href="/settings">
                      <Settings className="w-4 h-4 ml-1" />
                      الإعدادات
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </RetroWindow>

        {/* Statistics */}
        <div className="mt-6">
          <RetroWindow title="الإحصائيات">
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="retro-window bg-white p-4">
                    <BookOpen className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--primary)" }} />
                    <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                      {stats.coursesEnrolled || 0}
                    </div>
                    <div className="text-sm text-gray-600">المقررات المسجلة</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="retro-window bg-white p-4">
                    <BookOpen className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--accent)" }} />
                    <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                      {stats.booksOwned || 0}
                    </div>
                    <div className="text-sm text-gray-600">الكتب المملوكة</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="retro-window bg-white p-4">
                    <Users className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--primary)" }} />
                    <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                      {stats.consultations || 0}
                    </div>
                    <div className="text-sm text-gray-600">الاستشارات</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="retro-window bg-white p-4">
                    <Award className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--accent)" }} />
                    <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                      {stats.communityPoints || 0}
                    </div>
                    <div className="text-sm text-gray-600">نقاط المجتمع</div>
                  </div>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <RetroWindow title="النشاط الأخير">
            <div className="p-6">
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="retro-window bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {activity.type === "book" && (
                          <BookOpen className="w-5 h-5" style={{ color: "var(--primary)" }} />
                        )}
                        {activity.type === "consultation" && (
                          <Users className="w-5 h-5" style={{ color: "var(--accent)" }} />
                        )}
                        {activity.type === "community" && (
                          <Award className="w-5 h-5" style={{ color: "var(--primary)" }} />
                        )}
                        {activity.type === "course" && (
                          <Calendar className="w-5 h-5" style={{ color: "var(--accent)" }} />
                        )}
                        <span className="font-medium" style={{ color: "var(--ink)" }}>
                          {activity.title}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{activity.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-4">
                <Button asChild variant="outline" className="retro-button bg-transparent">
                  <Link href="/profile/activity">عرض جميع الأنشطة</Link>
                </Button>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <RetroWindow title="إجراءات سريعة">
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  asChild
                  className="retro-button h-auto p-4 flex flex-col items-center gap-2"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  <Link href="/dashboard">
                    <Settings className="w-6 h-6" />
                    <span>لوحة التحكم</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="retro-button h-auto p-4 flex flex-col items-center gap-2"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  <Link href="/market">
                    <BookOpen className="w-6 h-6" />
                    <span>تصفح الكتب</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="retro-button h-auto p-4 flex flex-col items-center gap-2"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  <Link href="/ambassadors">
                    <Users className="w-6 h-6" />
                    <span>احجز استشارة</span>
                  </Link>
                </Button>
              </div>
            </div>
          </RetroWindow>
        </div>
      </div>
    </div>
  )
}