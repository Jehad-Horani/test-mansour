"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import { AvatarUpload } from "@/app/components/avatar-upload"
import Link from "next/link"
import { Edit, Settings, BookOpen, Users, Award, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const { user, isLoggedIn, getTierLabel, getMajorLabel, profile } = useAuth()
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(profile?.avatar_url || "")

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

  const handleAvatarUpload = (newAvatarUrl: string) => {
    setCurrentAvatarUrl(newAvatarUrl)
    alert("✅ تم تحديث الصورة الشخصية بنجاح")
  }

  const stats = profile?.stats || {
    coursesEnrolled: 0,
    booksOwned: 0,
    consultations: 0,
    communityPoints: 0
  }

  const recentActivity = [
    { type: "book", title: `اشترى كتاب: أساسيات ${getMajorLabel(profile?.major)}`, date: "منذ يومين" },
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
                {user && (
                  <AvatarUpload
                    currentAvatarUrl={currentAvatarUrl}
                    userId={user.id}
                    userName={profile?.name || "مستخدم"}
                    onAvatarUpdate={handleAvatarUpload}
                    size="lg"
                  />
                )}
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
                      <span className="font-bold px-2 py-1 text-xs rounded" style={{ background: "var(--accent)", color: "white" }}>
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
                    <span>السفراء</span>
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
