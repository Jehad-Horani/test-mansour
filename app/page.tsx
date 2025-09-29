"use client"

import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import PixelIcon from "@/app/components/pixel-icon"
import { AuthDebug } from "@/app/components/auth-debug"
import Link from "next/link"
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Carousel from "./components/CollegesCarousel"


export default function HomePage() {
  const carouselRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!carouselRef.current) return;

  const el = carouselRef.current;

  // نسخ كل الكروت بنفس الترتيب عشان يكون looping سلس
  const cards = Array.from(el.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    el.appendChild(clone);
  });

  const totalWidth = el.scrollWidth / 2; // لأننا نسخنا العناصر

  gsap.to(el, {
    x: -totalWidth,
    duration: 30, // طول الحركة
    ease: "linear",
    repeat: -1
  });
}, []);

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "var(--panel)" }}>


      {/* Hero Section */}
      <section className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-4" style={{ color: "var(--ink)" }}>
            منصة تخصصكُم الشاملة
          </h1>
          <p className="text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto" style={{ color: "var(--ink)" }}>
            اكتشف عالم التعلم الجامعي مع أفضل الكتب والاستشارات الأكاديمية
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 md:mb-12">
            <Button asChild className="retro-button text-white" style={{ background: "var(--primary)" }}>
              <Link href="/market">ادخل السوق</Link>
            </Button>

          </div>
        </div>
      </section>

      <section className="py-12 px-4">
          <RetroWindow className="z-10 max-w-6xl" title="الكليات المتاحة">
          <Carousel/>
          </RetroWindow>
      </section>


      <section className="py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <RetroWindow title="المميزات الأساسية">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Market Feature */}
              <div className="retro-window bg-white">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                    سوق الكتب
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    اشتري وبيع الكتب الجامعية المستعملة والجديدة بأفضل الأسعار
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="retro-button"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    <Link href="/market">تصفح السوق</Link>
                  </Button>
                </div>
              </div>



              {/* Ambassadors Feature */}
              <div className="retro-window bg-white">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                    السفراء الأكاديميون
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">احصل على استشارات أكاديمية من طلاب متفوقين في تخصصك</p>
                  <Button
                    asChild
                    size="sm"
                    className="retro-button"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    <Link href="/ambassadors">السفراء</Link>
                  </Button>
                </div>
              </div>

              {/* Dashboard Feature */}
              <div className="retro-window bg-white">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                    لوحة التحكم
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">تتبع جدولك الدراسي وامتحاناتك وخطط الدراسة الشخصية</p>
                  <Button
                    asChild
                    size="sm"
                    className="retro-button"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    <Link href="/dashboard">افتح لوحة التحكم</Link>
                  </Button>
                </div>
              </div>

              {/* Notebooks Feature */}
              <div className="retro-window bg-white">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                    المحاضرات
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">ارفع وشارك محاضراتك الدراسية مع الطلاب الآخرين</p>
                  <Button
                    asChild
                    size="sm"
                    className="retro-button"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    <Link href="/dashboard/notebooks">تصفح المحاضرات</Link>
                  </Button>
                </div>
              </div>

              {/* Summaries Feature */}
              <div className="retro-window bg-white">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📄</span>
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                    الملخصات الدراسية
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">تصفح وشارك الملخصات الدراسية مع زملائك الطلاب</p>
                  <Button
                    asChild
                    size="sm"
                    className="retro-button"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    <Link href="/summaries">تصفح الملخصات</Link>
                  </Button>
                </div>
              </div>

              {/* Pricing Feature */}
              <div className="retro-window bg-white">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💎</span>
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                    خطط الاشتراك
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">اختر الخطة المناسبة لك واحصل على مميزات إضافية</p>
                  <Button
                    asChild
                    size="sm"
                    className="retro-button"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    <Link href="/pricing">اختر خطتك</Link>
                  </Button>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <RetroWindow title="خطط الاشتراك">
            {/* Standard Plan */}

            {/* Premium Plan */}
            <div className="retro-window bg-white">
              <div className="retro-window-title">
                <span>الخطة المميزة</span>
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: "var(--accent)" }}>
                  15 دينار
                </div>
                <p className="text-gray-600 mb-6">شهرياً</p>
                <ul className="space-y-2 text-sm text-right mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    جميع مميزات القياسية
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    استشارات مع السفراء
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    دعم فني متقدم
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    محتوى حصري
                  </li>
                </ul>
                <Button asChild className="retro-button w-full" style={{ background: "var(--accent)", color: "white" }}>
                  <Link href="/pricing">اشترك الآن</Link>
                </Button>
              </div>
            </div>
          </RetroWindow>
        </div>
      </section>

      <footer className="mt-16 py-8 px-4" style={{ background: "var(--bg)", color: "white" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Section */}
            <div>
              <h3 className="font-bold mb-4 text-lg text-white">عن تخصصكُم</h3>
              <p className="text-sm mb-4 text-white/90">
                منصة شاملة للطلاب الجامعيين في الأردن لتبادل الكتب والمعرفة والحصول على الاستشارات الأكاديمية
              </p>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-xs">📧</span>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-xs">📱</span>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-xs">🌐</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold mb-4 text-lg text-white">روابط سريعة</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/market" className="hover:underline text-white/90 hover:text-white">
                    سوق الكتب
                  </Link>
                </li>

                <li>
                  <Link href="/ambassadors" className="hover:underline text-white/90 hover:text-white">
                    السفراء
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:underline text-white/90 hover:text-white">
                    خطط الاشتراك
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:underline text-white/90 hover:text-white">
                    لوحة التحكم
                  </Link>
                </li>
                <li>
                  <Link href="/summaries" className="hover:underline text-white/90 hover:text-white">
                    الملخصات
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colleges */}
            <div>
              <h3 className="font-bold mb-4 text-lg text-white">الكليات</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-white/90">كلية الحقوق</span>
                </li>
                <li>
                  <span className="text-white/90">تكنولوجيا المعلومات</span>
                </li>
                <li>
                  <span className="text-white/90">إدارة الأعمال</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-bold mb-4 text-lg text-white">تواصل معنا</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span className="text-white/90">+962 6 123 4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <span className="text-white/90">+962 79 123 4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span className="text-white/90">info@takhassus.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span className="text-white/90">عمان، الأردن</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="text-white/90 mb-4 md:mb-0">© 2024 تخصصكُم. جميع الحقوق محفوظة.</div>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:underline text-white/90 hover:text-white">
                شروط الاستخدام
              </Link>
              <Link href="/privacy" className="hover:underline text-white/90 hover:text-white">
                سياسة الخصوصية
              </Link>
              <Link href="/help" className="hover:underline text-white/90 hover:text-white">
                المساعدة
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}