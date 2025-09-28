"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { CreditCard, Shield, Check, Tag } from "lucide-react"

export default function SubscribeStandardPage() {
  const router = useRouter()
  const { user, updateSubscription } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [discountCode, setDiscountCode] = useState("")
  const [isDiscountApplied, setIsDiscountApplied] = useState(false)

  // السعر الأساسي
  const basePrice = 15
  // السعر بعد الخصم (20%)
  const discountedPrice = (basePrice * 0.8).toFixed(2)

  // كودات الخصم المتاحة
  const validCodes = ["SAVE20", "STUDENT20"]

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.cardholderName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      setError("يرجى ملء جميع الحقول المطلوبة")
      setLoading(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      updateSubscription("standard")
      router.push("/dashboard?subscription=success")
    } catch (err) {
      setError("حدث خطأ في معالجة الدفع. يرجى المحاولة مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const applyDiscount = () => {
    if (validCodes.includes(discountCode.trim().toUpperCase())) {
      setIsDiscountApplied(true)
      setError("")
    } else {
      setIsDiscountApplied(false)
      setError("كود الخصم غير صالح")
    }
  }

  return (
    <div className="min-h-screen bg-retro-bg p-4">
      <div className="max-w-2xl mx-auto">
        <RetroWindow title="اشتراك الباقة المعيارية">
          <div className="space-y-6">
            {/* Plan Details */}
            <div className="retro-pane p-4">
              <h2 className="text-lg font-bold mb-4 text-black">تفاصيل الباقة المعيارية</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-black">وصول لجميع الدورات</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-black">تحميل المواد الدراسية</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-black">استشارات أكاديمية محدودة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-black">دعم فني أولوية متوسطة</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-100 rounded">
                {isDiscountApplied ? (
                  <>
                    <div className="text-2xl font-bold text-blue-800 line-through">
                      {basePrice} دينار / شهر
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {discountedPrice} دينار / شهر (بعد الخصم)
                    </div>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-blue-800">{basePrice} دينار / شهر</div>
                )}
              </div>
            </div>

            {error && (
              <div className="retro-pane p-4 bg-red-50 border-red-200">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Discount Code */}
            <div className="retro-pane p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-black">
                <Tag className="w-5 h-5" />
                كود الخصم
              </h3>
              <div className="flex gap-3">
                <Input
                  placeholder="ادخل كود الخصم"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="retro-input"
                />
                <Button type="button" onClick={applyDiscount} className="retro-button bg-green-600 text-white">
                  تطبيق
                </Button>
              </div>
              {isDiscountApplied && (
                <p className="text-green-700 text-sm mt-2">تم تطبيق كود الخصم بنجاح ✅</p>
              )}
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="retro-pane p-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-black">
                  <CreditCard className="w-5 h-5" />
                  معلومات الدفع
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="cardholderName" className="text-black">
                      اسم حامل البطاقة
                    </Label>
                    <Input
                      id="cardholderName"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      placeholder="الاسم كما يظهر على البطاقة"
                      required
                      className="retro-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber" className="text-black">
                      رقم البطاقة
                    </Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="retro-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate" className="text-black">
                        تاريخ الانتهاء
                      </Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                        className="retro-input"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cvv" className="text-black">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        className="retro-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="retro-pane p-4 bg-green-50">
                <div className="flex items-center gap-2 text-green-800">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">دفع آمن ومشفر</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  جميع معلومات الدفع محمية بتشفير SSL 256-bit
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/pricing")}
                  className="retro-button"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="retro-button bg-blue-600 text-white hover:bg-blue-700"
                >
                  {loading
                    ? "جاري المعالجة..."
                    : `اشترك الآن - ${isDiscountApplied ? discountedPrice : basePrice} دينار`}
                </Button>
              </div>
            </form>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
