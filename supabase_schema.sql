-- 萌豆语文动画屋 - Supabase数据库表结构

-- 1. 用户表（家长用户）
CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  openid VARCHAR(100) UNIQUE NOT NULL,
  unionid VARCHAR(100),
  nickname VARCHAR(50),
  avatar_url VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. 儿童表
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  avatar VARCHAR(255),
  age INTEGER,
  grade VARCHAR(20),
  gender VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 3. 课程分类表
CREATE TABLE course_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- 4. 课程表
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES course_categories(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL, -- video, story, game, exercise
  thumbnail_url VARCHAR(255),
  content_url VARCHAR(255),
  duration INTEGER, -- 秒
  difficulty VARCHAR(20), -- easy, medium, hard
  target_age_min INTEGER,
  target_age_max INTEGER,
  recommended_grade VARCHAR(20),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 学习记录表
CREATE TABLE study_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- 学习时长（秒）
  progress INTEGER DEFAULT 0, -- 进度百分比
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER, -- 得分
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 成就表
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  condition_type VARCHAR(30), -- study_days, completed_courses, total_score
  condition_value INTEGER,
  order_index INTEGER DEFAULT 0
);

-- 7. 儿童成就表
CREATE TABLE child_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(child_id, achievement_id)
);

-- 8. 学习设置表
CREATE TABLE study_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  sound BOOLEAN DEFAULT TRUE,
  music BOOLEAN DEFAULT TRUE,
  difficulty VARCHAR(20) DEFAULT 'easy',
  notifications BOOLEAN DEFAULT TRUE,
  auto_play BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(child_id)
);

-- 9. 收藏表
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(child_id, course_id)
);

-- 10. 推荐课程表
CREATE TABLE recommended_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  recommend_type VARCHAR(30), -- daily, popular, new
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_children_parent_id ON children(parent_id);
CREATE INDEX idx_courses_category_id ON courses(category_id);
CREATE INDEX idx_study_records_child_id ON study_records(child_id);
CREATE INDEX idx_study_records_course_id ON study_records(course_id);
CREATE INDEX idx_child_achievements_child_id ON child_achievements(child_id);
CREATE INDEX idx_study_settings_child_id ON study_settings(child_id);
CREATE INDEX idx_favorites_child_id ON favorites(child_id);
CREATE INDEX idx_recommended_courses_course_id ON recommended_courses(course_id);

-- 创建视图：获取儿童学习统计
CREATE VIEW child_study_stats AS
SELECT 
  c.id as child_id,
  COUNT(DISTINCT sr.id) as total_study_sessions,
  SUM(sr.duration) as total_study_time,
  COUNT(DISTINCT CASE WHEN sr.completed THEN sr.course_id END) as completed_courses,
  (SELECT COUNT(*) FROM child_achievements WHERE child_id = c.id AND unlocked_at IS NOT NULL) as unlocked_achievements,
  MAX(sr.end_time) as last_study_time
FROM 
  children c
LEFT JOIN 
  study_records sr ON c.id = sr.child_id
GROUP BY 
  c.id;

-- 创建视图：获取每日学习统计
CREATE VIEW daily_study_stats AS
SELECT 
  c.id as child_id,
  c.name as child_name,
  DATE(sr.end_time) as study_date,
  COUNT(DISTINCT sr.id) as study_sessions,
  SUM(sr.duration) as total_duration,
  COUNT(DISTINCT CASE WHEN sr.completed THEN sr.course_id END) as completed_courses
FROM 
  children c
LEFT JOIN 
  study_records sr ON c.id = sr.child_id
GROUP BY 
  c.id, c.name, DATE(sr.end_time);

-- 插入示例数据

-- 插入课程分类
INSERT INTO course_categories (name, description, icon_url, order_index) VALUES
('拼音学习', '通过动画和游戏学习汉语拼音', '/assets/icons/pinyin_master.png', 1),
('汉字学习', '趣味汉字学习，了解汉字起源和演变', '/assets/icons/hanzi_master.png', 2),
('词语积累', '丰富的词语积累，提升表达能力', '/assets/courses/characters.png', 3),
('句子训练', '学习实用句子，提升口语表达能力', '/assets/courses/poetry.png', 4),
('阅读乐园', '培养阅读兴趣，提升理解能力', '/assets/courses/reading.png', 5);

-- 插入一些成就
INSERT INTO achievements (name, description, icon_url, condition_type, condition_value) VALUES
('拼音小能手', '完成10次拼音练习', '/assets/icons/pinyin_master.png', 'completed_courses', 10),
('汉字探索者', '学习50个汉字', '/assets/icons/hanzi_master.png', 'completed_courses', 50),
('学习达人', '连续学习7天', '/assets/icons/continuous.png', 'study_days', 7),
('词语大王', '积累200个词语', '/assets/courses/characters.png', 'completed_courses', 20),
('阅读之星', '完成5篇阅读', '/assets/courses/reading.png', 'completed_courses', 5);

-- 更新触发器
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为所有带updated_at字段的表添加更新触发器
CREATE TRIGGER update_parents_timestamp BEFORE UPDATE ON parents FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_children_timestamp BEFORE UPDATE ON children FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_courses_timestamp BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_study_records_timestamp BEFORE UPDATE ON study_records FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_child_achievements_timestamp BEFORE UPDATE ON child_achievements FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_study_settings_timestamp BEFORE UPDATE ON study_settings FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_recommended_courses_timestamp BEFORE UPDATE ON recommended_courses FOR EACH ROW EXECUTE FUNCTION update_timestamp();