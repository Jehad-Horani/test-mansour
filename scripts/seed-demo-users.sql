-- إنشاء مستخدمين تجريبيين للاختبار
-- هذا السكريبت سيضيف بيانات تجريبية للمنصة

-- إدراج مستخدمين تجريبيين في جدول profiles
INSERT INTO profiles (
  id,
  name,
  role,
  university,
  college,
  major,
  year,
  study_level,
  graduation_year,
  phone,
  bio,
  avatar_url,
  subscription_tier,
  subscription_expires_at,
  preferences,
  stats,
  created_at,
  updated_at
) VALUES 
-- طالب تجريبي 1
(
  '11111111-1111-1111-1111-111111111111',
  'أحمد محمد الطالب',
  'student',
  'جامعة الملك سعود',
  'كلية الهندسة',
  'هندسة الحاسوب',
  'السنة الثالثة',
  'بكالوريوس',
  '2025',
  '+966501234567',
  'طالب مجتهد في هندسة الحاسوب، أحب البرمجة والتقنية',
  '/placeholder.svg?height=100&width=100',
  'premium',
  '2025-12-31 23:59:59',
  '{"notifications": true, "theme": "light", "language": "ar"}',
  '{"questions_asked": 15, "answers_given": 8, "books_sold": 3, "notebooks_shared": 5}',
  NOW(),
  NOW()
),
-- طالب تجريبي 2
(
  '22222222-2222-2222-2222-222222222222',
  'فاطمة أحمد السفيرة',
  'ambassador',
  'جامعة الملك عبدالعزيز',
  'كلية الطب',
  'الطب البشري',
  'السنة السادسة',
  'بكالوريوس',
  '2024',
  '+966507654321',
  'سفيرة متخصصة في الطب، خبرة 4 سنوات في التدريس والإرشاد الأكاديمي',
  '/placeholder.svg?height=100&width=100',
  'premium',
  '2025-12-31 23:59:59',
  '{"notifications": true, "theme": "dark", "language": "ar"}',
  '{"sessions_completed": 45, "rating": 4.8, "earnings": 15000, "students_helped": 120}',
  NOW(),
  NOW()
),
-- طالب تجريبي 3
(
  '33333333-3333-3333-3333-333333333333',
  'خالد عبدالله المهندس',
  'student',
  'جامعة الملك فهد للبترول والمعادن',
  'كلية الهندسة',
  'هندسة البترول',
  'السنة الرابعة',
  'بكالوريوس',
  '2024',
  '+966509876543',
  'طالب متفوق في هندسة البترول، مهتم بالطاقة المتجددة',
  '/placeholder.svg?height=100&width=100',
  'basic',
  '2024-06-30 23:59:59',
  '{"notifications": false, "theme": "light", "language": "ar"}',
  '{"questions_asked": 8, "answers_given": 12, "books_bought": 5, "notebooks_downloaded": 25}',
  NOW(),
  NOW()
);

-- إدراج بيانات السفراء
INSERT INTO ambassadors (
  id,
  user_id,
  specialization,
  university_name,
  college,
  major,
  graduation_year,
  gpa,
  experience_years,
  hourly_rate,
  currency,
  bio,
  skills,
  languages,
  availability_schedule,
  is_active,
  is_verified,
  verified_at,
  total_sessions,
  total_earnings,
  rating,
  created_at,
  updated_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  'الطب البشري والعلوم الصحية',
  'جامعة الملك عبدالعزيز',
  'كلية الطب',
  'الطب البشري',
  2024,
  4.85,
  4,
  150.00,
  'SAR',
  'سفيرة متخصصة في الطب البشري مع خبرة 4 سنوات في التدريس والإرشاد الأكاديمي. حاصلة على عدة شهادات في التعليم الطبي.',
  ARRAY['التشريح', 'علم وظائف الأعضاء', 'الكيمياء الحيوية', 'علم الأمراض', 'الطب الباطني'],
  ARRAY['العربية', 'الإنجليزية'],
  '{"sunday": ["09:00-12:00", "14:00-17:00"], "monday": ["10:00-13:00", "15:00-18:00"], "tuesday": ["09:00-12:00"], "wednesday": ["14:00-17:00"], "thursday": ["10:00-13:00", "15:00-18:00"], "friday": [], "saturday": ["09:00-12:00"]}',
  true,
  true,
  NOW(),
  45,
  15000.00,
  4.8,
  NOW(),
  NOW()
);

-- إدراج بعض الكتب التجريبية
INSERT INTO books (
  id,
  title,
  author,
  isbn,
  edition,
  publisher,
  publication_year,
  subject_name,
  course_code,
  university_name,
  college,
  major,
  original_price,
  selling_price,
  currency,
  condition,
  description,
  seller_id,
  is_available,
  created_at,
  updated_at
) VALUES 
(
  '44444444-4444-4444-4444-444444444444',
  'مبادئ الهندسة الكهربائية',
  'د. محمد الأحمد',
  '978-1234567890',
  'الطبعة الثالثة',
  'دار المعرفة',
  2023,
  'الدوائر الكهربائية',
  'EE201',
  'جامعة الملك سعود',
  'كلية الهندسة',
  'هندسة الحاسوب',
  250.00,
  180.00,
  'SAR',
  'ممتاز',
  'كتاب في حالة ممتازة، مستخدم لفصل دراسي واحد فقط. يحتوي على جميع الفصول مع أمثلة محلولة.',
  '11111111-1111-1111-1111-111111111111',
  true,
  NOW(),
  NOW()
),
(
  '55555555-5555-5555-5555-555555555555',
  'أساسيات علم التشريح',
  'د. سارة الزهراني',
  '978-9876543210',
  'الطبعة الخامسة',
  'المكتبة الطبية',
  2024,
  'التشريح البشري',
  'MED101',
  'جامعة الملك عبدالعزيز',
  'كلية الطب',
  'الطب البشري',
  400.00,
  320.00,
  'SAR',
  'جيد جداً',
  'كتاب شامل لعلم التشريح مع رسوم توضيحية ملونة. بعض التظليل بالقلم الرصاص.',
  '22222222-2222-2222-2222-222222222222',
  true,
  NOW(),
  NOW()
);

-- إدراج بعض الأسئلة التجريبية
INSERT INTO questions (
  id,
  title,
  content,
  subject_name,
  course_code,
  university_name,
  college,
  major,
  semester,
  difficulty_level,
  question_type,
  tags,
  author_id,
  answers_count,
  votes_count,
  views_count,
  is_featured,
  is_solved,
  created_at,
  updated_at
) VALUES 
(
  '66666666-6666-6666-6666-666666666666',
  'كيفية حساب التيار في الدائرة المتوازية؟',
  'لدي دائرة كهربائية متوازية تحتوي على ثلاث مقاومات (10Ω، 20Ω، 30Ω) متصلة بمصدر جهد 12V. كيف يمكنني حساب التيار الكلي والتيار في كل فرع؟',
  'الدوائر الكهربائية',
  'EE201',
  'جامعة الملك سعود',
  'كلية الهندسة',
  'هندسة الحاسوب',
  'الفصل الأول',
  'متوسط',
  'حل مسائل',
  ARRAY['دوائر كهربائية', 'قانون أوم', 'مقاومات متوازية'],
  '11111111-1111-1111-1111-111111111111',
  2,
  5,
  45,
  true,
  true,
  NOW(),
  NOW()
),
(
  '77777777-7777-7777-7777-777777777777',
  'ما هي وظائف الكبد في جسم الإنسان؟',
  'أحتاج شرح مفصل عن الوظائف الأساسية للكبد في جسم الإنسان، خاصة الوظائف الأيضية والتخلص من السموم.',
  'علم وظائف الأعضاء',
  'MED201',
  'جامعة الملك عبدالعزيز',
  'كلية الطب',
  'الطب البشري',
  'الفصل الثاني',
  'سهل',
  'شرح مفهوم',
  ARRAY['الكبد', 'وظائف الأعضاء', 'الجهاز الهضمي'],
  '33333333-3333-3333-3333-333333333333',
  1,
  3,
  28,
  false,
  true,
  NOW(),
  NOW()
);

-- إدراج إجابات تجريبية
INSERT INTO answers (
  id,
  question_id,
  author_id,
  content,
  is_accepted,
  votes_count,
  created_at,
  updated_at,
  accepted_at
) VALUES 
(
  '88888888-8888-8888-8888-888888888888',
  '66666666-6666-6666-6666-666666666666',
  '22222222-2222-2222-2222-222222222222',
  'لحساب التيار في الدائرة المتوازية:

1. احسب المقاومة الكلية المكافئة:
   1/Rtotal = 1/R1 + 1/R2 + 1/R3
   1/Rtotal = 1/10 + 1/20 + 1/30 = 0.1 + 0.05 + 0.033 = 0.183
   Rtotal = 5.46Ω

2. احسب التيار الكلي باستخدام قانون أوم:
   Itotal = V/Rtotal = 12V/5.46Ω = 2.2A

3. احسب التيار في كل فرع:
   I1 = V/R1 = 12V/10Ω = 1.2A
   I2 = V/R2 = 12V/20Ω = 0.6A  
   I3 = V/R3 = 12V/30Ω = 0.4A

للتحقق: Itotal = I1 + I2 + I3 = 1.2 + 0.6 + 0.4 = 2.2A ✓',
  true,
  8,
  NOW(),
  NOW(),
  NOW()
),
(
  '99999999-9999-9999-9999-999999999999',
  '77777777-7777-7777-7777-777777777777',
  '22222222-2222-2222-2222-222222222222',
  'الكبد له وظائف متعددة ومهمة في الجسم:

**الوظائف الأيضية:**
- تصنيع البروتينات (الألبومين، عوامل التخثر)
- تخزين الجلوكوز على شكل جليكوجين
- تحويل الدهون والكربوهيدرات
- إنتاج الصفراء لهضم الدهون

**إزالة السموم:**
- تنقية الدم من المواد الضارة
- تحويل الأمونيا إلى يوريا
- استقلاب الأدوية والكحول

**وظائف أخرى:**
- تخزين الفيتامينات (A, D, E, K, B12)
- تنظيم مستوى السكر في الدم
- إنتاج الكوليسترول المفيد',
  true,
  5,
  NOW(),
  NOW(),
  NOW()
);

-- إدراج بعض الملخصات التجريبية
INSERT INTO summaries (
  id,
  title,
  description,
  subject_name,
  university_name,
  college,
  major,
  semester,
  file_name,
  file_url,
  file_size,
  user_id,
  is_approved,
  approved_by,
  approved_at,
  created_at,
  updated_at
) VALUES 
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'ملخص شامل للدوائر الكهربائية',
  'ملخص مفصل يغطي جميع أنواع الدوائر الكهربائية مع أمثلة محلولة وقوانين مهمة',
  'الدوائر الكهربائية',
  'جامعة الملك سعود',
  'كلية الهندسة',
  'هندسة الحاسوب',
  'الفصل الأول',
  'ملخص_الدوائر_الكهربائية.pdf',
  '/placeholder.svg?height=400&width=300',
  2048576,
  '11111111-1111-1111-1111-111111111111',
  true,
  '22222222-2222-2222-2222-222222222222',
  NOW(),
  NOW(),
  NOW()
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'مراجعة علم التشريح - الجهاز العصبي',
  'مراجعة شاملة للجهاز العصبي مع رسوم توضيحية ومخططات مفيدة للامتحانات',
  'التشريح البشري',
  'جامعة الملك عبدالعزيز',
  'كلية الطب',
  'الطب البشري',
  'الفصل الثاني',
  'مراجعة_الجهاز_العصبي.pdf',
  '/placeholder.svg?height=400&width=300',
  3145728,
  '22222222-2222-2222-2222-222222222222',
  true,
  '22222222-2222-2222-2222-222222222222',
  NOW(),
  NOW(),
  NOW()
);

-- إدراج جلسات استشارية تجريبية
INSERT INTO consultation_sessions (
  id,
  student_id,
  ambassador_id,
  title,
  description,
  subject_area,
  session_type,
  duration_minutes,
  price,
  currency,
  status,
  payment_status,
  scheduled_at,
  meeting_platform,
  meeting_link,
  notes,
  feedback_rating,
  feedback_comment,
  created_at,
  updated_at,
  completed_at
) VALUES 
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'مراجعة مادة التشريح قبل الامتحان',
  'جلسة مراجعة شاملة لمادة التشريح البشري مع التركيز على الجهاز العصبي والدوري',
  'الطب البشري - التشريح',
  'مراجعة أكاديمية',
  90,
  225.00,
  'SAR',
  'completed',
  'paid',
  '2024-01-15 14:00:00',
  'Zoom',
  'https://zoom.us/j/1234567890',
  'الطالب متفاعل ومستعد جيداً. تم مراجعة جميع النقاط المطلوبة بنجاح.',
  5,
  'جلسة ممتازة! الدكتورة فاطمة شرحت بطريقة واضحة ومفهومة. ساعدتني كثيراً في فهم المفاهيم الصعبة.',
  '2024-01-10 10:00:00',
  '2024-01-15 15:30:00',
  '2024-01-15 15:30:00'
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'استشارة حول التخصص الطبي',
  'جلسة استشارية لمناقشة خيارات التخصص الطبي والتحضير لامتحانات الإقامة',
  'الطب البشري - التخصص',
  'استشارة مهنية',
  60,
  150.00,
  'SAR',
  'scheduled',
  'paid',
  '2024-01-25 16:00:00',
  'Google Meet',
  'https://meet.google.com/abc-defg-hij',
  '',
  NULL,
  NULL,
  '2024-01-20 09:00:00',
  '2024-01-20 09:00:00',
  NULL
);

-- إدراج تقييمات للسفراء
INSERT INTO ambassador_reviews (
  id,
  ambassador_id,
  reviewer_id,
  session_id,
  rating,
  comment,
  is_verified,
  created_at
) VALUES 
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  5,
  'سفيرة ممتازة! شرحها واضح ومفصل، وتتمتع بصبر كبير في الإجابة على الأسئلة. أنصح بها بشدة.',
  true,
  '2024-01-15 16:00:00'
);

-- إدراج إشعارات تجريبية
INSERT INTO notifications (
  id,
  user_id,
  notification_type,
  title,
  message,
  related_type,
  related_id,
  is_read,
  is_email_sent,
  metadata,
  created_at
) VALUES 
(
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  '11111111-1111-1111-1111-111111111111',
  'session_completed',
  'تم إكمال الجلسة الاستشارية',
  'تم إكمال جلسة "مراجعة مادة التشريح قبل الامتحان" مع الدكتورة فاطمة أحمد بنجاح.',
  'consultation_session',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  false,
  true,
  '{"session_rating": 5, "ambassador_name": "فاطمة أحمد السفيرة"}',
  '2024-01-15 15:35:00'
),
(
  '10101010-1010-1010-1010-101010101010',
  '22222222-2222-2222-2222-222222222222',
  'new_session_booking',
  'حجز جلسة جديدة',
  'تم حجز جلسة استشارية جديدة: "استشارة حول التخصص الطبي" مع الطالب خالد عبدالله.',
  'consultation_session',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  false,
  true,
  '{"student_name": "خالد عبدالله المهندس", "session_date": "2024-01-25 16:00:00"}',
  '2024-01-20 09:05:00'
);

-- تحديث إحصائيات المستخدمين
UPDATE profiles SET 
  stats = jsonb_set(stats, '{total_sessions}', '1'),
  updated_at = NOW()
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE profiles SET 
  stats = jsonb_set(
    jsonb_set(
      jsonb_set(stats, '{sessions_completed}', '45'),
      '{total_earnings}', '15000'
    ),
    '{average_rating}', '4.8'
  ),
  updated_at = NOW()
WHERE id = '22222222-2222-2222-2222-222222222222';
