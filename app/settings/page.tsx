"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import { Switch } from "@/app/components/ui/switch"
import { Badge } from "@/app/components/ui/badge"
import Link from "next/link"
import { User, Bell, Shield, CreditCard, GraduationCap, ArrowRight, Save, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { user, profile, isLoggedIn } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("account")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [settings, setSettings] = useState({
    // Account settings
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
    examReminders: true,

    // Privacy settings
    showEmail: false,
    showPhone: false,
    allowMessages: true,

    // Academic settings
    university: "",
    major: "",
    graduationYear: "",
    studyLevel: "",

    language: "ar",
    timezone: "Asia/Riyadh",
  })

  // Load current profile data
  useEffect(() => {
    if (profile && user) {
      setSettings(prev => ({
        ...prev,
        name: profile.name || "",
        email: user.email || "",
        phone: profile.phone || "",
        university: profile.university || "",
        major: profile.major || "",
        graduationYear: profile.graduation_year || "",
        studyLevel: profile.study_level || "",
        // Load preferences if available
        emailNotifications: profile.preferences?.emailNotifications ?? true,
        pushNotifications: profile.preferences?.pushNotifications ?? true,
        language: profile.preferences?.language ?? "ar",
      }))
    }
  }, [profile, user])

  const tabs = [
    { id: "account", label: "الحساب", icon: User },
    { id: "subscription", label: "الاشتراك", icon: CreditCard },
    { id: "academic", label: "الأكاديمي", icon: GraduationCap },
  ]

  const handleSave = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً")
      return
    }

    setLoading(true)
    try {
      // Update profile information - ensure data types are correct
      const profileUpdates = {
        name: settings.name?.trim() || '',
        phone: settings.phone?.trim() || null,
        university: settings.university?.trim() || null, // TEXT not array
        major: settings.major || null,
        graduation_year: settings.graduationYear?.trim() || null,
        study_level: settings.studyLevel || '',
        preferences: {
          theme: "retro",
          language: settings.language || "ar",
          emailNotifications: settings.emailNotifications,
          pushNotifications: settings.pushNotifications,
          profileVisibility: "public"
        },
        updated_at: new Date().toISOString()
      }

      console.log('Saving settings with data:', profileUpdates)

      const { error: profileError } = await supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", user.id)

      if (profileError) throw profileError

      toast.success("تم حفظ الإعدادات بنجاح!")
    } catch (error: any) {
      console.error("Error saving settings:", error)
      toast.error("حدث خطأ أثناء حفظ الإعدادات")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!settings.newPassword || !settings.confirmPassword) {
      toast.error("يرجى إدخال كلمة المرور الجديدة وتأكيدها")
      return
    }

    if (settings.newPassword !== settings.confirmPassword) {
      toast.error("كلمة المرور الجديدة وتأكيدها غير متطابقين")
      return
    }

    if (settings.newPassword.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: settings.newPassword
      })

      if (error) throw error

      toast.success("تم تغيير كلمة المرور بنجاح")
      setSettings(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }))
    } catch (error: any) {
      console.error("Error changing password:", error)
      toast.error("حدث خطأ أثناء تغيير كلمة المرور")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.")) {
      return
    }

    if (!confirm("تأكيد نهائي: سيتم حذف جميع بياناتك نهائياً. هل تريد المتابعة؟")) {
      return
    }

    setLoading(true)
    try {
      // Note: In production, you might want to soft-delete or handle this server-side
      toast.info("سيتم حذف حسابك خلال 24 ساعة. يمكنك إلغاء العملية بتسجيل الدخول مرة أخرى.")

      // For now, just sign out
      await supabase.auth.signOut()
      router.push("/")
    } catch (error: any) {
      console.error("Error deleting account:", error)
      toast.error("حدث خطأ أثناء حذف الحساب")
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="الإعدادات">
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">يجب تسجيل الدخول لعرض الإعدادات</p>
            <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
              <Link href="/auth/login">تسجيل الدخول</Link>
            </Button>
          </div>
        </RetroWindow>
      </div>
    )
  }
const universities = [
  "جامعة العلوم التطبيقية الخاصة",
  "الجامعة الأردنية",
  "جامعة عمان الأهلية",
  "جامعة اليرموك",
  "جامعة مؤتة",
  "جامعة العلوم والتكنولوجيا الأردنية",
  "الجامعة الهاشمية",
  "جامعة آل البيت",
  "جامعة البلقاء التطبيقية",
  "جامعة الحسين بن طلال",
  "جامعة الطفيلة التقنية",
  "الجامعة الألمانية الأردنية",
  "جامعة فيلادلفيا",
  "جامعة الإسراء",
  "جامعة البترا",
  "جامعة الزيتونة الأردنية",
  "جامعة جرش",
  "جامعة إربد الأهلية",
  "جامعة الزرقاء",
  "جامعة الأميرة سمية للتكنولوجيا",
  "جامعة عمان العربية",
  "جامعة الشرق الأوسط",
  "جامعة جدارا",
  "الجامعة الأمريكية في مادبا",
  "جامعة عجلون الوطنية",
  "كلية الأونروا التربوية",
  "كلية عمون الجامعية التطبيقية",
  "الأكاديمية الأردنية للموسيقى",
  "جامعة العقبة للتكنولوجيا",
  "جامعة الحسين التقنية",
  "الجامعة العربية المفتوحة",
  "جامعة العلوم الإسلامية العالمية",
  "الجامعة الأردنية / فرع العقبة",
  "جامعة البلقاء التطبيقية / كلياتها",
  "جامعة الحسين بن طلال / كلية العلوم الطبية التطبيقية",
  "جامعة الطفيلة التقنية / كلية الهندسة"
];
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
                        className={`w-full flex items-center gap-3 p-3 text-right retro-button ${activeTab === tab.id ? "bg-blue-100 border-blue-300" : "bg-transparent hover:bg-gray-50"
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
                          disabled
                          className="retro-window"
                          style={{ background: "#f0f0f0", border: "2px inset #c0c0c0" }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                          رقم الهاتف
                        </label>
                        <Input
                          type="phone"
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
                      <div className="md:col-span-2">
                        <Button
                          onClick={handlePasswordChange}
                          className="retro-button"
                          style={{ background: "var(--accent)", color: "white" }}
                          disabled={loading}
                        >
                          تغيير كلمة المرور
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4 text-red-600">منطقة الخطر</h3>
                    <Button
                      onClick={handleDeleteAccount}
                      variant="outline"
                      className="retro-button text-red-600 border-red-600 bg-transparent"
                      disabled={loading}
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
                      {profile?.subscription_tier === 'premium' ? 'الخطة المميزة' :
                        profile?.subscription_tier === 'standard' ? 'الخطة القياسية' : 'الخطة المجانية'}
                    </Badge>
                    <p className="text-gray-600 mb-4">
                      {profile?.subscription_tier === 'free'
                        ? 'أنت تستخدم الخطة المجانية حالياً'
                        : 'اشتراكك نشط'}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="retro-window bg-white p-4">
                      <h4 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                        الخطة الحالية
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 mb-4">
                        {profile?.subscription_tier === 'free' ? (
                          <>
                            <li>✓ وصول محدود للكتب</li>
                            <li>✗ استشارات مع السفراء</li>
                            <li>✗ الجلسات الدراسية</li>
                            <li>✗ دعم فني متقدم</li>
                          </>
                        ) : (
                          <>
                            <li>✓ وصول لجميع الكتب</li>
                            <li>✓ استشارات مع السفراء</li>
                            <li>✓ الجلسات الدراسية</li>
                            <li>✓ دعم فني متقدم</li>
                          </>
                        )}
                      </ul>
                      <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                        {profile?.subscription_tier === 'free' ? 'مجاني' : '15 دينار/شهر'}
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
                      {profile?.subscription_tier !== 'free' && (
                        <Button
                          variant="outline"
                          className="w-full retro-button text-red-600 border-red-600 bg-transparent"
                        >
                          إلغاء الاشتراك
                        </Button>
                      )}
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
                        <option value="">اختر الجامعة</option>
                        {universities.map((uni) => (
                          <option key={uni} value={uni}>
                            {uni}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                        التخصص
                      </label>
                   
                       <Input
                        value={settings.major}
                        onChange={(e) => setSettings({ ...settings, major: e.target.value })}
                        className="w-full p-2 retro-window"
                        style={{ background: "white", border: "2px inset #c0c0c0" }}
                        placeholder="مثال : علم الحاسوب"
                      />
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
                        placeholder="مثال : 2027"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                        السنة الدراسية
                      </label>
                      <select
                        value={settings.studyLevel}
                        onChange={(e) => setSettings({ ...settings, studyLevel: e.target.value })}
                        className="w-full p-2 retro-window"
                        style={{ background: "white", border: "2px inset #c0c0c0" }}
                      >
                        <option value="">اختر السنة</option>
                        <option value="1">السنة الأولى</option>
                        <option value="2">السنة الثانية</option>
                        <option value="3">السنة الثالثة</option>
                        <option value="4">السنة الرابعة</option>
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
                disabled={loading}
              >
                <Save className="w-4 h-4 ml-1" />
                {loading ? "جاري الحفظ..." : "حفظ جميع الإعدادات"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}