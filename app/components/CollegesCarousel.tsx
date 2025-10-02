"use client";

import PixelIcon from "./pixel-icon";
import { RetroWindow } from "./retro-window";

export default function HorizontalScrollingCarousel() {
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

  return (
              <RetroWindow  title="الكليات المتاحة">
    
    <div className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 md:py-16">
      {/* العنوان */}
      <div className="mb-6 md:mb-8 text-center px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
          كليات تخصص.كُم
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          استكشف جميع الكليات المتاحة
        </p>
      </div>

      {/* الكاروسيل */}
      <div className="relative px-4">
        <div
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        >
          {colleges.map((college, index) => (
            <div
              key={index}
              className="flex-shrink-0 snap-center w-64 sm:w-72 md:w-80 
                         bg-white rounded-2xl shadow-lg 
                         p-6 text-center 
                         hover:shadow-xl transition-shadow duration-300 
                         border-2 border-purple-100"
            >
              <div className="mb-4">
                <PixelIcon
                  type={college.icon}
                  className="w-12 h-12 mx-auto"
                />
              </div>
              <h3 className="font-bold text-lg md:text-xl mb-2 text-gray-800">
                {college.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {college.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
              </RetroWindow>

  );
}
