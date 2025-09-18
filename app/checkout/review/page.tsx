import { Button } from "@/components/ui/button"
import { RetroWindow } from "@/components/retro-window"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export default function ReviewPage() {
  // Mock data
  const orderDetails = {
    items: [
      { title: "أساسيات القانون المدني", price: 45, quantity: 1 },
      { title: "برمجة الويب المتقدمة", price: 55, quantity: 2 },
    ],
    shipping: {
      name: "أحمد محمد السالم",
      address: "شارع الملك فهد، الرياض 12345",
      phone: "+966 50 123 4567",
    },
    payment: {
      method: "بطاقة ائتمان",
      last4: "1234",
    },
    totals: {
      subtotal: 155,
      shipping: 15,
      tax: 23,
      total: 170,
    },
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-4xl mx-auto">
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
            <Link href="/checkout" className="hover:text-gray-900">
              إتمام الشراء
            </Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/checkout/payment" className="hover:text-gray-900">
              الدفع
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span>مراجعة الطلب</span>
          </div>
        </div>

        <RetroWindow title="مراجعة الطلب النهائية">
          <div className="space-y-6">
            {/* Order Items */}
            <div className="retro-window bg-gray-50">
              <div className="retro-window-title">
                <span>المنتجات المطلوبة</span>
              </div>
              <div className="p-4 space-y-3">
                {orderDetails.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                    </div>
                    <span className="font-bold">{item.price * item.quantity} ريال</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping Information */}
              <div className="retro-window bg-white">
                <div className="retro-window-title">
                  <span>معلومات الشحن</span>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <p>
                    <strong>الاسم:</strong> {orderDetails.shipping.name}
                  </p>
                  <p>
                    <strong>العنوان:</strong> {orderDetails.shipping.address}
                  </p>
                  <p>
                    <strong>الهاتف:</strong> {orderDetails.shipping.phone}
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="retro-window bg-white">
                <div className="retro-window-title">
                  <span>معلومات الدفع</span>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <p>
                    <strong>طريقة الدفع:</strong> {orderDetails.payment.method}
                  </p>
                  <p>
                    <strong>البطاقة:</strong> **** **** **** {orderDetails.payment.last4}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Totals */}
            <div className="retro-window bg-gray-50">
              <div className="retro-window-title">
                <span>ملخص التكلفة</span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span>{orderDetails.totals.subtotal} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span>الشحن:</span>
                  <span>{orderDetails.totals.shipping} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span>الضريبة (15%):</span>
                  <span>{orderDetails.totals.tax} ريال</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                  <span>المجموع الكلي:</span>
                  <span style={{ color: "var(--primary)" }}>{orderDetails.totals.total} ريال</span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="retro-window bg-white">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="mb-2">بالنقر على "تأكيد ال��لب"، أنت توافق على:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• شروط وأحكام الخدمة</li>
                      <li>• سياسة الخصوصية</li>
                      <li>• سياسة الاستبدال والإرجاع</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button asChild className="retro-button flex-1" style={{ background: "var(--accent)", color: "white" }}>
                <Link href="/payment/success">تأكيد الطلب والدفع</Link>
              </Button>
              <Button asChild variant="outline" className="retro-button bg-transparent">
                <Link href="/checkout/payment">تعديل الدفع</Link>
              </Button>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
