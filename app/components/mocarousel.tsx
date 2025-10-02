"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import PixelIcon from "./pixel-icon";

export default function MobileCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const colleges = [
    { icon: "gavel" as const, title: "كلية الحقوق", desc: "القانون والشريعة والعدالة" },
    { icon: "code" as const, title: "كلية تكنولوجيا المعلومات", desc: "البرمجة والشبكات والأمن السيبراني" },
    { icon: "briefcase" as const, title: "كلية إدارة الأعمال", desc: "الإدارة والتسويق والمحاسبة" },
    { icon: "atom" as const, title: "كلية العلوم", desc: "الفيزياء والكيمياء والأحياء والرياضيات" },
    { icon: "stethoscope" as const, title: "كلية الطب", desc: "الطب البشري والتخصصات الطبية" },
    { icon: "capsules" as const, title: "كلية الصيدلة", desc: "الأدوية والعلاج والعلوم الصيدلانية" },
    { icon: "cogs" as const, title: "كلية الهندسة", desc: "الهندسة المدنية والمعمارية والكهربائية" },
  ];

  const initAnimation = () => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const cards = Array.from(track.children) as HTMLElement[];

    // امسح أي نسخ قديمة
    while (track.children.length > colleges.length) {
      track.removeChild(track.lastChild!);
    }

    // حساب العرض الكلي
    let totalWidth = 0;
    cards.forEach(card => {
      totalWidth += card.offsetWidth + 16;
    });

    // نسخ الكروت
    cards.forEach(card => {
      const clone = card.cloneNode(true) as HTMLElement;
      track.appendChild(clone);
    });

    if (animationRef.current) animationRef.current.kill();

    // Animation GSAP
    animationRef.current = gsap.to(track, {
      x: totalWidth,
      duration: 50,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => `${parseFloat(x) % totalWidth}px`
      }
    });
  };

  useEffect(() => {
    initAnimation();
    window.addEventListener("resize", initAnimation);
    return () => {
      window.removeEventListener("resize", initAnimation);
      if (animationRef.current) animationRef.current.kill();
    };
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 overflow-hidden sm:hidden">
      {/* العنوان */}
      <div className="mb-6 text-center px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          كليات تخصص.كُم
        </h2>
        <p className="text-sm text-gray-600">
          استكشف جميع الكليات المتاحة
        </p>
      </div>

      {/* الكاروسيل */}
      <div className="relative">
        <div ref={trackRef} className="flex gap-4">
          {colleges.map((college, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[85%] 
                         bg-white rounded-xl shadow-md 
                         p-4 text-center 
                         hover:shadow-lg transition-shadow duration-300 
                         border border-purple-100"
            >
              <div className="mb-3">
                <PixelIcon
                  type={college.icon}
                  className="w-8 h-8 mx-auto"
                />
              </div>
              <h3 className="font-bold text-base mb-1 text-gray-800">
                {college.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {college.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
