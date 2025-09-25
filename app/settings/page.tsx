"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import { Switch } from "@/app/components/ui/switch"
import { Badge } from "@/app/components/ui/badge"
import Link from "next/link"
import { User, Bell, Shield, CreditCard, GraduationCap, ArrowRight, Save, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    // Account settings
    name: "أحمد محمد السالم",
    email: "ahmed.salem@example.com",
    phone: "+966501234567",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
    examReminders: true,

    // Privacy settings - removed profileVisibility option, accounts are now automatically public
    showEmail: false,
    showPhone: false,
    allowMessages: true,

    // Academic settings
    university: "جامعة الملك سعود",
    major: "علوم الحاسب",
    graduationYear: "2025",
    studyLevel: "بكالوريوس",

    language: "ar",
    timezone: "Asia/Riyadh",
  })

  const tabs = [
    { id: "account", label: "الحساب", icon: User },
    { id: "subscription", label: "الاشتراك", icon: CreditCard },
    { id: "academic", label: "الأكاديمي", icon: GraduationCap },
  ]

  const handleSave = () => {
    console.log("Saving settings:", settings)
    alert("تم حفظ الإعدادات بنجاح!")
  }

  const handleDeleteAccount = () => {
    if (confirm("هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.")) {
      alert("سيتم حذف حسابك خلال 24 ساعة.")
    }
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="outline" className="retro-button bg-transparent mb-4">
            <Link href="/dashboard">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للوحة التحكم
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <RetroWindow title="الإعدادات">
              <div className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 p-3 text-right retro-button ${
                          activeTab === tab.id ? "bg-blue-100 border-blue-300" : "bg-transparent hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </RetroWindow>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {/* Account Settings */}
            {activeTab === "account" && (
              <RetroWindow title="إعدادات الحساب">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
                      المعلومات الشخصية
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                          الاسم الكامل
                        </label>
                        <Input
                          value={settings.name}
                          onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                          className="retro-window"
                          style={{ background: "white", border: "2px inset #c0c0c0" }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                          البريد الإلكتروني
                        </label>
                        <Input
                          type="email"
                          value={settings.email}
                          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                          className="retro-window"
                          style={{ background: "white", border: "2px inset #c0c0c0" }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                          رقم الهاتف
                        </label>
                        <Input
                          value={settings.phone}
                          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                          className="retro-window"
                          style={{ background: "white", border: "2px inset #c0c0c0" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
                      تغيير كلمة المرور
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                          كلمة المرور الحالية
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={settings.currentPassword}
                            onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                            className="retro-window pr-10"
                            style={{ background: "white", border: "2px inset #c0c0c0" }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                          كلمة المرور الجديدة
                        </label>
                        <Input
                          type="password"
                          value={settings.newPassword}
                          onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                          className="retro-window"
                          style={{ background: "white", border: "2px inset #c0c0c0" }}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                          تأكيد كلمة المرور الجديدة
                        </label>
                        <Input
                          type="password"
                          value={settings.confirmPassword}
                          onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                          className="retro-window"
                          style={{ background: "white", border: "2px inset #c0c0c0" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4 text-red-600">منطقة الخطر</h3>
                    <Button
                      onClick={handleDeleteAccount}
                      variant="outline"
                      className="retro-button text-red-600 border-red-600 bg-transparent"
                    >
                      حذف الحساب نهائياً
                    </Button>
                  </div>
                </div>
              </RetroWindow>
            )}

     

            {/* Subscription Settings */}
            {activeTab === "subscription" && (
              <RetroWindow title="إدارة الاشتراك">
                <div className="p-6 space-y-6">
                  <div className="text-center">
                    <Badge className="text-lg px-4 py-2 mb-4" style={{ background: "var(--accent)", color: "white" }}>
                      الخطة المميزة
                    </Badge>
                    <p className="text-gray-600 mb-4">اشتراكك نشط حتى 15 مارس 2024</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="retro-window bg-white p-4">
                      <h4 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                        الخطة الحالية
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 mb-4">
                        <li>✓ وصول لجميع الكتب</li>
                        <li>✓ استشارات مع السفراء</li>
                        <li>✓ الجلسات الدراسية</li>
                        <li>✓ دعم فني متقدم</li>
                      </ul>
                      <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                        20 ريال/شهر
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Button
                        asChild
                        className="w-full retro-button"
                        style={{ background: "var(--primary)", color: "white" }}
                      >
                        <Link href="/pricing">تغيير الخطة</Link>
                      </Button>
                      <Button variant="outline" className="w-full retro-button bg-transparent">
                        تحديث طريقة الدفع
                      </Button>
                      <Button variant="outline" className="w-full retro-button bg-transparent">
                        تحميل الفواتير
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full retro-button text-red-600 border-red-600 bg-transparent"
                      >
                        إلغاء الاشتراك
                      </Button>
                    </div>
                  </div>
                </div>
              </RetroWindow>
            )}

            {/* Academic Settings */}
            {activeTab === "academic" && (
              <RetroWindow title="الإعدادات الأكاديمية">
                <div className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                        الجامعة
                      </label>
                      <select
                        value={settings.university}
                        onChange={(e) => setSettings({ ...settings, university: e.target.value })}
                        className="w-full p-2 retro-window"
                        style={{ background: "white", border: "2px inset #c0c0c0" }}
                      >
                        <option>جامعة الملك سعود</option>
                        <option>جامعة الملك عبدالعزيز</option>
                        <option>جامعة الإمام محمد بن سعود</option>
                        <option>جامعة الملك فهد للبترول والمعادن</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                        التخصص
                      </label>
                      <select
                        value={settings.major}
                        onChange={(e) => setSettings({ ...settings, major: e.target.value })}
                        className="w-full p-2 retro-window"
                        style={{ background: "white", border: "2px inset #c0c0c0" }}
                      >
                        <option>علوم الحاسب</option>
                        <option>هندسة البرمجيات</option>
                        <option>القانون</option>
                        <option>الطب</option>
                        <option>إدارة الأعمال</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                        سنة التخرج المتوقعة
                      </label>
                      <Input
                        value={settings.graduationYear}
                        onChange={(e) => setSettings({ ...settings, graduationYear: e.target.value })}
                        className="retro-window"
                        style={{ background: "white", border: "2px inset #c0c0c0" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                        المستوى الدراسي
                      </label>
                      <select
                        value={settings.studyLevel}
                        onChange={(e) => setSettings({ ...settings, studyLevel: e.target.value })}
                        className="w-full p-2 retro-window"
                        style={{ background: "white", border: "2px inset #c0c0c0" }}
                      >
                        <option>بكالوريوس</option>
                        <option>ماجستير</option>
                        <option>دكتوراه</option>
                      </select>
                    </div>
                  </div>
                </div>
              </RetroWindow>
            )}

            {/* Save Button */}
            <div className="mt-6">
              <Button
                onClick={handleSave}
                className="retro-button w-full md:w-auto"
                style={{ background: "var(--primary)", color: "white" }}
              >
                <Save className="w-4 h-4 ml-1" />
                حفظ جميع الإعدادات
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
