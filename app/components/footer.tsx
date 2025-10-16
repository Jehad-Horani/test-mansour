"use client"

import Link from "next/link"

export default function Footer() {
    return (
        <footer className="mt-16 py-8 px-4 bg-[var(--bg)] text-white">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="font-semibold text-xl mb-4 text-white">عن تخصص.كُم</h3>
                        <p className="text-sm mb-4 text-white/90">
                            منصة شاملة للطلاب الجامعيين في الأردن لتبادل الكتب والمعرفة والحصول على الاستشارات الأكاديمية
                        </p>
                        <div className="flex gap-3 mt-4">
                            <Link href="https://www.instagram.com" aria-label="Instagram">
                                <svg
                                    className="w-5 h-5 fill-white/80 hover:fill-white transition-colors"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zm0 1.5h8.5A4.25 4.25 0 0120.5 7.75v8.5A4.25 4.25 0 0116.25 20.5h-8.5A4.25 4.25 0 013.5 16.25v-8.5A4.25 4.25 0 017.75 3.5zm8.75 2a.75.75 0 100 1.5.75.75 0 000-1.5zm-4.5 2a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zm0 1.5a3.25 3.25 0 110 6.5 3.25 3.25 0 010-6.5z" />
                                </svg>
                            </Link>
                            <Link href="https://www.facebook.com" aria-label="Facebook">
                                <svg
                                    className="w-5 h-5 fill-white/80 hover:fill-white transition-colors"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M13 22v-8h2.293l.707-3H13V9.5A1.5 1.5 0 0114.5 8H16V5h-2a4 4 0 00-4 4v2H8v3h2v8h3z" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-xl mb-4 text-white">روابط سريعة</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/market" className="hover:text-white transition-colors text-white/90">
                                    سوق الكتب
                                </Link>
                            </li>
                            <li>
                                <Link href="/ambassadors" className="hover:text-white transition-colors text-white/90">
                                    السفراء
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-white transition-colors text-white/90">
                                    خطط الاشتراك
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-white transition-colors text-white/90">
                                    لوحة التحكم
                                </Link>
                            </li>
                            <li>
                                <Link href="/summaries" className="hover:text-white transition-colors text-white/90">
                                    الملخصات
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Colleges */}
                    <div>
                        <h3 className="font-semibold text-xl mb-4 text-white">الكليات</h3>
                        <ul className="space-y-2 text-sm">
                            <li><span className="text-white/90">كلية الحقوق</span></li>
                            <li><span className="text-white/90">تكنولوجيا المعلومات</span></li>
                            <li><span className="text-white/90">إدارة الأعمال</span></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-xl mb-4 text-white">تواصل معنا</h3>
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
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
                    <a href="https://jehadh-portfolio.vercel.app/">

                        © {new Date().getFullYear()} JHWebDev. All rights reserved.
                    </a>

                </div>
            </div>
        </footer>
    )
}
