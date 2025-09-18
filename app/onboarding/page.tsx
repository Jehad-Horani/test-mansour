"use client"

import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import { useUserContext } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowRight, ArrowLeft, CheckCircle, BookOpen, Users, Calendar } from "lucide-react"
import Link from "next/link"

export default function OnboardingPage() {
  const { user, isLoggedIn, updateUser } = useUserContext()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [preferences, setPreferences] = useState({
    interests: [] as string[],
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    studyGoals: [] as string[],
  })

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn || !user) {
    return null
  }

  const totalSteps = 3

  const handleInterestToggle = (interest: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleGoalToggle = (goal: string) => {
    setPreferences((prev) => ({
      ...prev,
      studyGoals: prev.studyGoals.includes(goal)
        ? prev.studyGoals.filter((g) => g !== goal)
        : [...prev.studyGoals, goal],
    }))
  }

  const handleComplete = () => {
    updateUser({
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences,
        onboardingCompleted: true,
      },
    })
    router.push("/dashboard")
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--primary)" }} />
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              اختر اهتماماتك الأكاديمية
            </h2>
            <p className="text-gray-600 mb-6">ساعدنا في تخصيص المحتوى المناسب لك</p>

            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {[
                "المحاضرات المسجلة",
                "الكتب الإلكترونية",
                "الامتحانات التجريبية",
                "الجلسات الدراسية",
                "المشاريع الجماعية",
                "البحوث الأكاديمية",
              ].map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 text-sm retro-button transition-colors ${
                    preferences.interests.includes(interest) ? "bg-blue-100 border-blue-500" : "bg-transparent"
                  }`}
                >
                  {preferences.interests.includes(interest) && (
                    <CheckCircle className="w-4 h-4 inline ml-2" style={{ color: "var(--accent)" }} />
                  )}
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--accent)" }} />
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              حدد أهدافك الدراسية
            </h2>
            <p className="text-gray-600 mb-6">ما الذي تريد تحقيقه هذا الفصل؟</p>

            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {[
                "تحسين الدرجات",
                "تنظيم الوقت بشكل أفضل",
                "التحضير للامتحانات",
                "بناء شبكة علاقات أكاديمية",
                "تطوير مهارات البحث",
                "الاستعداد لسوق العمل",
              ].map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className={`p-3 text-sm retro-button transition-colors ${
                    preferences.studyGoals.includes(goal) ? "bg-green-100 border-green-500" : "bg-transparent"
                  }`}
                >
                  {preferences.studyGoals.includes(goal) && (
                    <CheckCircle className="w-4 h-4 inline ml-2" style={{ color: "var(--accent)" }} />
                  )}
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--primary)" }} />
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              إعدادات الإشعارات
            </h2>
            <p className="text-gray-600 mb-6">كيف تريد أن نبقيك على اطلاع؟</p>

            <div className="space-y-4 mb-6">
              <div className="retro-window bg-white p-4 flex items-center justify-between">
                <span>إشعارات البريد الإلكتروني</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.email}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: e.target.checked },
                    }))
                  }
                />
              </div>
              <div className="retro-window bg-white p-4 flex items-center justify-between">
                <span>الإشعارات الفورية</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.push}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: e.target.checked },
                    }))
                  }
                />
              </div>
              <div className="retro-window bg-white p-4 flex items-center justify-between">
                <span>رسائل SMS</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.sms}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, sms: e.target.checked },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--panel)" }}>
      <div className="w-full max-w-2xl">
        <RetroWindow title={`الجولة التعريفية - الخطوة ${currentStep} من ${totalSteps}`}>
          <div className="p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i + 1 <= currentStep ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i + 1 <= currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 h-2 retro-window">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(currentStep / totalSteps) * 100}%`,
                    background: "var(--primary)",
                  }}
                />
              </div>
            </div>

            {/* Step Content */}
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                className="retro-button bg-transparent"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ArrowRight className="w-4 h-4 ml-1" />
                السابق
              </Button>

              <div className="flex gap-2">
                <Button asChild variant="outline" className="retro-button bg-transparent">
                  <Link href="/dashboard">تخطي</Link>
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    className="retro-button"
                    style={{ background: "var(--primary)", color: "white" }}
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    التالي
                  </Button>
                ) : (
                  <Button
                    className="retro-button"
                    style={{ background: "var(--accent)", color: "white" }}
                    onClick={handleComplete}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    إنهاء الإعداد
                  </Button>
                )}
              </div>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
