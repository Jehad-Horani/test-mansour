"use client"

import { useState } from "react"
import { RetroWindow } from "@/components/retro-window"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "security" | "notifications" | "integrations" | "maintenance">(
    "general",
  )

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <RetroWindow title="إعدادات النظام">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-black">إعدادات المدير</h2>
              <p className="text-sm text-gray-600">إدارة إعدادات النظام والصلاحيات</p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex border-b border-gray-400">
                {[
                  { id: "general", label: "عام" },
                  { id: "security", label: "الأمان" },
                  { id: "notifications", label: "الإشعارات" },
                  { id: "integrations", label: "التكاملات" },
                  { id: "maintenance", label: "الصيانة" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? "border-retro-accent text-retro-accent bg-gray-50"
                        : "border-transparent text-gray-600 hover:text-black"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">اسم المنصة</label>
                    <input
                      type="text"
                      defaultValue="تخصص"
                      className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">وصف المنصة</label>
                    <input
                      type="text"
                      defaultValue="منصة تعليمية للطلاب الجامعيين"
                      className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">رسالة الترحيب</label>
                  <textarea
                    rows={3}
                    defaultValue="مرحباً بك في منصة تخصص، المنصة التعليمية الرائدة للطلاب الجامعيين"
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">البريد الإلكتروني للدعم</label>
                    <input
                      type="email"
                      defaultValue="support@takhassus.com"
                      className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">رقم الدعم الفني</label>
                    <input
                      type="tel"
                      defaultValue="+966500000000"
                      className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-black">إعدادات التسجيل</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-black">السماح بالتسجيل الجديد</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-black">تفعيل التحقق من البريد الإلكتروني</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm text-black">مراجعة الحسابات الجديدة يدوياً</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-black">إعدادات كلمة المرور</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">الحد الأدنى لطول كلمة المرور</label>
                      <input
                        type="number"
                        defaultValue="8"
                        min="6"
                        max="20"
                        className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">مدة انتهاء الجلسة (بالدقائق)</label>
                      <input
                        type="number"
                        defaultValue="60"
                        className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-black">يجب أن تحتوي على أرقام</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-black">يجب أن تحتوي على أحرف كبيرة وصغيرة</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm text-black">يجب أن تحتوي على رموز خاصة</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-black">إعدادات الأمان</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-black">تسجيل محاولات تسجيل الدخول الفاشلة</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm text-black">تفعيل المصادقة الثنائية للمديرين</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-black">إرسال تنبيهات عند تسجيل دخول جديد</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-black mb-3">عناوين IP المحظورة</h3>
                  <textarea
                    rows={4}
                    placeholder="أدخل عناوين IP المحظورة، كل عنوان في سطر منفصل"
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                  />
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-black">إ��عارات المديرين</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-black">محتوى جديد يحتاج مراجعة</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-black">تقارير جديدة من المستخدمين</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm text-black">مستخدمين جدد يسجلون</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-black">أخطاء النظام</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-black">إشعارات المستخدمين</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-black">ترحيب بالمستخدمين الجدد</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-black">تأكيد قبول/رفض المحتوى</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm text-black">تذكير بانتهاء الاشتراك</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm text-black">إشعارات التسويق</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">قالب البريد الإلكتروني</label>
                  <textarea
                    rows={6}
                    defaultValue="مرحباً {{name}}،&#10;&#10;{{message}}&#10;&#10;مع تحيات فريق تخصص"
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    يمكنك استخدام المتغيرات: {"{"}
                    {"{"} name {"}"}
                    {"}"}، {"{"}
                    {"{"} email {"}"}
                    {"}"}، {"{"}
                    {"{"} message {"}"}
                    {"}"}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-black">خدمات البريد الإلكتروني</h3>
                  <div className="p-4 border border-gray-400 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-black">SMTP Server</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">متصل</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="SMTP Host"
                        defaultValue="smtp.gmail.com"
                        className="px-3 py-2 border border-gray-400 bg-white text-black text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Port"
                        defaultValue="587"
                        className="px-3 py-2 border border-gray-400 bg-white text-black text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-black">خدمات التخزين</h3>
                  <div className="p-4 border border-gray-400 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-black">AWS S3</span>
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">غير مفعل</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Access Key"
                        className="px-3 py-2 border border-gray-400 bg-white text-black text-sm"
                      />
                      <input
                        type="password"
                        placeholder="Secret Key"
                        className="px-3 py-2 border border-gray-400 bg-white text-black text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-black">خدمات الدفع</h3>
                  <div className="space-y-3">
                    <div className="p-4 border border-gray-400 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-black">Stripe</span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">مفعل</span>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-400 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-black">PayPal</span>
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">غير مفعل</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "maintenance" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-black">وضع الصيانة</h3>
                  <div className="p-4 border border-gray-400 bg-gray-50">
                    <label className="flex items-center gap-2 mb-3">
                      <input type="checkbox" />
                      <span className="text-sm font-medium text-black">تفعيل وضع الصيانة</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="رسالة الصيانة للمستخدمين..."
                      defaultValue="الموقع تحت الصيانة حالياً. سنعود قريباً!"
                      className="w-full px-3 py-2 border border-gray-400 bg-white text-black text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-black">النسخ الاحتياطي</h3>
                  <div className="p-4 border border-gray-400 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-black">آخر نسخة احتياطية</span>
                      <span className="text-sm text-gray-600">{new Date().toLocaleDateString("ar-SA")}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600">
                        إنشاء نسخة احتياطية
                      </button>
                      <button className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600">
                        استعادة من نسخة احتياطية
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-black">تنظيف البيانات</h3>
                  <div className="space-y-3">
                    <button className="retro-button bg-orange-500 text-white px-4 py-2 hover:bg-orange-600">
                      حذف الملفات المؤقتة
                    </button>
                    <button className="retro-button bg-red-500 text-white px-4 py-2 hover:bg-red-600">
                      حذف الحسابات غير المفعلة (أكثر من 30 يوم)
                    </button>
                    <button className="retro-button bg-purple-500 text-white px-4 py-2 hover:bg-purple-600">
                      أرشفة المحتوى القديم (أكثر من سنة)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex items-center gap-4">
              <button className="retro-button bg-green-500 text-white px-6 py-2 hover:bg-green-600">
                حفظ الإعدادات
              </button>
              <button className="retro-button bg-gray-500 text-white px-6 py-2 hover:bg-gray-600">إعادة تعيين</button>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
