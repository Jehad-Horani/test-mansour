-- إنشاء جدول المحاضرات اليومية
CREATE TABLE IF NOT EXISTS daily_lectures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  professor_name TEXT NOT NULL,
  lecture_date DATE NOT NULL,
  lecture_time TIME NOT NULL,
  description TEXT,
  tags TEXT[],
  image_urls TEXT[] NOT NULL,
  image_names TEXT[],
  image_sizes INTEGER[],
  uploaded_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول إعجابات المحاضرات
CREATE TABLE IF NOT EXISTS daily_lecture_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID REFERENCES daily_lectures(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lecture_id, user_id)
);

-- إنشاء جدول تعليقات المحاضرات
CREATE TABLE IF NOT EXISTS daily_lecture_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID REFERENCES daily_lectures(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول مشاهدات المحاضرات
CREATE TABLE IF NOT EXISTS daily_lecture_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID REFERENCES daily_lectures(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  UNIQUE(lecture_id, user_id)
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_daily_lectures_status ON daily_lectures(status);
CREATE INDEX IF NOT EXISTS idx_daily_lectures_course ON daily_lectures(course_code);
CREATE INDEX IF NOT EXISTS idx_daily_lectures_date ON daily_lectures(lecture_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_lectures_uploaded_by ON daily_lectures(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_daily_lecture_likes_lecture ON daily_lecture_likes(lecture_id);
CREATE INDEX IF NOT EXISTS idx_daily_lecture_comments_lecture ON daily_lecture_comments(lecture_id);

-- تفعيل Row Level Security
ALTER TABLE daily_lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_lecture_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_lecture_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_lecture_views ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للمحاضرات
CREATE POLICY "المحاضرات المعتمدة مرئية للجميع" ON daily_lectures
  FOR SELECT USING (status = 'approved');

CREATE POLICY "المستخدمون يمكنهم رؤية محاضراتهم الخاصة" ON daily_lectures
  FOR SELECT USING (uploaded_by = auth.uid());

CREATE POLICY "المستخدمون يمكنهم رفع محاضرات جديدة" ON daily_lectures
  FOR INSERT WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "المستخدمون يمكنهم تعديل محاضراتهم" ON daily_lectures
  FOR UPDATE USING (uploaded_by = auth.uid());

-- سياسات الأمان للإعجابات
CREATE POLICY "الجميع يمكنهم رؤية الإعجابات" ON daily_lecture_likes
  FOR SELECT USING (true);

CREATE POLICY "المستخدمون يمكنهم إضافة إعجاب" ON daily_lecture_likes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "المستخدمون يمكنهم حذف إعجابهم" ON daily_lecture_likes
  FOR DELETE USING (user_id = auth.uid());

-- سياسات الأمان للتعليقات
CREATE POLICY "الجميع يمكنهم رؤية التعليقات" ON daily_lecture_comments
  FOR SELECT USING (true);

CREATE POLICY "المستخدمون يمكنهم إضافة تعليق" ON daily_lecture_comments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "المستخدمون يمكنهم تعديل تعليقاتهم" ON daily_lecture_comments
  FOR UPDATE USING (user_id = auth.uid());

-- سياسات الأمان للمشاهدات
CREATE POLICY "المستخدمون يمكنهم تسجيل مشاهدة" ON daily_lecture_views
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- إنشاء دالة لتحديث عداد الإعجابات
CREATE OR REPLACE FUNCTION update_lecture_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE daily_lectures 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.lecture_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE daily_lectures 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.lecture_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- إنشاء دالة لتحديث عداد التعليقات
CREATE OR REPLACE FUNCTION update_lecture_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE daily_lectures 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.lecture_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE daily_lectures 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.lecture_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- إنشاء المحفزات
CREATE TRIGGER trigger_update_likes_count
  AFTER INSERT OR DELETE ON daily_lecture_likes
  FOR EACH ROW EXECUTE FUNCTION update_lecture_likes_count();

CREATE TRIGGER trigger_update_comments_count
  AFTER INSERT OR DELETE ON daily_lecture_comments
  FOR EACH ROW EXECUTE FUNCTION update_lecture_comments_count();

-- إضافة بيانات تجريبية
INSERT INTO daily_lectures (
  title, course_code, course_name, professor_name, 
  lecture_date, lecture_time, description, tags,
  image_urls, uploaded_by, status, views_count, likes_count, comments_count
) VALUES 
(
  'محاضرة القانون الدستوري - الفصل الثالث',
  'LAW 301',
  'القانون الدستوري',
  'د. أحمد محمد',
  '2024-01-15',
  '10:00:00',
  'محاضرة شاملة حول مبادئ القانون الدستوري والنظام السياسي',
  ARRAY['قانون', 'دستوري', 'نظام سياسي'],
  ARRAY['/placeholder.svg?height=400&width=600'],
  (SELECT id FROM profiles WHERE name = 'سارة أحمد' LIMIT 1),
  'approved',
  125,
  23,
  8
),
(
  'محاضرة البرمجة الكائنية - Java',
  'CS 201',
  'البرمجة الكائنية',
  'د. محمد علي',
  '2024-01-16',
  '14:00:00',
  'شرح مفصل للبرمجة الكائنية باستخدام لغة Java',
  ARRAY['برمجة', 'java', 'كائنية'],
  ARRAY['/placeholder.svg?height=400&width=600'],
  (SELECT id FROM profiles WHERE name = 'أحمد خالد' LIMIT 1),
  'pending',
  0,
  0,
  0
);
