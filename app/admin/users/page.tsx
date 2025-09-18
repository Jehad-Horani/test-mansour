"use client"

import { useState } from "react"
import Link from "next/link"
import { RetroWindow } from "@/app/components/retro-window"

interface UserData {
  id: string
  name: string
  email: string
  major: "law" | "it" | "medical" | "business"
  university: string
  year: string
  joinDate: string
  lastActive: string
  status: "active" | "suspended" | "inactive"
  subscription: {
    tier: "free" | "standard" | "premium"
    expiryDate?: string
  }
  stats: {
    uploadsCount: number
    viewsCount: number
    helpfulVotes: number
    communityPoints: number
  }
  avatar?: string
  phone?: string
  graduationYear?: string
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMajor, setSelectedMajor] = useState<"all" | "law" | "it" | "medical" | "business">("all")
  const [selectedTier, setSelectedTier] = useState<"all" | "free" | "standard" | "premium">("all")
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "suspended" | "inactive">("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showUserDetails, setShowUserDetails] = useState<string | null>(null)

  // Mock user data
  const mockUsers: UserData[] = [
    {
      id: "user-law-1",
      name: "أحمد محمد السالم",
      email: "ahmed.salem@example.com",
      major: "law",
      university: "جامعة الملك سعود",
      year: "السنة الثالثة",
      joinDate: "2023-09-15T10:00:00Z",
      lastActive: "2024-01-15T14:30:00Z",
      status: "active",
      subscription: {
        tier: "premium",
        expiryDate: "2024-03-15",
      },
      stats: {
        uploadsCount: 12,
        viewsCount: 340,
        helpfulVotes: 28,
        communityPoints: 340,
      },
      avatar: "/diverse-user-avatars.png",
      phone: "+966501234567",
      graduationYear: "2025",
    },
    {
      id: "user-it-1",
      name: "فاطمة عبدالله النمر",
      email: "fatima.alnamir@example.com",
      major: "it",
      university: "جامعة الملك فهد للبترول والمعادن",
      year: "السنة الثانية",
      joinDate: "2023-10-20T09:00:00Z",
      lastActive: "2024-01-15T16:45:00Z",
      status: "active",
      subscription: {
        tier: "standard",
        expiryDate: "2024-02-20",
      },
      stats: {
        uploadsCount: 8,
        viewsCount: 156,
        helpfulVotes: 15,
        communityPoints: 180,
      },
      avatar: "/diverse-user-avatars.png",
      phone: "+966502345678",
      graduationYear: "2026",
    },
    {
      id: "user-med-1",
      name: "نورا الشهري",
      email: "nora.alshahri@example.com",
      major: "medical",
      university: "جامعة الملك سعود",
      year: "السنة الرابعة",
      joinDate: "2023-08-10T11:00:00Z",
      lastActive: "2024-01-14T12:20:00Z",
      status: "active",
      subscription: {
        tier: "free",
      },
      stats: {
        uploadsCount: 5,
        viewsCount: 89,
        helpfulVotes: 12,
        communityPoints: 120,
      },
      avatar: "/diverse-user-avatars.png",
      phone: "+966503456789",
      graduationYear: "2025",
    },
    {
      id: "user-bus-1",
      name: "خالد الأحمد",
      email: "khalid.alahmad@example.com",
      major: "business",
      university: "جامعة الملك عبدالعزيز",
      year: "السنة الثالثة",
      joinDate: "2023-11-05T13:00:00Z",
      lastActive: "2024-01-10T10:15:00Z",
      status: "inactive",
      subscription: {
        tier: "premium",
        expiryDate: "2024-04-05",
      },
      stats: {
        uploadsCount: 15,
        viewsCount: 420,
        helpfulVotes: 35,
        communityPoints: 450,
      },
      avatar: "/diverse-user-avatars.png",
      phone: "+966504567890",
      graduationYear: "2025",
    },
    {
      id: "user-law-2",
      name: "سارة العتيبي",
      email: "sara.alotaibi@example.com",
      major: "law",
      university: "جامعة الإمام محمد بن سعود الإسلامية",
      year: "السنة الأولى",
      joinDate: "2024-01-01T08:00:00Z",
      lastActive: "2024-01-15T18:00:00Z",
      status: "suspended",
      subscription: {
        tier: "free",
      },
      stats: {
        uploadsCount: 2,
        viewsCount: 25,
        helpfulVotes: 3,
        communityPoints: 30,
      },
      avatar: "/diverse-user-avatars.png",
      phone: "+966505678901",
      graduationYear: "2028",
    },
  ]

  const filteredUsers = mockUsers.filter((user) => {
    const searchMatch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.university.toLowerCase().includes(searchTerm.toLowerCase())

    const majorMatch = selectedMajor === "all" || user.major === selectedMajor
    const tierMatch = selectedTier === "all" || user.subscription.tier === selectedTier
    const statusMatch = selectedStatus === "all" || user.status === selectedStatus

    return searchMatch && majorMatch && tierMatch && statusMatch
  })

  const handleUserAction = (userId: string, action: "suspend" | "activate" | "delete" | "message") => {
    console.log(`[v0] User action: ${action} for user: ${userId}`)
    // Here you would implement the actual user management actions
  }

  const handleBulkAction = (action: "suspend" | "activate" | "delete" | "message") => {
    console.log(`[v0] Bulk ${action} for users:`, selectedUsers)
    setSelectedUsers([])
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const getMajorLabel = (major: string) => {
    const labels = {
      law: "القانون",
      it: "تقنية المعلومات",
      medical: "الطب",
      business: "إدارة الأعمال",
    }
    return labels[major as keyof typeof labels] || major
  }

  const getTierLabel = (tier: string) => {
    const labels = {
      free: "مجاني",
      standard: "قياسي",
      premium: "مميز",
    }
    return labels[tier as keyof typeof labels] || tier
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      suspended: "bg-red-100 text-red-800",
      inactive: "bg-yellow-100 text-yellow-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTierColor = (tier: string) => {
    const colors = {
      free: "bg-gray-100 text-gray-800",
      standard: "bg-blue-100 text-blue-800",
      premium: "bg-purple-100 text-purple-800",
    }
    return colors[tier as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <RetroWindow title="إدارة المستخدمين">
          <div className="p-6">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <input
                    type="text"
                    placeholder="البحث بالاسم، البريد الإلكتروني، أو الجامعة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                  />
                </div>
                <button className="retro-button bg-blue-500 text-white px-4 py-2 hover:bg-blue-600">بحث</button>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-black">التخصص:</label>
                  <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value as any)}
                    className="px-3 py-1 border border-gray-400 bg-white text-black text-sm"
                  >
                    <option value="all">جميع التخصصات</option>
                    <option value="law">القانون</option>
                    <option value="it">تقنية المعلومات</option>
                    <option value="medical">الطب</option>
                    <option value="business">إدارة الأعمال</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-black">الاشتراك:</label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value as any)}
                    className="px-3 py-1 border border-gray-400 bg-white text-black text-sm"
                  >
                    <option value="all">جميع الاشتراكات</option>
                    <option value="free">مجاني</option>
                    <option value="standard">قياسي</option>
                    <option value="premium">مميز</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-black">الحالة:</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as any)}
                    className="px-3 py-1 border border-gray-400 bg-white text-black text-sm"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="suspended">موقوف</option>
                  </select>
                </div>
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200">
                  <span className="text-sm text-black">تم تحديد {selectedUsers.length} مستخدم</span>
                  <button
                    onClick={() => handleBulkAction("message")}
                    className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600"
                  >
                    إرسال رسالة
                  </button>
                  <button
                    onClick={() => handleBulkAction("suspend")}
                    className="retro-button bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600"
                  >
                    إيقاف
                  </button>
                  <button
                    onClick={() => handleBulkAction("activate")}
                    className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600"
                  >
                    تفعيل
                  </button>
                </div>
              )}
            </div>

            {/* Users List */}
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border border-gray-400 bg-white">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="mt-1"
                      />

                      <div className="w-12 h-12 bg-gray-200 border border-gray-400 flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs">صورة</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-black">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-600">
                              {getMajorLabel(user.major)} - {user.year}
                            </p>
                            <p className="text-sm text-gray-600">{user.university}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(user.status)}`}>
                              {user.status === "active" ? "نشط" : user.status === "suspended" ? "موقوف" : "غير نشط"}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded ${getTierColor(user.subscription.tier)}`}>
                              {getTierLabel(user.subscription.tier)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <strong>تاريخ الانضمام:</strong>
                            <br />
                            {new Date(user.joinDate).toLocaleDateString("ar-SA")}
                          </div>
                          <div>
                            <strong>آخر نشاط:</strong>
                            <br />
                            {new Date(user.lastActive).toLocaleDateString("ar-SA")}
                          </div>
                          <div>
                            <strong>الرفوعات:</strong>
                            <br />
                            {user.stats.uploadsCount}
                          </div>
                          <div>
                            <strong>النقاط:</strong>
                            <br />
                            {user.stats.communityPoints}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowUserDetails(showUserDetails === user.id ? null : user.id)}
                            className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600"
                          >
                            {showUserDetails === user.id ? "إخفاء التفاصيل" : "عرض التفاصيل"}
                          </button>

                          <Link
                            href={`/admin/users/${user.id}`}
                            className="retro-button bg-purple-500 text-white px-3 py-1 text-sm hover:bg-purple-600"
                          >
                            الملف الشخصي
                          </Link>

                          <button
                            onClick={() => handleUserAction(user.id, "message")}
                            className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600"
                          >
                            إرسال رسالة
                          </button>

                          {user.status === "active" ? (
                            <button
                              onClick={() => handleUserAction(user.id, "suspend")}
                              className="retro-button bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600"
                            >
                              إيقاف
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(user.id, "activate")}
                              className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600"
                            >
                              تفعيل
                            </button>
                          )}

                          <button
                            onClick={() => handleUserAction(user.id, "delete")}
                            className="retro-button bg-gray-500 text-white px-3 py-1 text-sm hover:bg-gray-600"
                          >
                            حذف
                          </button>
                        </div>

                        {/* Detailed View */}
                        {showUserDetails === user.id && (
                          <div className="mt-4 p-4 bg-gray-50 border border-gray-300">
                            <h4 className="font-semibold text-black mb-3">تفاصيل المستخدم</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>معرف المستخدم:</strong> {user.id}
                              </div>
                              <div>
                                <strong>رقم الهاتف:</strong> {user.phone || "غير محدد"}
                              </div>
                              <div>
                                <strong>سنة التخرج:</strong> {user.graduationYear || "غير محدد"}
                              </div>
                              <div>
                                <strong>عدد المشاهدات:</strong> {user.stats.viewsCount}
                              </div>
                              <div>
                                <strong>الأصوات المفيدة:</strong> {user.stats.helpfulVotes}
                              </div>
                              {user.subscription.expiryDate && (
                                <div>
                                  <strong>انتهاء الاشتراك:</strong>{" "}
                                  {new Date(user.subscription.expiryDate).toLocaleDateString("ar-SA")}
                                </div>
                              )}
                            </div>

                            <div className="mt-4">
                              <h5 className="font-medium text-black mb-2">إجراءات إضافية</h5>
                              <div className="flex gap-2">
                                <button className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600">
                                  تعديل الاشتراك
                                </button>
                                <button className="retro-button bg-purple-500 text-white px-3 py-1 text-sm hover:bg-purple-600">
                                  عرض النشاط
                                </button>
                                <button className="retro-button bg-orange-500 text-white px-3 py-1 text-sm hover:bg-orange-600">
                                  إعادة تعيين كلمة المرور
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-600">لا يوجد مستخدمون يطابقون المعايير المحددة</div>
            )}

            {/* Pagination would go here */}
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="retro-button bg-gray-500 text-white px-3 py-1 text-sm">السابق</button>
                <span className="px-3 py-1 bg-retro-accent text-white text-sm">1</span>
                <button className="retro-button bg-gray-500 text-white px-3 py-1 text-sm">2</button>
                <button className="retro-button bg-gray-500 text-white px-3 py-1 text-sm">3</button>
                <button className="retro-button bg-gray-500 text-white px-3 py-1 text-sm">التالي</button>
              </div>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
