-- Insert sample universities, colleges, and majors
INSERT INTO universities (name, name_en, location, website) VALUES
('الجامعة الأردنية', 'University of Jordan', 'عمان، الأردن', 'https://ju.edu.jo'),
('جامعة العلوم والتكنولوجيا الأردنية', 'Jordan University of Science and Technology', 'إربد، الأردن', 'https://just.edu.jo'),
('الجامعة الهاشمية', 'The Hashemite University', 'الزرقاء، الأردن', 'https://hu.edu.jo'),
('جامعة اليرموك', 'Yarmouk University', 'إربد، الأردن', 'https://yu.edu.jo'),
('الجامعة الألمانية الأردنية', 'German Jordanian University', 'عمان، الأردن', 'https://gju.edu.jo')
ON CONFLICT (name) DO NOTHING;

-- Get university IDs for inserting colleges
DO $$
DECLARE
    ju_id UUID;
    just_id UUID;
    hu_id UUID;
    yu_id UUID;
    gju_id UUID;
BEGIN
    SELECT id INTO ju_id FROM universities WHERE name = 'الجامعة الأردنية';
    SELECT id INTO just_id FROM universities WHERE name = 'جامعة العلوم والتكنولوجيا الأردنية';
    SELECT id INTO hu_id FROM universities WHERE name = 'الجامعة الهاشمية';
    SELECT id INTO yu_id FROM universities WHERE name = 'جامعة اليرموك';
    SELECT id INTO gju_id FROM universities WHERE name = 'الجامعة الألمانية الأردنية';

    -- Insert colleges
    INSERT INTO colleges (name, name_en, university_id) VALUES
    ('كلية الحقوق', 'Faculty of Law', ju_id),
    ('كلية تكنولوجيا المعلومات', 'Faculty of Information Technology', ju_id),
    ('كلية إدارة الأعمال', 'Faculty of Business Administration', ju_id),
    ('كلية الطب', 'Faculty of Medicine', ju_id),
    ('كلية الهندسة', 'Faculty of Engineering', ju_id),
    ('كلية الحاسوب وتكنولوجيا المعلومات', 'Faculty of Computer and Information Technology', just_id),
    ('كلية الهندسة', 'Faculty of Engineering', just_id),
    ('كلية الطب', 'Faculty of Medicine', just_id),
    ('كلية تكنولوجيا المعلومات', 'Faculty of Information Technology', hu_id),
    ('كلية إدارة الأعمال', 'Faculty of Business Administration', hu_id),
    ('كلية الحقوق', 'Faculty of Law', yu_id),
    ('كلية تكنولوجيا المعلومات', 'Faculty of Information Technology', yu_id),
    ('كلية الهندسة والتكنولوجيا', 'Faculty of Engineering and Technology', gju_id),
    ('كلية العلوم التطبيقية', 'Faculty of Applied Sciences', gju_id)
    ON CONFLICT (name, university_id) DO NOTHING;
END $$;

-- Insert sample subjects
INSERT INTO subjects (name, code, college, major) VALUES
('القانون المدني', 'LAW101', 'كلية الحقوق', 'القانون'),
('القانون الجنائي', 'LAW201', 'كلية الحقوق', 'القانون'),
('قانون الأحوال الشخصية', 'LAW301', 'كلية الحقوق', 'الشريعة والقانون'),
('برمجة الحاسوب', 'CS101', 'كلية تكنولوجيا المعلومات', 'علوم الحاسوب'),
('قواعد البيانات', 'CS201', 'كلية تكنولوجيا المعلومات', 'علوم الحاسوب'),
('أمن المعلومات', 'CS301', 'كلية تكنولوجيا المعلومات', 'أمن المعلومات'),
('إدارة الأعمال', 'BUS101', 'كلية إدارة الأعمال', 'إدارة الأعمال'),
('التسويق', 'MKT201', 'كلية إدارة الأعمال', 'التسويق'),
('المحاسبة المالية', 'ACC101', 'كلية إدارة الأعمال', 'المحاسبة'),
('الرياضيات', 'MATH101', 'كلية العلوم', 'الرياضيات'),
('الفيزياء', 'PHYS101', 'كلية العلوم', 'الفيزياء'),
('الكيمياء', 'CHEM101', 'كلية العلوم', 'الكيمياء')
ON CONFLICT (name) DO NOTHING;

-- Create RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Books policies
CREATE POLICY "Books are viewable by everyone" ON books FOR SELECT USING (true);
CREATE POLICY "Users can insert their own books" ON books FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update their own books" ON books FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Users can delete their own books" ON books FOR DELETE USING (auth.uid() = seller_id);

-- Questions policies
CREATE POLICY "Questions are viewable by everyone" ON questions FOR SELECT USING (true);
CREATE POLICY "Users can insert their own questions" ON questions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own questions" ON questions FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own questions" ON questions FOR DELETE USING (auth.uid() = author_id);

-- Answers policies
CREATE POLICY "Answers are viewable by everyone" ON answers FOR SELECT USING (true);
CREATE POLICY "Users can insert their own answers" ON answers FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own answers" ON answers FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own answers" ON answers FOR DELETE USING (auth.uid() = author_id);

-- Notebooks policies
CREATE POLICY "Public notebooks are viewable by everyone" ON notebooks FOR SELECT USING (is_public = true OR auth.uid() = author_id);
CREATE POLICY "Users can insert their own notebooks" ON notebooks FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own notebooks" ON notebooks FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own notebooks" ON notebooks FOR DELETE USING (auth.uid() = author_id);

-- Summaries policies
CREATE POLICY "Approved summaries are viewable by everyone" ON summaries FOR SELECT USING (is_approved = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert their own summaries" ON summaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own summaries" ON summaries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own summaries" ON summaries FOR DELETE USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON conversations FOR SELECT USING (auth.uid()::text = buyer_id OR auth.uid()::text = seller_id);
CREATE POLICY "Users can insert conversations they participate in" ON conversations FOR INSERT WITH CHECK (auth.uid()::text = buyer_id OR auth.uid()::text = seller_id);
CREATE POLICY "Users can update their own conversations" ON conversations FOR UPDATE USING (auth.uid()::text = buyer_id OR auth.uid()::text = seller_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (auth.uid()::text = conversations.buyer_id OR auth.uid()::text = conversations.seller_id)
  )
);
CREATE POLICY "Users can insert messages in their conversations" ON messages FOR INSERT WITH CHECK (
  auth.uid()::text = sender_id AND
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = conversation_id 
    AND (auth.uid()::text = conversations.buyer_id OR auth.uid()::text = conversations.seller_id)
  )
);
