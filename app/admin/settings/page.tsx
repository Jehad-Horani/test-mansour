"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/contexts/user-context"
import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Switch } from "@/app/components/ui/switch"
import { 
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Globe,
  Shield,
  Mail,
  Upload,
  Users
} from "lucide-react"
import { toast } from "sonner"

interface SystemSettings {
  site_name: string
  site_description: string
  max_file_size: number
  allowed_file_types: string[]
  auto_approve_books: boolean
  auto_approve_summaries: boolean
  auto_approve_lectures: boolean
  maintenance_mode: boolean
  registration_enabled: boolean
  email_notifications: boolean
  max_cart_items: number
  support_email: string
  terms_version: string
  privacy_version: string
}

export default function AdminSettingsPage() {
  const { isLoggedIn, isAdmin } = useUserContext()
  const router = useRouter()
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      router.push('/')
      return
    }
    fetchSettings()
  }, [isLoggedIn, isAdmin, router])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      
      if (res.ok) {
        setSettings(data)
      } else {
        console.error("Error fetching settings:", data.error)
        toast.error("خطأ في جلب الإعدادات")
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    try {
      setSaving(true)
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`تم حفظ الإعدادات بنجاح (${data.summary.successful}/${data.summary.successful + data.summary.failed})`)
        if (data.summary.failed > 0) {
          console.warn("Some settings failed to save:", data.results.filter((r: any) => !r.success))
        }
      } else {
        console.error("Error saving settings:", data.error)
        toast.error("خطأ في حفظ الإعدادات")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("خطأ في الاتصال")
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  const updateFileTypes = (typesString: string) => {
    const types = typesString.split(',').map(t => t.trim()).filter(t => t.length > 0)
    updateSetting('allowed_file_types', types)
  }

  if (!isLoggedIn || !isAdmin()) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-retro-bg p-4">
        <div className="max-w-4xl mx-auto">
          <RetroWindow title="إعدادات النظام">
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <div className="text-gray-600">جاري تحميل الإعدادات...</div>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-retro-bg p-4">
        <div className="max-w-4xl mx-auto">
          <RetroWindow title="إعدادات النظام">
            <div className="p-8 text-center">
              <div className="text-gray-600 mb-4">فشل في تحميل الإعدادات</div>
              <Button onClick={fetchSettings} className="retro-button">
                إعادة المحاولة
              </Button>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-retro-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <RetroWindow title="إعدادات النظام">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-black flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  إعدادات النظام
                </h1>
                <div className="flex gap-2">
                  <Button 
                    onClick={fetchSettings}
                    variant="outline"
                    size="sm"
                    className="retro-button bg-transparent"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    تحديث
                  </Button>
                  <Button 
                    onClick={saveSettings}
                    disabled={saving}
                    size="sm"
                    className="retro-button bg-green-500 text-white hover:bg-green-600"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {saving ? 'جاري الحفظ...' : 'حفظ'}
                  </Button>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Site Settings */}
          <RetroWindow title="إعدادات الموقع">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">معلومات الموقع</h3>
              </div>

              <div>
                <Label htmlFor="site_name">اسم الموقع</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => updateSetting('site_name', e.target.value)}
                  placeholder="اسم الموقع"
                />
              </div>

              <div>
                <Label htmlFor="site_description">وصف الموقع</Label>
                <Input
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => updateSetting('site_description', e.target.value)}
                  placeholder="وصف الموقع"
                />
              </div>

              <div>
                <Label htmlFor="support_email">بريد الدعم الفني</Label>
                <Input
                  id="support_email"
                  type="email"
                  value={settings.support_email}
                  onChange={(e) => updateSetting('support_email', e.target.value)}
                  placeholder="support@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="terms_version">نسخة الشروط</Label>
                  <Input
                    id="terms_version"
                    value={settings.terms_version}
                    onChange={(e) => updateSetting('terms_version', e.target.value)}
                    placeholder="1.0"
                  />
                </div>
                <div>
                  <Label htmlFor="privacy_version">نسخة الخصوصية</Label>
                  <Input
                    id="privacy_version"
                    value={settings.privacy_version}
                    onChange={(e) => updateSetting('privacy_version', e.target.value)}
                    placeholder="1.0"
                  />
                </div>
              </div>
            </div>
          </RetroWindow>

          {/* File Upload Settings */}
          <RetroWindow title="إعدادات رفع الملفات">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">رفع الملفات</h3>
              </div>

              <div>
                <Label htmlFor="max_file_size">حد حجم الملف (ميجابايت)</Label>
                <Input
                  id="max_file_size"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.max_file_size}
                  onChange={(e) => updateSetting('max_file_size', parseInt(e.target.value) || 50)}
                />
              </div>

              <div>
                <Label htmlFor="allowed_file_types">أنواع الملفات المسموحة</Label>
                <Input
                  id="allowed_file_types"
                  value={settings.allowed_file_types.join(', ')}
                  onChange={(e) => updateFileTypes(e.target.value)}
                  placeholder="pdf, doc, docx, ppt, pptx"
                />
                <div className="text-xs text-gray-500 mt-1">
                  اكتب الأنواع مفصولة بفواصل
                </div>
              </div>

              <div>
                <Label htmlFor="max_cart_items">حد عناصر السلة</Label>
                <Input
                  id="max_cart_items"
                  type="number"
                  min="1"
                  max="50"
                  value={settings.max_cart_items}
                  onChange={(e) => updateSetting('max_cart_items', parseInt(e.target.value) || 20)}
                />
              </div>
            </div>
          </RetroWindow>

          {/* Auto Approval Settings */}
          <RetroWindow title="الموافقة التلقائية">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">إعدادات الموافقة</h3>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <Label htmlFor="auto_approve_books">موافقة تلقائية على الكتب</Label>
                  <div className="text-sm text-gray-500">الكتب الجديدة ستُقبل تلقائياً</div>
                </div>
                <Switch
                  id="auto_approve_books"
                  checked={settings.auto_approve_books}
                  onCheckedChange={(checked) => updateSetting('auto_approve_books', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <Label htmlFor="auto_approve_summaries">موافقة تلقائية على الملخصات</Label>
                  <div className="text-sm text-gray-500">الملخصات الجديدة ستُقبل تلقائياً</div>
                </div>
                <Switch
                  id="auto_approve_summaries"
                  checked={settings.auto_approve_summaries}
                  onCheckedChange={(checked) => updateSetting('auto_approve_summaries', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <Label htmlFor="auto_approve_lectures">موافقة تلقائية على المحاضرات</Label>
                  <div className="text-sm text-gray-500">المحاضرات الجديدة ستُقبل تلقائياً</div>
                </div>
                <Switch
                  id="auto_approve_lectures"
                  checked={settings.auto_approve_lectures}
                  onCheckedChange={(checked) => updateSetting('auto_approve_lectures', checked)}
                />
              </div>
            </div>
          </RetroWindow>

          {/* System Settings */}
          <RetroWindow title="إعدادات النظام">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold">حماية النظام</h3>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                <div>
                  <Label htmlFor="maintenance_mode" className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    وضع الصيانة
                  </Label>
                  <div className="text-sm text-gray-500">سيمنع الوصول للموقع مؤقتاً</div>
                </div>
                <Switch
                  id="maintenance_mode"
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <Label htmlFor="registration_enabled" className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    التسجيل متاح
                  </Label>
                  <div className="text-sm text-gray-500">السماح للمستخدمين الجدد بالتسجيل</div>
                </div>
                <Switch
                  id="registration_enabled"
                  checked={settings.registration_enabled}
                  onCheckedChange={(checked) => updateSetting('registration_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <Label htmlFor="email_notifications" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    إشعارات البريد الإلكتروني
                  </Label>
                  <div className="text-sm text-gray-500">إرسال الإشعارات عبر البريد</div>
                </div>
                <Switch
                  id="email_notifications"
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
                />
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Save Button */}
        <div className="mt-6 text-center">
          <Button 
            onClick={saveSettings}
            disabled={saving}
            size="lg"
            className="retro-button bg-green-500 text-white hover:bg-green-600"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'جاري حفظ الإعدادات...' : 'حفظ جميع الإعدادات'}
          </Button>
        </div>
      </div>
    </div>
  )
}