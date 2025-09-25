"use client"

import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import Link from "next/link"
import { Edit, Settings, BookOpen, Users, Award, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const { user, isLoggedIn ,getTierLabel, getMajorLabel, profile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)




  const stats = profile?.stats

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
                  src={profile?.avatar_url || "/diverse-user-avatars.png"}
                  alt="صورة المستخدم"
                  className="w-32 h-32 border-2 border-gray-300 mb-4"
                  style={{ background: "var(--panel)" }}
                />
                <Button size="sm" className="retro-button mb-2" style={{ background: "var(--accent)", color: "white" }}>
                  <Edit className="w-4 h-4 ml-1" />
                  تغيير الصورة
                </Button>
              </div>

              {/* User Details */}
              <div className="flex-1">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                      {profile?.name}
                    </h2>
                    <p className="text-gray-600 mb-1">{user?.email}</p>
                    <p className="text-gray-600 mb-1">{profile?.university}</p>
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
                      {profile?.stats?.coursesEnrolled}
                    </div>
                    <div className="text-sm text-gray-600">المقررات المسجلة</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="retro-window bg-white p-4">
                    <BookOpen className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--accent)" }} />
                    <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                      {profile?.stats?.booksOwned}
                    </div>
                    <div className="text-sm text-gray-600">الكتب المملوكة</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="retro-window bg-white p-4">
                    <Users className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--primary)" }} />
                    <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                      {profile?.stats?.consultations}
                    </div>
                    <div className="text-sm text-gray-600">الاستشارات</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="retro-window bg-white p-4">
                    <Award className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--accent)" }} />
                    <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                      {profile?.stats?.communityPoints}
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
                  <Link href="/store">
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
