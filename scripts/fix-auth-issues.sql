-- إنشاء مستخدمين تجريبيين للاختبار
-- هذا السكريبت يحل مشكلة عدم وجود مستخدمين للاختبار

-- إنشاء مستخدم طالب تجريبي
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'student@takhassus.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "أحمد محمد"}',
  false,
  'authenticated'
);

-- إنشاء مستخدم إداري تجريبي
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'admin@takhassus.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "مدير النظام"}',
  false,
  'authenticated'
);

-- إنشاء ملف شخصي للطالب التجريبي
INSERT INTO profiles (
  id,
  name,
  phone,
  university,
  major,
  year,
  graduation_year,
  role,
  subscription_tier,
  preferences,
  stats
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'أحمد محمد',
  '+966501234567',
  'جامعة الملك سعود',
  'law',
  '2',
  '2027',
  'student',
  'standard',
  '{
    "theme": "retro",
    "language": "ar",
    "emailNotifications": true,
    "pushNotifications": true,
    "profileVisibility": "university"
  }',
  '{
    "uploadsCount": 5,
    "viewsCount": 120,
    "helpfulVotes": 8,
    "coursesEnrolled": 3,
    "booksOwned": 2,
    "consultations": 1,
    "communityPoints": 150
  }'
);

-- إنشاء ملف شخصي للمدير التجريبي
INSERT INTO profiles (
  id,
  name,
  phone,
  university,
  major,
  year,
  graduation_year,
  role,
  subscription_tier,
  preferences,
  stats
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'مدير النظام',
  '+966507654321',
  'جامعة الملك سعود',
  'it',
  'خريج',
  '2020',
  'admin',
  'premium',
  '{
    "theme": "retro",
    "language": "ar",
    "emailNotifications": true,
    "pushNotifications": true,
    "profileVisibility": "public"
  }',
  '{
    "uploadsCount": 0,
    "viewsCount": 0,
    "helpfulVotes": 0,
    "coursesEnrolled": 0,
    "booksOwned": 0,
    "consultations": 0,
    "communityPoints": 0,
    "adminActions": 25
  }'
);

-- إضافة بيانات تجريبية للمحاضرات اليومية
INSERT INTO daily_lectures (
  id,
  title,
  subject,
  university,
  major,
  year,
  professor_name,
  lecture_date,
  description,
  image_urls,
  uploader_id,
  is_approved,
  approved_by,
  approved_at,
  views_count,
  likes_count
) VALUES 
(
  gen_random_uuid(),
  'محاضرة القانون الدستوري - الفصل الثالث',
  'القانون الدستوري',
  'جامعة الملك سعود',
  'law',
  '2',
  'د. عبدالله الأحمد',
  '2024-12-09',
  'شرح مفصل لمبادئ القانون الدستوري والسلطات الثلاث في المملكة العربية السعودية',
  ARRAY['/placeholder-3e1wz.png', '/java-code-snippet.png'],
  '11111111-1111-1111-1111-111111111111',
  true,
  '22222222-2222-2222-2222-222222222222',
  now(),
  45,
  12
),
(
  gen_random_uuid(),
  'أساسيات البرمجة بـ Java',
  'البرمجة',
  'جامعة الملك فهد',
  'it',
  '1',
  'د. سارة محمد',
  '2024-12-08',
  'مقدمة شاملة لأساسيات البرمجة باستخدام لغة Java مع أمثلة تطبيقية',
  ARRAY['/java-code-snippet.png'],
  '11111111-1111-1111-1111-111111111111',
  true,
  '22222222-2222-2222-2222-222222222222',
  now(),
  78,
  23
),
(
  gen_random_uuid(),
  'مبادئ المحاسبة المالية',
  'المحاسبة',
  'جامعة الإمام',
  'business',
  '1',
  'د. خالد العتيبي',
  '2024-12-07',
  'شرح المبادئ الأساسية للمحاسبة المالية والقوائم المالية',
  ARRAY['/placeholder-z1r7g.png'],
  '11111111-1111-1111-1111-111111111111',
  false,
  null,
  null,
  0,
  0
);

-- إضافة تعليقات على المحاضرات
INSERT INTO lecture_comments (
  id,
  lecture_id,
  user_id,
  content,
  created_at
) VALUES 
(
  gen_random_uuid(),
  (SELECT id FROM daily_lectures WHERE title LIKE '%القانون الدستوري%' LIMIT 1),
  '11111111-1111-1111-1111-111111111111',
  'شرح ممتاز ومفيد جداً، شكراً للدكتور على الجهد المبذول',
  now() - interval '2 hours'
);

-- تحديث إحصائيات المستخدم
UPDATE profiles 
SET stats = jsonb_set(stats, '{uploadsCount}', '3')
WHERE id = '11111111-1111-1111-1111-111111111111';

-- إضافة إجراء إداري لتسجيل الموافقة على المحاضرات
INSERT INTO admin_actions (
  id,
  admin_id,
  action_type,
  target_type,
  target_id,
  description,
  metadata,
  created_at
) VALUES (
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'content_approval',
  'daily_lecture',
  (SELECT id FROM daily_lectures WHERE title LIKE '%القانون الدستوري%' LIMIT 1),
  'تم الموافقة على محاضرة القانون الدستوري',
  '{"approval_reason": "محتوى عالي الجودة ومفيد للطلاب"}',
  now()
);

-- إنشاء جلسة تجريبية للمستخدم (لحل مشكلة عدم وجود مستخدم مسجل دخول)
-- هذا سيتم التعامل معه في الكود بدلاً من قاعدة البيانات
