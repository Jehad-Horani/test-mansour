import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import Link from "next/link"
import { ArrowRight, Bell, MessageSquare, Calendar, BookOpen } from "lucide-react"

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "exam",
      title: "تذكير: امتحان القانون المدني غداً",
      message: "امتحان القانون المدني مقرر غداً الساعة 9:00 صباحاً في قاعة 101",
      time: "منذ ساعتين",
      read: false,
    },
    {
      id: 2,
      type: "community",
      title: "إجابة جديدة على سؤالك",
      message: "أجاب د. أحمد العلي على سؤالك حول مبادئ القانون",
      time: "منذ 4 ساعات",
      read: false,
    },
    {
      id: 3,
      type: "upload",
      title: "تم قبول محاضرتك",
      message: "تم قبول محاضرة 'أساسيات البرمجة' ونشرها في المكتبة",
      time: "منذ يوم",
      read: true,
    },
    {
      id: 4,
      type: "session",
      title: "جلسة دراسية جديدة متاحة",
      message: "جلسة مراجعة القانون المدني متاحة للحجز - د. فاطمة أحمد",
      time: "منذ يومين",
      read: true,
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "exam":
        return <Calendar className="w-5 h-5" style={{ color: "var(--accent)" }} />
      case "community":
        return <MessageSquare className="w-5 h-5" style={{ color: "var(--primary)" }} />
      case "upload":
        return <BookOpen className="w-5 h-5" style={{ color: "var(--accent)" }} />
      case "session":
        return <Bell className="w-5 h-5" style={{ color: "var(--primary)" }} />
      default:
        return <Bell className="w-5 h-5" style={{ color: "var(--ink)" }} />
    }
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="outline" className="retro-button bg-transparent mb-4">
            <Link href="/dashboard">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للوحة التحكم
            </Link>
          </Button>
        </div>

        <RetroWindow title="الإشعارات">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "var(--ink)" }}>
                جميع الإشعارات
              </h2>
              <Button size="sm" variant="outline" className="retro-button bg-transparent">
                تحديد الكل كمقروء
              </Button>
            </div>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`retro-window p-4 ${!notification.read ? "bg-blue-50" : "bg-white"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold mb-1" style={{ color: "var(--ink)" }}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full mt-2" style={{ background: "var(--accent)" }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2 text-gray-600">لا توجد إشعارات</h3>
                <p className="text-gray-500">ستظهر إشعاراتك هنا عند وصولها</p>
              </div>
            )}
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
