"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RetroWindow } from "@/components/retro-window"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"

export default function CheckoutPage() {
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    postal: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { cartItems, getCartTotal } = useCart()
  const router = useRouter()

  const subtotal = getCartTotal()
  const shipping = 15
  const tax = Math.round(subtotal * 0.15)
  const total = subtotal + shipping + tax

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "الاسم الأول مطلوب"
    if (!formData.lastName.trim()) newErrors.lastName = "الاسم الأخير مطلوب"
    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب"
    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب"
    if (!formData.address.trim()) newErrors.address = "العنوان مطلوب"
    if (!formData.city) newErrors.city = "المدينة مطلوبة"
    if (!formData.region) newErrors.region = "المنطقة مطلوبة"
    if (!formData.postal.trim()) newErrors.postal = "الرمز البريدي مطلوب"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || isSubmitting) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/checkout/payment")
    } catch (error) {
      console.error("Checkout failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              الرئيسية
            </Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/cart" className="hover:text-gray-900">
              السلة
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span>إتمام الشراء</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <RetroWindow title="معلومات الشحن">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">الاسم الأول *</Label>
                    <Input
                      id="firstName"
                      className="retro-button"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">الاسم الأخير *</Label>
                    <Input
                      id="lastName"
                      className="retro-button"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    className="retro-button"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    className="retro-button"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="address">العنوان *</Label>
                  <Input
                    id="address"
                    className="retro-button"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">المدينة *</Label>
                    <Select>
                      <SelectTrigger className="retro-button">
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amman">عمان</SelectItem>
                        <SelectItem value="irbid">إربد</SelectItem>
                        <SelectItem value="zarqa">الزرقاء</SelectItem>
                        <SelectItem value="karak">الكرك</SelectItem>
                        <SelectItem value="aqaba">العقبة</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="region">المحافظة *</Label>
                    <Select>
                      <SelectTrigger className="retro-button">
                        <SelectValue placeholder="اختر المحافظة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amman">محافظة العاصمة</SelectItem>
                        <SelectItem value="irbid">محافظة إربد</SelectItem>
                        <SelectItem value="zarqa">محافظة الزرقاء</SelectItem>
                        <SelectItem value="karak">محافظة الكرك</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                  </div>
                  <div>
                    <Label htmlFor="postal">الرمز البريدي *</Label>
                    <Input
                      id="postal"
                      className="retro-button"
                      value={formData.postal}
                      onChange={(e) => setFormData({ ...formData, postal: e.target.value })}
                      required
                    />
                    {errors.postal && <p className="text-red-500 text-xs mt-1">{errors.postal}</p>}
                  </div>
                </div>
              </div>
            </RetroWindow>

            {/* Billing Information */}
            <RetroWindow title="معلومات الفوترة">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameAsShipping"
                    checked={sameAsShipping}
                    onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                  />
                  <Label htmlFor="sameAsShipping" className="text-sm">
                    نفس معلومات الشحن
                  </Label>
                </div>

                {!sameAsShipping && (
                  <div className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billFirstName">الاسم الأول *</Label>
                        <Input
                          id="billFirstName"
                          className="retro-button"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="billLastName">الاسم الأخير *</Label>
                        <Input
                          id="billLastName"
                          className="retro-button"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="billAddress">العنوان *</Label>
                      <Input
                        id="billAddress"
                        className="retro-button"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="billCity">المدينة *</Label>
                        <Select>
                          <SelectTrigger className="retro-button">
                            <SelectValue placeholder="اختر المدينة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="amman">عمان</SelectItem>
                            <SelectItem value="irbid">إربد</SelectItem>
                            <SelectItem value="zarqa">الزرقاء</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <Label htmlFor="billRegion">المحافظة *</Label>
                        <Select>
                          <SelectTrigger className="retro-button">
                            <SelectValue placeholder="اختر المحافظة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="amman">محافظة العاصمة</SelectItem>
                            <SelectItem value="irbid">محافظة إربد</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                      </div>
                      <div>
                        <Label htmlFor="billPostal">الرمز البريدي *</Label>
                        <Input
                          id="billPostal"
                          className="retro-button"
                          value={formData.postal}
                          onChange={(e) => setFormData({ ...formData, postal: e.target.value })}
                        />
                        {errors.postal && <p className="text-red-500 text-xs mt-1">{errors.postal}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </RetroWindow>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <RetroWindow title="ملخص الطلب">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-600">الكمية: {item.quantity}</p>
                    </div>
                    <span className="font-bold">{item.price * item.quantity} دينار</span>
                  </div>
                ))}

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>{subtotal} دينار</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الشحن:</span>
                    <span>{shipping} دينار</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الضريبة (15%):</span>
                    <span>{tax} دينار</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                    <span>المجموع الكلي:</span>
                    <span style={{ color: "var(--primary)" }}>{total} دينار</span>
                  </div>
                </div>
              </div>
            </RetroWindow>

            <div className="space-y-3">
              <Button
                onClick={handleSubmit}
                className="retro-button w-full"
                style={{ background: "var(--accent)", color: "white" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري المعالجة..." : "متابعة للدفع"}
              </Button>
              <Button asChild variant="outline" className="retro-button w-full bg-transparent">
                <Link href="/cart">العودة للسلة</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
