"use client"

import { useState } from "react"
import { useUser } from "@/hooks/use-user"
import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { BookOpen, MessageSquare, ShoppingCart, Award, Clock } from "lucide-react"

export default function ProfileActivityPage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("all")

  const activities = [
    {
      id: 1,
      type: "course",
      title: "أكملت دورة القانون الدستوري",
      description: "حصلت على شهادة إتمام بدرجة ممتاز",
      date: "2024-01-15",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      id: 2,
      type: "purchase",
      title: "اشتريت كتاب أساسيات البرمجة",
      description: "من المتجر الأكاديمي",
      date: "2024-01-14",
      icon: ShoppingCart,
      color: "text-green-600",
    },
  
    {
      id: 4,
      type: "achievement",
      title: "حصلت على وسام الطالب المتميز",
      description: "لإكمال 5 دورات بدرجة ممتاز",
      date: "2024-01-12",
      icon: Award,
      color: "text-yellow-600",
    },
    {
      id: 5,
      type: "course",
      title: "بدأت دورة هياكل البيانات",
      description: "في تخصص علوم الحاسوب",
      date: "2024-01-10",
      icon: BookOpen,
      color: "text-blue-600",
    },
  ]

  const filteredActivities =
    activeTab === "all" ? activities : activities.filter((activity) => activity.type === activeTab)

  const tabs = [
    { id: "all", label: "جميع الأنشطة", count: activities.length },
    { id: "course", label: "الدورات", count: activities.filter((a) => a.type === "course").length },
    { id: "purchase", label: "المشتريات", count: activities.filter((a) => a.type === "purchase").length },
    { id: "achievement", label: "الإنجازات", count: activities.filter((a) => a.type === "achievement").length },
  ]

  return (
    <div className="min-h-screen bg-retro-bg p-4">
      <div className="max-w-4xl mx-auto">
        <RetroWindow title="نشاط الملف الشخصي">
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="retro-pane p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600">دورة مكتملة</div>
              </div>
              <div className="retro-pane p-4 text-center">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-600">كتاب مشترى</div>
              </div>
              <div className="retro-pane p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">25</div>
                <div className="text-sm text-gray-600">مشاركة مجتمعية</div>
              </div>
              <div className="retro-pane p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <div className="text-sm text-gray-600">وسام محقق</div>
              </div>
            </div>

            {/* Activity Tabs */}
            <div className="retro-pane p-1">
              <div className="flex flex-wrap gap-1">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className="retro-button text-sm"
                  >
                    {tab.label} ({tab.count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Activity List */}
            <div className="space-y-3">
              {filteredActivities.map((activity) => {
                const IconComponent = activity.icon
                return (
                  <div key={activity.id} className="retro-pane p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">{activity.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(activity.date).toLocaleDateString("ar-SA")}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-8 text-gray-500">لا توجد أنشطة في هذه الفئة</div>
            )}
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
