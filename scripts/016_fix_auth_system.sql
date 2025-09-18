-- إصلاح نظام المصادقة وإعداد Row Level Security

-- 1. إنشاء trigger لإنشاء البروفايل تلقائياً
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    role,
    subscription_tier,
    preferences,
    stats,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'مستخدم جديد'),
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    'free',
    jsonb_build_object(
      'theme', 'retro',
      'language', 'ar',
      'emailNotifications', true,
      'pushNotifications', true,
      'profileVisibility', 'public'
    ),
    jsonb_build_object(
      'uploadsCount', 0,
      'viewsCount', 0,
      'helpfulVotes', 0,
      'coursesEnrolled', 0,
      'booksOwned', 0,
      'consultations', 0,
      'communityPoints', 0
    ),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. إعداد Row Level Security للجدول profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- حذف السياسات الموجودة
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;

-- إنشاء سياسات جديدة
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- السماح للمدراء بعرض جميع البروفايلات
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. إنشاء حساب المدير والطالب التجريبي مباشرة في قاعدة البيانات
-- (سيتم تشغيل هذا فقط إذا لم يكن الحساب موجوداً)

-- إدراج حساب المدير
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@takhassus.com',
  crypt('Admin123!@#', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "مدير النظام", "role": "admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- إدراج حساب الطالب التجريبي
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'demo@student.com',
  crypt('Student123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "طالب تجريبي", "role": "student"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- 4. إنشاء البروفايلات للحسابات التجريبية
INSERT INTO public.profiles (
  id,
  name,
  role,
  university,
  major,
  year,
  study_level,
  bio,
  subscription_tier,
  preferences,
  stats,
  created_at,
  updated_at
) 
SELECT 
  u.id,
  'مدير النظام',
  'admin',
  'إدارة النظام',
  'تقنية المعلومات',
  'خريج',
  'ماجستير',
  'مدير النظام الرئيسي لمنصة تخصصكُم',
  'premium',
  jsonb_build_object(
    'theme', 'retro',
    'language', 'ar',
    'emailNotifications', true,
    'pushNotifications', true,
    'profileVisibility', 'private'
  ),
  jsonb_build_object(
    'uploadsCount', 0,
    'viewsCount', 0,
    'helpfulVotes', 0,
    'coursesEnrolled', 0,
    'booksOwned', 0,
    'consultations', 0,
    'communityPoints', 100
  ),
  now(),
  now()
FROM auth.users u 
WHERE u.email = 'admin@takhassus.com'
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = now();

INSERT INTO public.profiles (
  id,
  name,
  role,
  university,
  major,
  year,
  study_level,
  bio,
  subscription_tier,
  preferences,
  stats,
  created_at,
  updated_at
) 
SELECT 
  u.id,
  'طالب تجريبي',
  'student',
  'الجامعة الأردنية',
  'هندسة الحاسوب',
  'السنة الثالثة',
  'بكالوريوس',
  'طالب تجريبي للاختبار',
  'free',
  jsonb_build_object(
    'theme', 'retro',
    'language', 'ar',
    'emailNotifications', false,
    'pushNotifications', true,
    'profileVisibility', 'public'
  ),
  jsonb_build_object(
    'uploadsCount', 0,
    'viewsCount', 0,
    'helpfulVotes', 0,
    'coursesEnrolled', 0,
    'booksOwned', 0,
    'consultations', 0,
    'communityPoints', 10
  ),
  now(),
  now()
FROM auth.users u 
WHERE u.email = 'demo@student.com'
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = now();

-- 5. إنشاء فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(id);

-- 6. منح الصلاحيات المناسبة
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
