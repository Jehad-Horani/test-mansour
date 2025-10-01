export interface University {
  id: string
  name: string
  nameEn: string
  city: string
  majors: string[]
}

export interface Course {
  id: string
  title: string
  code: string
  major: "law" | "it" | "medical"
  university: string
  semester: string
  level: string
  instructor: string
  students: number
  description: string
  credits: number
}

export interface Ambassador {
  id: string
  name: string
  major: "law" | "it" | "medical"
  university: string
  year: string
  rating: number
  specialties: string[]
  available: boolean
  bio: string
  consultationPrice?: number
}

export interface StudySession {
  id: string
  title: string
  instructor: string
  date: string
  time: string
  participants: number
  maxParticipants: number
  price: string
  status: "متاح" | "مكتمل" | "ملغي"
  major: "law" | "it" | "medical"
  description: string
}

export interface MarketListing {
  id: string
  title: string
  description: string
  price: string
  seller: string
  category: "books" | "electronics" | "supplies" | "other"
  status: "متاح" | "مباع" | "محجوز"
  image: string
  major?: "law" | "it" | "medical"
  condition: "جديد" | "مستعمل - ممتاز" | "مستعمل - جيد" | "مستعمل - مقبول"
  createdAt: string
}

export interface Notebook {
  id: string
  title: string
  course: string
  courseCode: string
  uploadDate: string
  status: "approved" | "pending" | "rejected"
  views: number
  uploader: string
  reason?: string
  tags: string[]
  fileType: "pdf" | "image" | "document"
}

// Universities Data
export const universities: University[] = [
  {
    id: "ksu",
    name: "جامعة الملك سعود",
    nameEn: "King Saud University",
    city: "الرياض",
    majors: ["law", "it", "medical"],
  },
  {
    id: "kau",
    name: "جامعة الملك عبدالعزيز",
    nameEn: "King Abdulaziz University",
    city: "جدة",
    majors: ["law", "it", "medical"],
  },
  {
    id: "kfupm",
    name: "جامعة الملك فهد للبترول والمعادن",
    nameEn: "King Fahd University of Petroleum and Minerals",
    city: "الظهران",
    majors: ["it"],
  },
  {
    id: "imam",
    name: "جامعة الإمام محمد بن سعود الإسلامية",
    nameEn: "Imam Mohammad Ibn Saud Islamic University",
    city: "الرياض",
    majors: ["law"],
  },
  {
    id: "uod",
    name: "جامعة الدمام",
    nameEn: "University of Dammam",
    city: "الدمام",
    majors: ["medical", "it"],
  },
  {
    id: "ju",
    name: "الجامعة الأردنية",
    nameEn: "University of Jordan",
    city: "عمان",
    majors: ["law", "it", "medical"],
  },
  {
    id: "just",
    name: "جامعة العلوم والتكنولوجيا الأردنية",
    nameEn: "Jordan University of Science and Technology",
    city: "إربد",
    majors: ["it", "medical"],
  },
  {
    id: "yarmouk",
    name: "جامعة اليرموك",
    nameEn: "Yarmouk University",
    city: "إربد",
    majors: ["law", "it"],
  },
  {
    id: "mutah",
    name: "جامعة مؤتة",
    nameEn: "Mutah University",
    city: "الكرك",
    majors: ["law", "medical"],
  },
  {
    id: "aau",
    name: "جامعة عمان العربية",
    nameEn: "Amman Arab University",
    city: "عمان",
    majors: ["law", "it"],
  },
]

// Courses Data
export const courses: Course[] = [
  // Law Courses
  {
    id: "law-101",
    title: "مبادئ القانون",
    code: "LAW 101",
    major: "law",
    university: "جامعة الملك سعود",
    semester: "الفصل الأول",
    level: "المستوى الأول",
    instructor: "د. أحمد العلي",
    students: 245,
    description: "مقدمة شاملة في أساسيات القانون والنظام القانوني السعودي، تشمل مصادر القانون وتطبيقاته",
    credits: 3,
  },
  {
    id: "law-201",
    title: "القانون المدني",
    code: "LAW 201",
    major: "law",
    university: "جامعة الملك عبدالعزيز",
    semester: "الفصل الثاني",
    level: "المستوى الثاني",
    instructor: "د. فاطمة الزهراني",
    students: 189,
    description: "دراسة معمقة للقانون المدني والالتزامات والعقود في النظام السعودي",
    credits: 4,
  },
  {
    id: "law-301",
    title: "القانون الجنائي",
    code: "LAW 301",
    major: "law",
    university: "جامعة الإمام",
    semester: "الفصل الأول",
    level: "المستوى الثالث",
    instructor: "د. محمد القحطاني",
    students: 156,
    description: "أحكام القانون الجنائي والعقوبات في النظام السعودي",
    credits: 4,
  },
  {
    id: "law-401",
    title: "قانون الأحوال الشخصية",
    code: "LAW 401",
    major: "law",
    university: "جامعة الملك سعود",
    semester: "الفصل الثاني",
    level: "المستوى الرابع",
    instructor: "د. سارة المطيري",
    students: 98,
    description: "دراسة أحكام الأحوال الشخصية في الفقه الإسلامي والنظام السعودي",
    credits: 3,
  },
  {
    id: "law-101",
    title: "مبادئ القانون",
    code: "LAW 101",
    major: "law",
    university: "الجامعة الأردنية",
    semester: "الفصل الأول",
    level: "المستوى الأول",
    instructor: "د. أحمد العلي",
    students: 245,
    description: "مقدمة شاملة في أساسيات القانون والنظام القانوني الأردني، تشمل مصادر القانون وتطبيقاته",
    credits: 3,
  },
  {
    id: "law-201",
    title: "القانون المدني",
    code: "LAW 201",
    major: "law",
    university: "جامعة اليرموك",
    semester: "الفصل الثاني",
    level: "المستوى الثاني",
    instructor: "د. فاطمة الزهراني",
    students: 189,
    description: "دراسة معمقة للقانون المدني والالتزامات والعقود في النظام الأردني",
    credits: 4,
  },
  {
    id: "law-301",
    title: "القانون الجنائي",
    code: "LAW 301",
    major: "law",
    university: "جامعة مؤتة",
    semester: "الفصل الأول",
    level: "المستوى الثالث",
    instructor: "د. محمد القحطاني",
    students: 156,
    description: "أحكام القانون الجنائي والعقوبات في النظام الأردني",
    credits: 4,
  },
  {
    id: "law-401",
    title: "قانون الأحوال الشخصية",
    code: "LAW 401",
    major: "law",
    university: "الجامعة الأردنية",
    semester: "الفصل الثاني",
    level: "المستوى الرابع",
    instructor: "د. سارة المطيري",
    students: 98,
    description: "دراسة أحكام الأحوال الشخصية في الفقه الإسلامي والنظام الأردني",
    credits: 3,
  },
  // IT Courses
  {
    id: "it-101",
    title: "مقدمة في البرمجة",
    code: "CS 101",
    major: "it",
    university: "جامعة الملك فهد",
    semester: "الفصل الأول",
    level: "المستوى الأول",
    instructor: "د. عبدالله الشهري",
    students: 320,
    description: "تعلم أساسيات البرمجة باستخدام لغة Python والمفاهيم الأساسية للحاسوب",
    credits: 4,
  },
  {
    id: "it-201",
    title: "هياكل البيانات",
    code: "CS 201",
    major: "it",
    university: "جامعة الملك سعود",
    semester: "الفصل الثاني",
    level: "المستوى الثاني",
    instructor: "د. نورا العتيبي",
    students: 275,
    description: "دراسة هياكل البيانات المختلفة والخوارزميات الأساسية",
    credits: 4,
  },
  {
    id: "it-301",
    title: "قواعد البيانات",
    code: "CS 301",
    major: "it",
    university: "جامعة الملك عبدالعزيز",
    semester: "الفصل الأول",
    level: "المستوى الثالث",
    instructor: "د. خالد الغامدي",
    students: 198,
    description: "تصميم وإدارة قواعد البيانات العلائقية باستخدام SQL",
    credits: 3,
  },
  {
    id: "it-401",
    title: "أمن المعلومات",
    code: "CS 401",
    major: "it",
    university: "جامعة الملك فهد",
    semester: "الفصل الثاني",
    level: "المستوى الرابع",
    instructor: "د. ريم الدوسري",
    students: 145,
    description: "مبادئ أمن المعلومات والحماية السيبرانية",
    credits: 3,
  },
  {
    id: "it-101",
    title: "مقدمة في البرمجة",
    code: "CS 101",
    major: "it",
    university: "جامعة العلوم والتكنولوجيا الأردنية",
    semester: "الفصل الأول",
    level: "المستوى الأول",
    instructor: "د. عبدالله الشهري",
    students: 320,
    description: "تعلم أساسيات البرمجة باستخدام لغة Python والمفاهيم الأساسية للحاسوب",
    credits: 4,
  },
  {
    id: "it-201",
    title: "هياكل البيانات",
    code: "CS 201",
    major: "it",
    university: "الجامعة الأردنية",
    semester: "الفصل الثاني",
    level: "المستوى الثاني",
    instructor: "د. نورا العتيبي",
    students: 275,
    description: "دراسة هياكل البيانات المختلفة والخوارزميات الأساسية",
    credits: 4,
  },
  {
    id: "it-301",
    title: "قواعد البيانات",
    code: "CS 301",
    major: "it",
    university: "جامعة اليرموك",
    semester: "الفصل الأول",
    level: "المستوى الثالث",
    instructor: "د. خالد الغامدي",
    students: 198,
    description: "تصميم وإدارة قواعد البيانات العلائقية باستخدام SQL",
    credits: 3,
  },
  {
    id: "it-401",
    title: "أمن المعلومات",
    code: "CS 401",
    major: "it",
    university: "جامعة العلوم والتكنولوجيا الأردنية",
    semester: "الفصل الثاني",
    level: "المستوى الرابع",
    instructor: "د. ريم الدوسري",
    students: 145,
    description: "مبادئ أمن المعلومات والحماية السيبرانية",
    credits: 3,
  },
  // Medical Courses
  {
    id: "med-101",
    title: "علم التشريح",
    code: "MED 101",
    major: "medical",
    university: "جامعة الملك سعود",
    semester: "الفصل الأول",
    level: "السنة الأولى",
    instructor: "د. محمد الأحمد",
    students: 180,
    description: "دراسة شاملة لتشريح جسم الإنسان وأجهزته المختلفة",
    credits: 6,
  },
  {
    id: "med-201",
    title: "علم وظائف الأعضاء",
    code: "MED 201",
    major: "medical",
    university: "جامعة الملك عبدالعزيز",
    semester: "الفصل الثاني",
    level: "السنة الثانية",
    instructor: "د. هند الزهراني",
    students: 165,
    description: "دراسة وظائف أعضاء الجسم والعمليات الحيوية",
    credits: 5,
  },
  {
    id: "med-301",
    title: "علم الأمراض",
    code: "MED 301",
    major: "medical",
    university: "جامعة الدمام",
    semester: "الفصل الأول",
    level: "السنة الثالثة",
    instructor: "د. عبدالرحمن القحطاني",
    students: 142,
    description: "دراسة الأمراض وأسبابها وتأثيرها على الجسم",
    credits: 5,
  },
  {
    id: "med-401",
    title: "الطب الباطني",
    code: "MED 401",
    major: "medical",
    university: "جامعة الملك سعود",
    semester: "الفصل الثاني",
    level: "السنة الرابعة",
    instructor: "د. فاطمة العتيبي",
    students: 98,
    description: "تشخيص وعلاج الأمراض الباطنية المختلفة",
    credits: 6,
  },
  {
    id: "med-101",
    title: "علم التشريح",
    code: "MED 101",
    major: "medical",
    university: "الجامعة الأردنية",
    semester: "الفصل الأول",
    level: "السنة الأولى",
    instructor: "د. محمد الأحمد",
    students: 180,
    description: "دراسة شاملة لتشريح جسم الإنسان وأجهزته المختلفة",
    credits: 6,
  },
  {
    id: "med-201",
    title: "علم وظائف الأعضاء",
    code: "MED 201",
    major: "medical",
    university: "الجامعة العلوم والتكنولوجيا الأردنية",
    semester: "الفصل الثاني",
    level: "السنة الثانية",
    instructor: "د. هند الزهراني",
    students: 165,
    description: "دراسة وظائف أعضاء الجسم والعمليات الحيوية",
    credits: 5,
  },
  {
    id: "med-301",
    title: "علم الأمراض",
    code: "MED 301",
    major: "medical",
    university: "جامعة مؤتة",
    semester: "الفصل الأول",
    level: "السنة الثالثة",
    instructor: "د. عبدالرحمن القحطاني",
    students: 142,
    description: "دراسة الأمراض وأسبابها وتأثيرها على الجسم",
    credits: 5,
  },
  {
    id: "med-401",
    title: "الطب الباطني",
    code: "MED 401",
    major: "medical",
    university: "الجامعة الأردنية",
    semester: "الفصل الثاني",
    level: "السنة الرابعة",
    instructor: "د. فاطمة العتيبي",
    students: 98,
    description: "تشخيص وعلاج الأمراض الباطنية المختلفة",
    credits: 6,
  },
]

// Ambassadors Data
export const ambassadors: Ambassador[] = [
  // Law Ambassadors
  {
    id: "amb-law-1",
    name: "أحمد محمد العلي",
    major: "law",
    university: "جامعة الملك سعود",
    year: "السنة الرابعة",
    rating: 4.8,
    specialties: ["القانون المدني", "القانون الجنائي", "قانون الأحوال الشخصية"],
    available: true,
    bio: "طالب متفوق في كلية القانون، حاصل على عدة جوائز أكاديمية ومتطوع في العيادة القانونية",
    consultationPrice: 100,
  },
  {
    id: "amb-law-2",
    name: "سارة عبدالله المطيري",
    major: "law",
    university: "جامعة الملك سعود",
    year: "السنة الثالثة",
    rating: 4.9,
    specialties: ["القانون التجاري", "قانون العمل", "القانون الإداري"],
    available: true,
    bio: "متخصصة في القانون التجاري ولديها خبرة في التدريب والإرشاد الأكاديمي",
    consultationPrice: 80,
  },
  {
    id: "amb-law-1",
    name: "أحمد محمد العلي",
    major: "law",
    university: "الجامعة الأردنية",
    year: "السنة الرابعة",
    rating: 4.8,
    specialties: ["القانون المدني", "القانون الجنائي", "قانون الأحوال الشخصية"],
    available: true,
    bio: "طالب متفوق في كلية القانون، حاصل على عدة جوائز أكاديمية ومتطوع في العيادة القانونية",
    consultationPrice: 15,
  },
  {
    id: "amb-law-2",
    name: "سارة عبدالله المطيري",
    major: "law",
    university: "جامعة اليرموك",
    year: "السنة الثالثة",
    rating: 4.9,
    specialties: ["القانون التجاري", "قانون العمل", "القانون الإداري"],
    available: true,
    bio: "متخصصة في القانون التجاري ولديها خبرة في التدريب والإرشاد الأكاديمي",
    consultationPrice: 12,
  },
  // IT Ambassadors
  {
    id: "amb-it-1",
    name: "فاطمة عبدالله النمر",
    major: "it",
    university: "جامعة الملك فهد",
    year: "السنة الثالثة",
    rating: 4.9,
    specialties: ["البرمجة", "قواعد البيانات", "تطوير الويب"],
    available: false,
    bio: "مطورة مواقع ماهرة ومتطوعة في تعليم البرمجة للمبتدئين",
    consultationPrice: 120,
  },
  {
    id: "amb-it-2",
    name: "خالد الغامدي",
    major: "it",
    university: "جامعة الملك عبدالعزيز",
    year: "السنة الرابعة",
    rating: 4.7,
    specialties: ["أمن المعلومات", "الشبكات", "الذكاء الاصطناعي"],
    available: true,
    bio: "متخصص في أمن المعلومات وحاصل على شهادات مهنية في الأمن السيبراني",
    consultationPrice: 150,
  },
  {
    id: "amb-it-1",
    name: "فاطمة عبدالله النمر",
    major: "it",
    university: "جامعة العلوم والتكنولوجيا الأردنية",
    year: "السنة الثالثة",
    rating: 4.9,
    specialties: ["البرمجة", "قواعد البيانات", "تطوير الويب"],
    available: false,
    bio: "مطورة مواقع ماهرة ومتطوعة في تعليم البرمجة للمبتدئين",
    consultationPrice: 18,
  },
  {
    id: "amb-it-2",
    name: "خالد الغامدي",
    major: "it",
    university: "جامعة اليرموك",
    year: "السنة الرابعة",
    rating: 4.7,
    specialties: ["أمن المعلومات", "الشبكات", "الذكاء الاصطناعي"],
    available: true,
    bio: "متخصص في أمن المعلومات وحاصل على شهادات مهنية في الأمن السيبراني",
    consultationPrice: 22,
  },
  // Medical Ambassadors
  {
    id: "amb-med-1",
    name: "نورا الشهري",
    major: "medical",
    university: "جامعة الملك سعود",
    year: "السنة الخامسة",
    rating: 4.6,
    specialties: ["التشريح", "علم وظائف الأعضاء", "الطب الباطني"],
    available: true,
    bio: "طالبة طب متميزة ومتطوعة في المستشفى الجامعي",
    consultationPrice: 200,
  },
  {
    id: "amb-med-2",
    name: "عبدالرحمن القحطاني",
    major: "medical",
    university: "جامعة الدمام",
    year: "السنة السادسة",
    rating: 4.8,
    specialties: ["الجراحة", "طب الطوارئ", "علم الأمراض"],
    available: true,
    bio: "طالب في السنة الأخيرة من كلية الطب ومتدرب في قسم الطوارئ",
    consultationPrice: 250,
  },
  {
    id: "amb-med-1",
    name: "نورا الشهري",
    major: "medical",
    university: "الجامعة الأردنية",
    year: "السنة الخامسة",
    rating: 4.6,
    specialties: ["التشريح", "علم وظائف الأعضاء", "الطب الباطني"],
    available: true,
    bio: "طالبة طب متميزة ومتطوعة في المستشفى الجامعي",
    consultationPrice: 30,
  },
  {
    id: "amb-med-2",
    name: "عبدالرحمن القحطاني",
    major: "medical",
    university: "جامعة مؤتة",
    year: "السنة السادسة",
    rating: 4.8,
    specialties: ["الجراحة", "طب الطوارئ", "علم الأمراض"],
    available: true,
    bio: "طالب في السنة الأخيرة من كلية الطب ومتدرب في قسم الطوارئ",
    consultationPrice: 35,
  },
]

// Study Sessions Data
export const studySessions: StudySession[] = [
  {
    id: "session-1",
    title: "جلسة مراجعة القانون المدني",
    instructor: "د. أحمد العلي",
    date: "2024-02-10",
    time: "19:00 - 21:00",
    participants: 12,
    maxParticipants: 15,
    price: "مجاني",
    status: "متاح",
    major: "law",
    description: "مراجعة شاملة لأهم مواضيع القانون المدني مع حل الأسئلة التطبيقية",
  },
  {
    id: "session-2",
    title: "ورشة البرمجة المتقدمة",
    instructor: "م. سارة الأحمد",
    date: "2024-02-12",
    time: "20:00 - 22:00",
    participants: 8,
    maxParticipants: 10,
    price: "50 دينار",
    status: "متاح",
    major: "it",
    description: "ورشة عملية في البرمجة المتقدمة باستخدام Python وتطوير المشاريع",
  },
  {
    id: "session-3",
    title: "مراجعة التشريح",
    instructor: "د. محمد الزهراني",
    date: "2024-02-08",
    time: "18:00 - 20:00",
    participants: 20,
    maxParticipants: 20,
    price: "30 دينار",
    status: "مكتمل",
    major: "medical",
    description: "مراجعة مكثفة لعلم التشريح مع استخدام النماذج ثلاثية الأبعاد",
  },
  {
    id: "session-4",
    title: "جلسة قانون الأحوال الشخصية",
    instructor: "د. فاطمة المطيري",
    date: "2024-02-15",
    time: "17:00 - 19:00",
    participants: 5,
    maxParticipants: 12,
    price: "مجاني",
    status: "متاح",
    major: "law",
    description: "دراسة حالات عملية في قانون الأحوال الشخصية",
  },
  {
    id: "session-2",
    title: "ورشة البرمجة المتقدمة",
    instructor: "م. سارة الأحمد",
    date: "2024-02-12",
    time: "20:00 - 22:00",
    participants: 8,
    maxParticipants: 10,
    price: "7 دنانير",
    status: "متاح",
    major: "it",
    description: "ورشة عملية في البرمجة المتقدمة باستخدام Python وتطوير المشاريع",
  },
  {
    id: "session-3",
    title: "مراجعة التشريح",
    instructor: "د. محمد الزهراني",
    date: "2024-02-08",
    time: "18:00 - 20:00",
    participants: 20,
    maxParticipants: 20,
    price: "4 دنانير",
    status: "مكتمل",
    major: "medical",
    description: "مراجعة مكثفة لعلم التشريح مع استخدام النماذج ثلاثية الأبعاد",
  },
]

// Market Listings Data
export const marketListings: MarketListing[] = [
  {
    id: "listing-1",
    title: "كتاب مبادئ القانون - طبعة حديثة",
    description: "كتاب في حالة ممتازة، استخدم لفصل واحد فقط. يشمل جميع الملاحظات والتلخيصات المهمة",
    price: "120 دينار",
    seller: "أحمد محمد",
    category: "books",
    status: "متاح",
    image: "/law-book.png",
    major: "law",
    condition: "مستعمل - ممتاز",
    createdAt: "2024-01-15",
  },
  {
    id: "listing-2",
    title: "لابتوب للبرمجة - مواصفات عالية",
    description: "لابتوب Dell XPS 13 مناسب للبرمجة والتطوير، حالة جيدة جداً. معالج Intel i7، ذاكرة 16GB",
    price: "2500 دينار",
    seller: "فاطمة علي",
    category: "electronics",
    status: "متاح",
    image: "/modern-laptop.png",
    major: "it",
    condition: "مستعمل - جيد",
    createdAt: "2024-01-20",
  },
  {
    id: "listing-3",
    title: "مجموعة كتب طبية",
    description: "مجموعة من الكتب الطبية للسنوات الأولى تشمل التشريح وعلم وظائف الأعضاء",
    price: "800 دينار",
    seller: "خالد الأحمد",
    category: "books",
    status: "مباع",
    image: "/medical-books.png",
    major: "medical",
    condition: "مستعمل - ممتاز",
    createdAt: "2024-01-10",
  },
  {
    id: "listing-4",
    title: "آلة حاسبة علمية Casio",
    description: "آلة حاسبة علمية متقدمة، مناسبة لجميع التخصصات العلمية",
    price: "80 دينار",
    seller: "نورا الشهري",
    category: "supplies",
    status: "متاح",
    image: "/calculator.png",
    condition: "مستعمل - ممتاز",
    createdAt: "2024-01-25",
  },
  {
    id: "listing-5",
    title: "مجموعة أدوات الرسم الهندسي",
    description: "مجموعة كاملة من أدوات الرسم الهندسي، جديدة لم تستخدم",
    price: "150 دينار",
    seller: "عبدالله الغامدي",
    category: "supplies",
    status: "متاح",
    image: "/drawing-tools.png",
    major: "it",
    condition: "جديد",
    createdAt: "2024-01-22",
  },
  {
    id: "listing-1",
    title: "كتاب مبادئ القانون - طبعة حديثة",
    description: "كتاب في حالة ممتازة، استخدم لفصل واحد فقط. يشمل جميع الملاحظات والتلخيصات المهمة",
    price: "18 دينار",
    seller: "أحمد محمد",
    category: "books",
    status: "متاح",
    image: "/law-book.png",
    major: "law",
    condition: "مستعمل - ممتاز",
    createdAt: "2024-01-15",
  },
  {
    id: "listing-2",
    title: "لابتوب للبرمجة - مواصفات عالية",
    description: "لابتوب Dell XPS 13 مناسب للبرمجة والتطوير، حالة جيدة جداً. معالج Intel i7، ذاكرة 16GB",
    price: "350 دينار",
    seller: "فاطمة علي",
    category: "electronics",
    status: "متاح",
    image: "/modern-laptop.png",
    major: "it",
    condition: "مستعمل - جيد",
    createdAt: "2024-01-20",
  },
  {
    id: "listing-3",
    title: "مجموعة كتب طبية",
    description: "مجموعة من الكتب الطبية للسنوات الأولى تشمل التشريح وعلم وظائف الأعضاء",
    price: "110 دينار",
    seller: "خالد الأحمد",
    category: "books",
    status: "مباع",
    image: "/medical-books.png",
    major: "medical",
    condition: "مستعمل - ممتاز",
    createdAt: "2024-01-10",
  },
  {
    id: "listing-4",
    title: "آلة حاسبة علمية Casio",
    description: "آلة حاسبة علمية متقدمة، مناسبة لجميع التخصصات العلمية",
    price: "12 دينار",
    seller: "نورا الشهري",
    category: "supplies",
    status: "متاح",
    image: "/calculator.png",
    condition: "مستعمل - ممتاز",
    createdAt: "2024-01-25",
  },
  {
    id: "listing-5",
    title: "مجموعة أدوات الرسم الهندسي",
    description: "مجموعة كاملة من أدوات الرسم الهندسي، جديدة لم تستخدم",
    price: "22 دينار",
    seller: "عبدالله الغامدي",
    category: "supplies",
    status: "متاح",
    image: "/drawing-tools.png",
    major: "it",
    condition: "جديد",
    createdAt: "2024-01-22",
  },
]

// Notebooks Data
export const notebooks: Notebook[] = [
  {
    id: "notebook-1",
    title: "محاضرة مبادئ القانون - الأسبوع 1",
    course: "مبادئ القانون",
    courseCode: "LAW 101",
    uploadDate: "2024-01-15",
    status: "approved",
    views: 45,
    uploader: "أحمد محمد",
    tags: ["مقدمة", "أساسيات", "مصادر القانون"],
    fileType: "pdf",
  },
  {
    id: "notebook-2",
    title: "محاضرة البرمجة - المتغيرات والدوال",
    course: "مقدمة في البرمجة",
    courseCode: "CS 101",
    uploadDate: "2024-01-20",
    status: "pending",
    views: 0,
    uploader: "فاطمة علي",
    tags: ["متغيرات", "دوال", "Python"],
    fileType: "pdf",
  },
  {
    id: "notebook-3",
    title: "محاضرة التشريح - الجهاز العصبي",
    course: "علم التشريح",
    courseCode: "MED 101",
    uploadDate: "2024-01-18",
    status: "rejected",
    views: 0,
    uploader: "خالد الأحمد",
    reason: "جودة الصورة غير واضحة، يرجى إعادة المسح بدقة أعلى",
    tags: ["جهاز عصبي", "تشريح", "أعصاب"],
    fileType: "image",
  },
  {
    id: "notebook-4",
    title: "ملخص القانون المدني - الفصل الثاني",
    course: "القانون المدني",
    courseCode: "LAW 201",
    uploadDate: "2024-01-22",
    status: "approved",
    views: 78,
    uploader: "سارة المطيري",
    tags: ["عقود", "التزامات", "ملخص"],
    fileType: "document",
  },
  {
    id: "notebook-5",
    title: "شرح هياكل البيانات - المصفوفات",
    course: "هياكل البيانات",
    courseCode: "CS 201",
    uploadDate: "2024-01-25",
    status: "approved",
    views: 32,
    uploader: "عبدالله الشهري",
    tags: ["مصفوفات", "arrays", "خوارزميات"],
    fileType: "pdf",
  },
]

// Helper functions to get data by filters
export const getCoursesByMajor = (major: "law" | "it" | "medical") => {
  return courses.filter((course) => course.major === major)
}

export const getAmbassadorsByMajor = (major: "law" | "it" | "medical") => {
  return ambassadors.filter((ambassador) => ambassador.major === major)
}

export const getAmbassadorsByUniversity = (university: string) => {
  return ambassadors.filter((ambassador) => ambassador.university === university)
}

export const getSessionsByMajor = (major: "law" | "it" | "medical") => {
  return studySessions.filter((session) => session.major === major)
}

export const getListingsByMajor = (major: "law" | "it" | "medical") => {
  return marketListings.filter((listing) => listing.major === major)
}

export const getListingsByCategory = (category: "books" | "electronics" | "supplies" | "other") => {
  return marketListings.filter((listing) => listing.category === category)
}

export const getCourseById = (id: string) => {
  return courses.find((course) => course.id === id)
}

export const getAmbassadorById = (id: string) => {
  return ambassadors.find((ambassador) => ambassador.id === id)
}

export const getUniversityById = (id: string) => {
  return universities.find((university) => university.id === id)
}
