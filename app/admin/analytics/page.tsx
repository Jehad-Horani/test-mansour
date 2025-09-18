"use client"

import { RetroWindow } from "@/components/retro-window"

export default function AnalyticsPage() {
  // Mock analytics data
  const analyticsData = {
    overview: {
      totalUsers: 1247,
      activeUsers: 892,
      newUsersThisMonth: 156,
      totalContent: 3456,
      approvedContent: 3123,
      pendingContent: 23,
      rejectedContent: 310,
    },
    userGrowth: [
      { month: "سبتمبر", users: 450 },
      { month: "أكتوبر", users: 678 },
      { month: "نوفمبر", users: 834 },
      { month: "ديسمبر", users: 1089 },
      { month: "يناير", users: 1247 },
    ],
    contentStats: {
      byMajor: {
        law: 1234,
        it: 987,
        medical: 765,
        business: 470,
      },
      byType: {
        files: 1890,
        questions: 876,
        posts: 456,
        books: 234,
      },
    },
    engagement: {
      dailyActiveUsers: 234,
      averageSessionTime: "12 دقيقة",
      pageViews: 15678,
      bounceRate: "23%",
    },
  }

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <RetroWindow title="الإحصائيات والتحليلات">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-black">إحصائيات المنصة</h2>
              <p className="text-sm text-gray-600">تحليل شامل لأداء المنصة واستخدام المستخدمين</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 border border-gray-400 bg-white">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analyticsData.overview.totalUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">إجمالي المستخدمين</div>
                  <div className="text-xs text-green-600 mt-1">
                    +{analyticsData.overview.newUsersThisMonth} هذا الشهر
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-400 bg-white">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analyticsData.overview.activeUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">المستخدمون النشطون</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {Math.round((analyticsData.overview.activeUsers / analyticsData.overview.totalUsers) * 100)}% من
                    الإجمالي
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-400 bg-white">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {analyticsData.overview.totalContent.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">إجمالي المحتوى</div>
                  <div className="text-xs text-orange-600 mt-1">
                    {analyticsData.overview.pendingContent} في الانتظار
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-400 bg-white">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{analyticsData.engagement.dailyActiveUsers}</div>
                  <div className="text-sm text-gray-600">نشط يومياً</div>
                  <div className="text-xs text-gray-600 mt-1">
                    متوسط الجلسة: {analyticsData.engagement.averageSessionTime}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <RetroWindow title="نمو المستخدمين">
                <div className="p-4">
                  <div className="space-y-3">
                    {analyticsData.userGrowth.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-black">{data.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 h-4 border border-gray-400">
                            <div className="h-full bg-blue-500" style={{ width: `${(data.users / 1400) * 100}%` }} />
                          </div>
                          <span className="text-sm text-black w-12 text-left">{data.users}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </RetroWindow>

              {/* Content by Major */}
              <RetroWindow title="المحتوى حسب التخصص">
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black">القانون</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 h-4 border border-gray-400">
                          <div className="h-full bg-yellow-500" style={{ width: "85%" }} />
                        </div>
                        <span className="text-sm text-black w-12 text-left">
                          {analyticsData.contentStats.byMajor.law}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black">تقنية المعلومات</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 h-4 border border-gray-400">
                          <div className="h-full bg-green-500" style={{ width: "68%" }} />
                        </div>
                        <span className="text-sm text-black w-12 text-left">
                          {analyticsData.contentStats.byMajor.it}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black">الطب</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 h-4 border border-gray-400">
                          <div className="h-full bg-pink-500" style={{ width: "53%" }} />
                        </div>
                        <span className="text-sm text-black w-12 text-left">
                          {analyticsData.contentStats.byMajor.medical}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black">إدارة الأعمال</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 h-4 border border-gray-400">
                          <div className="h-full bg-purple-500" style={{ width: "32%" }} />
                        </div>
                        <span className="text-sm text-black w-12 text-left">
                          {analyticsData.contentStats.byMajor.business}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </RetroWindow>

              {/* Content Types */}
              <RetroWindow title="أنواع المحتوى">
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black">ملفات</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 h-4 border border-gray-400">
                          <div className="h-full bg-blue-500" style={{ width: "95%" }} />
                        </div>
                        <span className="text-sm text-black w-12 text-left">
                          {analyticsData.contentStats.byType.files}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black">أسئلة</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 h-4 border border-gray-400">
                          <div className="h-full bg-green-500" style={{ width: "44%" }} />
                        </div>
                        <span className="text-sm text-black w-12 text-left">
                          {analyticsData.contentStats.byType.questions}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black">منشورات</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 h-4 border border-gray-400">
                          <div className="h-full bg-orange-500" style={{ width: "23%" }} />
                        </div>
                        <span className="text-sm text-black w-12 text-left">
                          {analyticsData.contentStats.byType.posts}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black">كتب</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 h-4 border border-gray-400">
                          <div className="h-full bg-purple-500" style={{ width: "12%" }} />
                        </div>
                        <span className="text-sm text-black w-12 text-left">
                          {analyticsData.contentStats.byType.books}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </RetroWindow>

              {/* Engagement Metrics */}
              <RetroWindow title="مقاييس التفاعل">
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-300">
                      <span className="text-sm font-medium text-black">مشاهدات الصفحة</span>
                      <span className="text-lg font-bold text-blue-600">
                        {analyticsData.engagement.pageViews.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-300">
                      <span className="text-sm font-medium text-black">متوسط وقت الجلسة</span>
                      <span className="text-lg font-bold text-green-600">
                        {analyticsData.engagement.averageSessionTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-300">
                      <span className="text-sm font-medium text-black">معدل الارتداد</span>
                      <span className="text-lg font-bold text-orange-600">{analyticsData.engagement.bounceRate}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-300">
                      <span className="text-sm font-medium text-black">المستخدمون النشطون يومياً</span>
                      <span className="text-lg font-bold text-purple-600">
                        {analyticsData.engagement.dailyActiveUsers}
                      </span>
                    </div>
                  </div>
                </div>
              </RetroWindow>
            </div>

            {/* Export Options */}
            <div className="mt-6 flex items-center gap-4">
              <button className="retro-button bg-blue-500 text-white px-4 py-2 hover:bg-blue-600">
                تصدير تقرير PDF
              </button>
              <button className="retro-button bg-green-500 text-white px-4 py-2 hover:bg-green-600">
                تصدير بيانات CSV
              </button>
              <button className="retro-button bg-purple-500 text-white px-4 py-2 hover:bg-purple-600">
                جدولة تقرير شهري
              </button>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
