-- إزالة الـ trigger القديم إذا كان موجوداً
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- إنشاء function جديد لمعالجة المستخدمين الجدد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    phone,
    role,
    subscription_tier,
    preferences,
    stats,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'مستخدم جديد'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    'free',
    jsonb_build_object(
      'theme', 'retro',
      'language', 'ar',
      'emailNotifications', true,
      'pushNotifications', true,
      'profileVisibility', 'university'
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
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء الـ trigger الجديد
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- تحديث RLS policies لجدول profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;

-- إنشاء policies جديدة
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- السماح للـ service role بالوصول الكامل
CREATE POLICY "Service role can do everything" ON profiles
  FOR ALL USING (auth.role() = 'service_role');

-- تأكيد تفعيل RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- إنشاء index لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
