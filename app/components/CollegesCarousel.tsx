"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import PixelIcon from "./pixel-icon";

export default function HorizontalScrollingCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const colleges = [
    { icon: "gavel" as const, title: "كلية الحقوق", desc: "القانون والشريعة والعدالة" },
    { icon: "code" as const, title: "كلية تكنولوجيا المعلومات", desc: "البرمجة والشبكات والأمن السيبراني" },
    { icon: "briefcase" as const, title: "كلية إدارة الأعمال", desc: "الإدارة والتسويق والمحاسبة" },
    { icon: "atom" as const, title: "كلية العلوم", desc: "الفيزياء والكيمياء والأحياء والرياضيات" },
    { icon: "stethoscope" as const, title: "كلية الطب", desc: "الطب البشري والتخصصات الطبية" },
    { icon: "capsules" as const, title: "كلية الصيدلة", desc: "الأدوية والعلاج والعلوم الصيدلانية" },
    { icon: "cogs" as const, title: "كلية الهندسة", desc: "الهندسة المدنية والمعمارية والكهربائية" },
    { icon: "book-open" as const, title: "كلية الآداب", desc: "اللغة العربية، الإنجليزية، والتاريخ" },
    { icon: "mic" as const, title: "كلية الإعلام", desc: "الصحافة والإذاعة والتلفزيون" },
    { icon: "palette" as const, title: "كلية الفنون", desc: "الموسيقى، التصميم والفنون الجميلة" },
    { icon: "heartbeat" as const, title: "كلية التمريض", desc: "الرعاية الصحية والتمريض السريري" },
    { icon: "mosque" as const, title: "كلية الشريعة", desc: "الشريعة الإسلامية وأصول الدين" }
  ];

  useEffect(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const cards = Array.from(track.children) as HTMLElement[];

    // Calculate total width of all cards including gaps
    let totalWidth = 0;
    cards.forEach(card => {
      totalWidth += card.offsetWidth + 16; // 16px is the gap (gap-4)
    });

    // Clone cards for seamless loop
    cards.forEach(card => {
      const clone = card.cloneNode(true) as HTMLElement;
      track.appendChild(clone);
    });

    // Create infinite scrolling animation from left to right
    gsap.to(track, {
      x: totalWidth,
      duration: 30, // Adjust speed here (lower = faster)
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => {
          const xValue = parseFloat(x);
          return `${xValue % totalWidth}px`;
        }
      }
    });

    return () => {
      gsap.killTweensOf(track);
    };
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 overflow-hidden">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">كليات الجامعة</h2>
        <p className="text-gray-600">استكشف جميع الكليات المتاحة</p>
      </div>
      
      <div className="relative">
        <div 
          ref={trackRef}
          className="flex gap-4"
          style={{ willChange: 'transform' }}
        >
          {colleges.map((college, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border-2 border-purple-100"
            >
              <div className="mb-4">
                <PixelIcon type={college.icon} className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                {college.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {college.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}