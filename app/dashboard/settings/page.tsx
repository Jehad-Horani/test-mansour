"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RetroWindow } from "@/components/retro-window"
import { PixelIcon } from "@/components/pixel-icon"
import { useAuth } from "@/hooks/use-auth"
import { createBrowserClient } from "@/app/lib/supabase/client"
import Link from "next/link"
import RetroToggle from "@/components/retro-toggle"

interface UserSettings {
  id: string
  email_notifications: boolean
  push_notifications: boolean
  marketing_emails: boolean
  language: string
  timezone: string
  theme: string
  privacy_level: string
  auto_save: boolean
  show_online_status: boolean
  allow_friend_requests: boolean
  created_at: string
  updated_at: string
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("notifications")

  const supabase = createBrowserClient()

  useEffect(() => {
    if (user) {
      fetchSettings()
    }
  }, [user])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("user_settings").select("*").eq("id", user?.id).single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (data) {
        setSettings(data)
      } else {
        // Create default settings if none exist
        const defaultSettings: Partial<UserSettings> = {
          id: user?.id,
          email_notifications: true,
          push_notifications: true,
          marketing_emails: false,
          language: "ar",
          timezone: "Asia/Amman",
          theme: "retro",
          privacy_level: "public",
          auto_save: true,
          show_online_status: true,
          allow_friend_requests: true,
        }
        await createSettings(defaultSettings)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const createSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const { data, error } = await supabase.from("user_settings").insert([newSettings]).select().single()

      if (error) throw error
      setSettings(data)
    } catch (error) {
      console.error("Error creating settings:", error)
    }
  }

  const updateSettings = async (updates: Partial<UserSettings>) => {
    setSaving(true)
    try {
      const { error } = await supabase.from("user_settings").update(updates).eq("id", user?.id)

      if (error) throw error

      setSettings((prev) => (prev ? { ...prev, ...updates } : null))
      alert("تم حفظ الإعدادات بنجاح!")
    } catch (error) {
      console.error("Error updating settings:", error)
      alert("حدث خطأ أثناء حفظ الإعدادات")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      <RetroToggle />

      {/* Header */}
      <section className="retro-window mx-4 mt-4 mb-6">
        <div className="retro-window-title">
          <span>الإعدادات - تخصيص تجربتك على المنصة</span>
        </div>
        <div className="p-4">
          <Link href="/dashboard" className="retro-button inline-block mb-4">
            ← العودة للوحة التحكم
          </Link>
        </div>
      </section>

      <div className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <RetroWindow title="الإعدادات">
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">جاري تحميل الإعدادات...</p>
              </div>
            </RetroWindow>
          ) : !settings ? (
            <RetroWindow title="الإعدادات">
              <div className="p-8 text-center">
                <PixelIcon type="settings" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">لم يتم العثور على الإعدادات</p>
              </div>
            </RetroWindow>
          ) : (
            <>
              {/* Settings Header */}
              <RetroWindow title="إعدادات الحساب" className="mb-6">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <PixelIcon type="settings" className="w-6 h-6" style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold" style={{ color: "var(--ink)" }}>
                      إعدادات الحساب
                    </h1>
                    <p className="text-gray-600 text-sm">قم بتخصيص تجربتك على المنصة</p>
                  </div>
                </div>
              </RetroWindow>

              {/* Settings Tabs */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                {[
                  { id: "notifications", label: "الإشعارات", icon: "bell" },
                  { id: "appearance", label: "المظهر", icon: "palette" },
                  { id: "privacy", label: "الخصوصية", icon: "shield" },
                  { id: "advanced", label: "متقدم", icon: "settings" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`retro-button p-4 text-center ${
                      activeTab === tab.id ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-sm font-semibold">{tab.label}</div>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "notifications" && (
                <RetroWindow title="إعدادات الإشعارات">
                  <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <div className="font-semibold" style={{ color: "var(--ink)" }}>
                          إشعارات البريد الإلكتروني
                        </div>
                        <p className="text-sm text-gray-600">استلام إشعارات مهمة عبر البريد الإلكتروني</p>
                      </div>
                      <Switch
                        checked={settings.email_notifications}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => (prev ? { ...prev, email_notifications: checked } : null))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <div className="font-semibold" style={{ color: "var(--ink)" }}>
                          الإشعارات الفورية
                        </div>
                        <p className="text-sm text-gray-600">استلام إشعارات فورية في المتصفح</p>
                      </div>
                      <Switch
                        checked={settings.push_notifications}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => (prev ? { ...prev, push_notifications: checked } : null))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <div className="font-semibold" style={{ color: "var(--ink)" }}>
                          رسائل تسويقية
                        </div>
                        <p className="text-sm text-gray-600">استلام عروض وأخبار المنصة</p>
                      </div>
                      <Switch
                        checked={settings.marketing_emails}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => (prev ? { ...prev, marketing_emails: checked } : null))
                        }
                      />
                    </div>

                    <Button
                      onClick={() =>
                        updateSettings({
                          email_notifications: settings.email_notifications,
                          push_notifications: settings.push_notifications,
                          marketing_emails: settings.marketing_emails,
                        })
                      }
                      disabled={saving}
                      className="retro-button w-full"
                      style={{ background: "var(--primary)", color: "white" }}
                    >
                      {saving ? "جاري الحفظ..." : "حفظ إعدادات الإشعارات"}
                    </Button>
                  </div>
                </RetroWindow>
              )}

              {activeTab === "appearance" && (
                <RetroWindow title="إعدادات المظهر">
                  <div className="space-y-6 p-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">المظهر</Label>
                      <Select
                        value={settings.theme || "retro"}
                        onValueChange={(value) => setSettings((prev) => (prev ? { ...prev, theme: value } : null))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المظهر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retro">ريترو (افتراضي)</SelectItem>
                          <SelectItem value="modern">عصري</SelectItem>
                          <SelectItem value="dark">داكن</SelectItem>
                          <SelectItem value="light">فاتح</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">اللغة</Label>
                      <Select
                        value={settings.language || "ar"}
                        onValueChange={(value) => setSettings((prev) => (prev ? { ...prev, language: value } : null))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر اللغة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">المنطقة الزمنية</Label>
                      <Select
                        value={settings.timezone || "Asia/Amman"}
                        onValueChange={(value) => setSettings((prev) => (prev ? { ...prev, timezone: value } : null))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المنطقة الزمنية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Amman">عمان (GMT+3)</SelectItem>
                          <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                          <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                          <SelectItem value="Africa/Cairo">القاهرة (GMT+2)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={() =>
                        updateSettings({
                          theme: settings.theme,
                          language: settings.language,
                          timezone: settings.timezone,
                        })
                      }
                      disabled={saving}
                      className="retro-button w-full"
                      style={{ background: "var(--primary)", color: "white" }}
                    >
                      {saving ? "جاري الحفظ..." : "حفظ إعدادات المظهر"}
                    </Button>
                  </div>
                </RetroWindow>
              )}

              {activeTab === "privacy" && (
                <RetroWindow title="إعدادات الخصوصية">
                  <div className="space-y-6 p-6">
                    <div className="space-y-2">
                      <Label htmlFor="privacy_level">مستوى الخصوصية</Label>
                      <Select
                        value={settings.privacy_level || "public"}
                        onValueChange={(value) =>
                          setSettings((prev) => (prev ? { ...prev, privacy_level: value } : null))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مستوى الخصوصية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">عام - يمكن للجميع رؤية ملفك</SelectItem>
                          <SelectItem value="friends">الأصدقاء فقط</SelectItem>
                          <SelectItem value="private">خاص - لا يمكن لأحد رؤية ملفك</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <div className="font-semibold" style={{ color: "var(--ink)" }}>
                          إظهار الحالة الإلكترونية
                        </div>
                        <p className="text-sm text-gray-600">السماح للآخرين برؤية ما إذا كنت متصلاً</p>
                      </div>
                      <Switch
                        checked={settings.show_online_status}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => (prev ? { ...prev, show_online_status: checked } : null))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <div className="font-semibold" style={{ color: "var(--ink)" }}>
                          السماح بطلبات الصداقة
                        </div>
                        <p className="text-sm text-gray-600">السماح للمستخدمين الآخرين بإرسال طلبات صداقة</p>
                      </div>
                      <Switch
                        checked={settings.allow_friend_requests}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => (prev ? { ...prev, allow_friend_requests: checked } : null))
                        }
                      />
                    </div>

                    <Button
                      onClick={() =>
                        updateSettings({
                          privacy_level: settings.privacy_level,
                          show_online_status: settings.show_online_status,
                          allow_friend_requests: settings.allow_friend_requests,
                        })
                      }
                      disabled={saving}
                      className="retro-button w-full"
                      style={{ background: "var(--primary)", color: "white" }}
                    >
                      {saving ? "جاري الحفظ..." : "حفظ إعدادات الخصوصية"}
                    </Button>
                  </div>
                </RetroWindow>
              )}

              {activeTab === "advanced" && (
                <RetroWindow title="الإعدادات المتقدمة">
                  <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <div className="font-semibold" style={{ color: "var(--ink)" }}>
                          الحفظ التلقائي
                        </div>
                        <p className="text-sm text-gray-600">حفظ التغييرات تلقائياً أثناء الكتابة</p>
                      </div>
                      <Switch
                        checked={settings.auto_save}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => (prev ? { ...prev, auto_save: checked } : null))
                        }
                      />
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">تصدير البيانات</h4>
                      <p className="text-sm text-blue-700 mb-4">تحميل نسخة من جميع بياناتك الشخصية</p>
                      <Button
                        variant="outline"
                        className="retro-button bg-transparent"
                        onClick={() => {
                          // TODO: Implement data export
                          alert("سيتم إرسال رابط تحميل البيانات إلى بريدك الإلكتروني")
                        }}
                      >
                        طلب تصدير البيانات
                      </Button>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">مسح ذاكرة التخزين المؤقت</h4>
                      <p className="text-sm text-gray-700 mb-4">مسح البيانات المحفوظة محلياً لحل مشاكل الأداء</p>
                      <Button
                        variant="outline"
                        className="retro-button bg-transparent"
                        onClick={() => {
                          localStorage.clear()
                          sessionStorage.clear()
                          alert("تم مسح ذاكرة التخزين المؤقت بنجاح")
                          window.location.reload()
                        }}
                      >
                        مسح ذاكرة التخزين
                      </Button>
                    </div>

                    <Button
                      onClick={() =>
                        updateSettings({
                          auto_save: settings.auto_save,
                        })
                      }
                      disabled={saving}
                      className="retro-button w-full"
                      style={{ background: "var(--primary)", color: "white" }}
                    >
                      {saving ? "جاري الحفظ..." : "حفظ الإعدادات المتقدمة"}
                    </Button>
                  </div>
                </RetroWindow>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
