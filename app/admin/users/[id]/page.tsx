"use client"

import { useState } from "react"
import { RetroWindow } from "@/components/retro-window"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Edit, Ban, Shield, Mail, Phone, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminUserDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const user = {
    id: params.id,
    name: "أحمد محمد علي",
    email: "ahmed@example.com",
    phone: "+962791234567",
    university: "الجامعة الأردنية",
    major: "القانون",
    year: "السنة الثالثة",
    joinDate: "2024-01-10",
    lastLogin: "2024-01-15 14:30:00",
    status: "active",
    role: "student",
    totalOrders: 12,
    totalSpent: 450,
    averageRating: 4.8,
  }

  const userActivity = [
    { action: "تسجيل دخول", timestamp: "2024-01-15 14:30:00", details: "من الأردن" },
    { action: "شراء كتاب", timestamp: "2024-01-15 10:15:00", details: "كتاب القانون الدستوري" },
    { action: "إضافة سؤال", timestamp: "2024-01-14 16:20:00", details: "في مجتمع القانون" },
    { action: "تقييم كتاب", timestamp: "2024-01-14 09:45:00", details: "تقييم 5 نجوم" },
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  const handleBanUser = () => {
    if (confirm("هل أنت متأكد من حظر هذا المستخدم؟")) {
      // Ban user logic here
    }
  }

  const handleMakeAdmin = () => {
    if (confirm("هل أنت متأكد من منح صلاحيات الإدارة لهذا المستخدم؟")) {
      // Make admin logic here
    }
  }

  return (
    <div className="p-6">
      <RetroWindow title={`المستخدم #${params.id}`} className="w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.back()}
                className="retro-button"
                style={{ background: "var(--panel)", color: "var(--ink)" }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "var(--ink)" }}>
                  تفاصيل المستخدم
                </h1>
                <p className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                  إدارة وتعديل معلومات المستخدم
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="retro-button"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل
                  </Button>
                  <Button
                    onClick={handleMakeAdmin}
                    className="retro-button"
                    style={{ background: "var(--accent)", color: "white" }}
                  >
                    <Shield className="w-4 h-4 ml-2" />
                    جعل مدير
                  </Button>
                  <Button
                    onClick={handleBanUser}
                    className="retro-button"
                    style={{ background: "#dc2626", color: "white" }}
                  >
                    <Ban className="w-4 h-4 ml-2" />
                    حظر
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="retro-button"
                    style={{ background: "var(--accent)", color: "white" }}
                  >
                    حفظ
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="retro-button"
                    style={{ background: "var(--panel)", color: "var(--ink)" }}
                  >
                    إلغاء
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <div className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                {user.totalOrders}
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                إجمالي الطلبات
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                {user.totalSpent} د.أ
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                إجمالي الإنفاق
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <div className="text-2xl font-bold" style={{ color: "#f59e0b" }}>
                {user.averageRating}
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                متوسط التقييم
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  الاسم الكامل
                </label>
                {isEditing ? (
                  <Input defaultValue={user.name} className="retro-input" />
                ) : (
                  <div
                    className="p-2 flex items-center gap-2"
                    style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
                  >
                    <span>{user.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  البريد الإلكتروني
                </label>
                {isEditing ? (
                  <Input type="email" defaultValue={user.email} className="retro-input" />
                ) : (
                  <div
                    className="p-2 flex items-center gap-2"
                    style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
                  >
                    <Mail className="w-4 h-4" style={{ color: "var(--primary)" }} />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  رقم الهاتف
                </label>
                {isEditing ? (
                  <Input defaultValue={user.phone} className="retro-input" />
                ) : (
                  <div
                    className="p-2 flex items-center gap-2"
                    style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
                  >
                    <Phone className="w-4 h-4" style={{ color: "var(--primary)" }} />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  الجامعة
                </label>
                {isEditing ? (
                  <select className="retro-input w-full" defaultValue={user.university}>
                    <option value="الجامعة الأردنية">الجامعة الأردنية</option>
                    <option value="جامعة العلوم والتكنولوجيا">جامعة العلوم والتكنولوجيا</option>
                    <option value="جامعة اليرموك">جامعة اليرموك</option>
                  </select>
                ) : (
                  <div className="p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                    {user.university}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  التخصص
                </label>
                {isEditing ? (
                  <select className="retro-input w-full" defaultValue={user.major}>
                    <option value="القانون">القانون</option>
                    <option value="تكنولوجيا المعلومات">تكنولوجيا المعلومات</option>
                    <option value="إدارة الأعمال">إدارة الأعمال</option>
                  </select>
                ) : (
                  <div className="p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                    {user.major}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  السنة الدراسية
                </label>
                {isEditing ? (
                  <select className="retro-input w-full" defaultValue={user.year}>
                    <option value="السنة الأولى">السنة الأولى</option>
                    <option value="السنة الثانية">السنة الثانية</option>
                    <option value="السنة الثالثة">السنة الثالثة</option>
                    <option value="السنة الرابعة">السنة الرابعة</option>
                  </select>
                ) : (
                  <div className="p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                    {user.year}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  تاريخ التسجيل
                </label>
                <div
                  className="p-2 flex items-center gap-2"
                  style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
                >
                  <Calendar className="w-4 h-4" style={{ color: "var(--primary)" }} />
                  <span>{user.joinDate}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  آخر تسجيل دخول
                </label>
                <div className="p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                  {user.lastLogin}
                </div>
              </div>
            </div>
          </div>

          {/* User Activity */}
          <div className="p-4" style={{ background: "var(--bg)", border: "2px inset var(--border)" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
              النشاط الأخير
            </h3>
            <div className="space-y-3">
              {userActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3"
                  style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
                >
                  <div>
                    <div className="font-medium" style={{ color: "var(--ink)" }}>
                      {activity.action}
                    </div>
                    <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                      {activity.details}
                    </div>
                  </div>
                  <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.6 }}>
                    {activity.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RetroWindow>
    </div>
  )
}
