"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import PixelIcon from "./pixel-icon";

export default function Carousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselRef.current) return;

    const el = carouselRef.current;
    const cards = Array.from(el.children) as HTMLElement[];

    let totalWidth = 0;
    cards.forEach(card => {
      totalWidth += card.offsetWidth;
    });

    gsap.to(el, {
      x: `-=${totalWidth}`, // الحركة الأفقية
      ease: "linear",
      duration: 30, // طول الحركة
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth) // تكرار سلس
      }
    });
  }, []);

  return (
    <div className="carousel-container" style={{ overflow: "hidden" }}>
      <div
        ref={carouselRef} 
        className="carousel-track flex gap-4"
        style={{ display: "flex" }}
      >
        
                    {/* كلية الحقوق */}
                    <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
                      <PixelIcon type="gavel" className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                        كلية الحقوق
                      </h3>
                      <p className="text-sm text-gray-600">
                        القانون والشريعة والعدالة
                      </p>
                    </div>
      
                    {/* كلية تكنولوجيا المعلومات */}
                    <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
                      <PixelIcon type="code" className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                        كلية تكنولوجيا المعلومات
                      </h3>
                      <p className="text-sm text-gray-600">
                        البرمجة والشبكات والأمن السيبراني
                      </p>
                    </div>
      
                    {/* كلية إدارة الأعمال */}
                    <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
                      <PixelIcon type="briefcase" className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                        كلية إدارة الأعمال
                      </h3>
                      <p className="text-sm text-gray-600">
                        الإدارة والتسويق والمحاسبة
                      </p>
                    </div>
                    {/* Science College */}
                    <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
                      <div className="p-6 text-center">
                        <PixelIcon type="atom" className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                          كلية العلوم
                        </h3>
                        <p className="text-sm text-gray-600">الفيزياء والكيمياء والأحياء والرياضيات</p>
                      </div>
                    </div>
      
                    {/* Medicine College */}
                    <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
                      <div className="p-6 text-center">
                        <PixelIcon type="stethoscope" className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                          كلية الطب
                        </h3>
                        <p className="text-sm text-gray-600">الطب البشري والتخصصات الطبية</p>
                      </div>
                    </div>
      
                    {/* Pharmacy College */}
                    <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
                      <div className="p-6 text-center">
                        <PixelIcon type="capsules" className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                          كلية الصيدلة
                        </h3>
                        <p className="text-sm text-gray-600">الأدوية والعلاج والعلوم الصيدلانية</p>
                      </div>
                    </div>
      
                    {/* Engineering College */}
                    <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
                      <div className="p-6 text-center">
                        <PixelIcon type="cogs" className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                          كلية الهندسة
                        </h3>
                        <p className="text-sm text-gray-600">الهندسة المدنية والمعمارية والكهربائية</p>
                      </div>
                    </div>
      
                    {/* Arts College */}
                    <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
                      <div className="p-6 text-center">
                        <PixelIcon type="book-open" className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                          كلية الآداب
                        </h3>
                        <p className="text-sm text-gray-600">اللغة العربية، الإنجليزية، والتاريخ</p>
                      </div>
                    </div>
      
                    {/* Media College */}
                    <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
                      <div className="p-6 text-center">
                        <PixelIcon type="mic" className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                          كلية الإعلام
                        </h3>
                        <p className="text-sm text-gray-600">الصحافة والإذاعة والتلفزيون</p>
                      </div>
                    </div>
      
                    {/* Arts & Design College */}
                    <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
                      <div className="p-6 text-center">
                        <PixelIcon type="palette" className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                          كلية الفنون
                        </h3>
                        <p className="text-sm text-gray-600">الموسيقى، التصميم والفنون الجميلة</p>
                      </div>
                    </div>
      
                    {/* Nursing College */}
                    <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
                      <div className="p-6 text-center">
                        <PixelIcon type="heartbeat" className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                          كلية التمريض
                        </h3>
                        <p className="text-sm text-gray-600">الرعاية الصحية والتمريض السريري</p>
                      </div>
                    </div>
      
                    {/* Sharia College */}
                    <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
                      <div className="p-6 text-center">
                        <PixelIcon type="mosque" className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
                          كلية الشريعة
                        </h3>
                        <p className="text-sm text-gray-600">الشريعة الإسلامية وأصول الدين</p>
                      </div>
                    </div>
                
      </div>
    </div>
  );
}
