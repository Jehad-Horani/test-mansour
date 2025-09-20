"use client"

import type React from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import Link from "next/link"
import { ArrowRight, AlertCircle, Eye, EyeOff, ChevronDown, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

const countryCodes = [
  { code: "+962", country: "الأردن", flag: "🇯🇴" },
  { code: "+966", country: "السعودية", flag: "🇸🇦" },
  { code: "+971", country: "الإمارات", flag: "🇦🇪" },
  { code: "+965", country: "الكويت", flag: "🇰🇼" },
  { code: "+974", country: "قطر", flag: "🇶🇦" },
  { code: "+973", country: "البحرين", flag: "🇧🇭" },
  { code: "+968", country: "عمان", flag: "🇴🇲" },
  { code: "+961", country: "لبنان", flag: "🇱🇧" },
  { code: "+963", country: "سوريا", flag: "🇸🇾" },
  { code: "+964", country: "العراق", flag: "🇮🇶" },
  { code: "+20", country: "مصر", flag: "🇪🇬" },
  { code: "+212", country: "المغرب", flag: "🇲🇦" },
  { code: "+213", country: "الجزائر", flag: "🇩🇿" },
  { code: "+216", country: "تونس", flag: "🇹🇳" },
  { code: "+218", country: "ليبيا", flag: "🇱🇾" },
  { code: "+249", country: "السودان", flag: "🇸🇩" },
  { code: "+967", country: "اليمن", flag: "🇾🇪" },
  { code: "+970", country: "فلسطين", flag: "🇵🇸" },
]

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+962",
    university: "",
    major: "" as "" | "law" | "it" | "medical" | "business",
    year: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { signUp, loading, error, clearError, user } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "الاسم الكامل مطلوب"
    else if (formData.name.trim().length < 3) newErrors.name = "الاسم يجب أن يكون 3 أحرف على الأقل"

    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "البريد الإلكتروني غير صحيح"

    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب"
    else {
      const phoneWithoutSpaces = formData.phone.replace(/\s/g, "")
      if (formData.countryCode === "+962" && !/^[7][0-9]{8}$/.test(phoneWithoutSpaces))
        newErrors.phone = "رقم الهاتف الأردني غير صحيح (يجب أن يبدأ بـ 7 ويتكون من 9 أرقام)"
      else if (formData.countryCode !== "+962" && !/^[0-9]{7,15}$/.test(phoneWithoutSpaces))
        newErrors.phone = "رقم الهاتف غير صحيح"
    }

    if (!formData.university) newErrors.university = "يرجى اختيار الجامعة"
    if (!formData.major) newErrors.major = "يرجى اختيار التخصص"
    if (!formData.year) newErrors.year = "يرجى اختيار المستوى الدراسي"
    if (!formData.password) newErrors.password = "كلمة المرور مطلوبة"
    else if (formData.password.length < 8) newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
    if (!formData.confirmPassword) newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب"
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "كلمة المرور غير متطابقة"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "يجب الموافقة على الشروط والأحكام"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    clearError()

    try {
      await signUp({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: `${formData.countryCode}${formData.phone.trim()}`,
        university: formData.university,
        major: formData.major as "law" | "it" | "medical" | "business",
        year: formData.year,
      })

      // بعد التسجيل، ننتظر بيانات المستخدم وتوجيهه مباشرة للداش بورد
      const checkUserInterval = setInterval(() => {
        if (user) {
          clearInterval(checkUserInterval)
          router.push("/dashboard")
        }
      }, 500)

      setIsSuccess(true)
    } catch (err: any) {
      setErrors({ submit: err.message || "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleCountryCodeSelect = (code: string) => {
    setFormData((prev) => ({ ...prev, countryCode: code }))
    setShowCountryDropdown(false)
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }))
  }

  const selectedCountry = countryCodes.find((c) => c.code === formData.countryCode) || countryCodes[0]

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--panel)" }}>
        <div className="w-full max-w-md">
          <RetroWindow title="تم إنشاء الحساب بنجاح">
            <div className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>
                مرحباً بك في تخصص!
              </h2>
              <p className="text-gray-600 mb-6">
                تم إنشاء حسابك بنجاح. سيتم توجيهك مباشرة للداش بورد.
              </p>
              <div className="space-y-3">
                <Button
                  asChild
                  className="retro-button w-full"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  <Link href="/dashboard">الذهاب للداش بورد</Link>
                </Button>
                <Button
                  variant="outline"
                  className="retro-button w-full bg-transparent"
                  onClick={() => setIsSuccess(false)}
                >
                  إنشاء حساب آخر
                </Button>
              </div>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--panel)" }}>
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button asChild variant="outline" className="retro-button bg-transparent">
            <Link href="/">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>

        <RetroWindow title="إنشاء حساب جديد">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {(errors.submit || error) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600 text-sm">{errors.submit || error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  الاسم الكامل *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="أحمد محمد السالم"
                  className={`retro-window ${errors.name ? "border-red-500" : ""}`}
                  style={{ background: "white", border: "2px inset #c0c0c0" }}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  البريد الإلكتروني *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="example@domain.com"
                  className={`retro-window ${errors.email ? "border-red-500" : ""}`}
                  style={{ background: "white", border: "2px inset #c0c0c0" }}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  رقم الهاتف *
                </label>
                <div className="flex gap-2">
                  {/* Country Code Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center gap-2 px-3 py-2 retro-window bg-white border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      style={{ border: "2px inset #c0c0c0", minWidth: "120px" }}
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-sm font-mono">{selectedCountry.code}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {showCountryDropdown && (
                      <div
                        className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto retro-window bg-white border-2 z-50"
                        style={{ border: "2px outset #c0c0c0" }}
                      >
                        {countryCodes.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountryCodeSelect(country.code)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-right hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-lg">{country.flag}</span>
                            <span className="flex-1 text-sm">{country.country}</span>
                            <span className="text-sm font-mono text-gray-600">{country.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Phone Number Input */}
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder={formData.countryCode === "+962" ? "791234567" : "1234567890"}
                    className={`retro-window flex-1 ${errors.phone ? "border-red-500" : ""}`}
                    style={{ background: "white", border: "2px inset #c0c0c0" }}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.countryCode === "+962"
                    ? "أدخل رقم الهاتف بدون مفتاح البلد (مثال: 791234567)"
                    : "أدخل رقم الهاتف بدون مفتاح البلد"}
                </p>
              </div>

              {showCountryDropdown && (
                <div className="fixed inset-0 z-40" onClick={() => setShowCountryDropdown(false)} />
              )}

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  الجامعة *
                </label>
                <select
                  value={formData.university}
                  onChange={(e) => handleInputChange("university", e.target.value)}
                  className={`w-full p-2 retro-window ${errors.university ? "border-red-500" : ""}`}
                  style={{ background: "white", border: "2px inset #c0c0c0" }}
                >
                  <option value="">اختر الجامعة</option>
                  <option value="ju">الجامعة الأردنية</option>
                  <option value="just">جامعة العلوم والتكنولوجيا الأردنية</option>
                  <option value="yarmouk">جامعة اليرموك</option>
                  <option value="mutah">جامعة مؤتة</option>
                  <option value="aau">جامعة عمان العربية</option>
                </select>
                {errors.university && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.university}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  التخصص *
                </label>
                <select
                  value={formData.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  className={`w-full p-2 retro-window ${errors.major ? "border-red-500" : ""}`}
                  style={{ background: "white", border: "2px inset #c0c0c0" }}
                >
                  <option value="">اختر التخصص</option>
                  <option value="law">القانون</option>
                  <option value="it">تقنية المعلومات</option>
                  <option value="medical">الطب</option>
                  <option value="business">إدارة الأعمال</option>
                </select>
                {errors.major && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.major}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  المستوى الدراسي *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  className={`w-full p-2 retro-window ${errors.year ? "border-red-500" : ""}`}
                  style={{ background: "white", border: "2px inset #c0c0c0" }}
                >
                  <option value="">اختر المستوى</option>
                  <option value="1">السنة الأولى</option>
                  <option value="2">السنة الثانية</option>
                  <option value="3">السنة الثالثة</option>
                  <option value="4">السنة الرابعة</option>
                  <option value="graduate">دراسات عليا</option>
                </select>
                {errors.year && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.year}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  كلمة المرور *
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="••••••••"
                    className={`retro-window pr-10 ${errors.password ? "border-red-500" : ""}`}
                    style={{ background: "white", border: "2px inset #c0c0c0" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  تأكيد كلمة المرور *
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    className={`retro-window pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    style={{ background: "white", border: "2px inset #c0c0c0" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                  className="mt-1"
                />
                <label className="text-sm" style={{ color: "var(--ink)" }}>
                  أوافق على{" "}
                  <Link href="/terms" className="hover:underline" style={{ color: "var(--primary)" }}>
                    شروط الاستخدام
                  </Link>{" "}
                  و{" "}
                  <Link href="/privacy" className="hover:underline" style={{ color: "var(--primary)" }}>
                    سياسة الخصوصية
                  </Link>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.agreeToTerms}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full retro-button"
                style={{ background: "var(--primary)", color: "white" }}
              >
                {isSubmitting || loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{" "}
                <Link href="/auth/login" className="hover:underline" style={{ color: "var(--primary)" }}>
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
