"use client"

import { RetroWindow } from "@/components/retro-window"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen p-4">
      <RetroWindow title="سياسة الخصوصية" className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">سياسة الخصوصية</h1>
            <p className="text-gray-600">آخر تحديث: ديسمبر 2024</p>
          </div>

          <div className="space-y-6 text-black">
            <section>
              <h2 className="text-xl font-bold mb-3">1. المعلومات التي نجمعها</h2>
              <div className="text-gray-700 space-y-2">
                <p className="font-semibold">المعلومات الشخصية:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>الاسم الكامل</li>
                  <li>البريد الإلكتروني</li>
                  <li>رقم الهاتف</li>
                  <li>الجامعة والتخصص</li>
                  <li>معلومات الدفع (مشفرة)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. كيف نستخدم معلوماتك</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>تقديم الخدمات التعليمية المطلوبة</li>
                <li>إرسال إشعارات حول الدورات والتحديثات</li>
                <li>تحسين جودة المنصة والخدمات</li>
                <li>معالجة المدفوعات والاشتراكات</li>
                <li>تقديم الدعم الفني والمساعدة</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. مشاركة المعلومات</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الحالات التالية:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>مع مقدمي الخدمات الموثوقين (معالجة المدفوعات، الاستضافة)</li>
                <li>عند الحاجة للامتثال للقوانين واللوائح</li>
                <li>لحماية حقوقنا وحقوق المستخدمين الآخرين</li>
                <li>بموافقتك الصريحة</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. أمان المعلومات</h2>
              <p className="text-gray-700 leading-relaxed">
                نتخذ إجراءات أمنية صارمة لحماية معلوماتك الشخصية، بما في ذلك التشفير، جدران الحماية، والوصول المحدود
                للبيانات. جميع المعاملات المالية محمية بتشفير SSL.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. ملفات تعريف الارتباط (Cookies)</h2>
              <p className="text-gray-700 leading-relaxed">
                نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم، حفظ تفضيلاتك، وتحليل استخدام المنصة. يمكنك إدارة
                إعدادات ملفات تعريف الارتباط من خلال متصفحك.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. حقوقك</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>الحق في الوصول إلى معلوماتك الشخصية</li>
                <li>الحق في تصحيح أو تحديث معلوماتك</li>
                <li>الحق في حذف حسابك ومعلوماتك</li>
                <li>الحق في إيقاف الرسائل التسويقية</li>
                <li>الحق في نقل بياناتك</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. الاحتفاظ بالبيانات</h2>
              <p className="text-gray-700 leading-relaxed">
                نحتفظ بمعلوماتك الشخصية طالما كان حسابك نشطاً أو حسب الحاجة لتقديم الخدمات. قد نحتفظ ببعض المعلومات لفترة
                أطول للامتثال للقوانين أو لأغراض أمنية.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. خصوصية الأطفال</h2>
              <p className="text-gray-700 leading-relaxed">
                منصتنا مخصصة للمستخدمين الذين تبلغ أعمارهم 16 عاماً أو أكثر. لا نجمع معلومات شخصية من الأطفال دون سن 16
                عاماً عمداً.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. التحديثات على السياسة</h2>
              <p className="text-gray-700 leading-relaxed">
                قد نحدث هذه السياسة من وقت لآخر. سنقوم بإشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على
                المنصة.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. التواصل معنا</h2>
              <p className="text-gray-700 leading-relaxed">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يمكنك التواصل معنا:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
                <li>البريد الإلكتروني: privacy@takhassus.com</li>
                <li>الهاتف: +966 11 123 4567</li>
                <li>العنوان: الرياض، المملكة العربية السعودية</li>
              </ul>
            </section>
          </div>

          <div className="text-center pt-6 border-t">
            <Button asChild className="retro-button">
              <Link href="/">العودة للصفحة الرئيسية</Link>
            </Button>
          </div>
        </div>
      </RetroWindow>
    </div>
  )
}
