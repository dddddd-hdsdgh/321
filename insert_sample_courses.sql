-- 向courses表添加示例数据，为每个课程分类添加一个课程

-- 拼音学习课程
INSERT INTO courses (category_id, title, description, type, thumbnail_url, content_url, duration, difficulty, target_age_min, target_age_max, recommended_grade, order_index, is_active)
VALUES (
  (SELECT id FROM course_categories WHERE name = '拼音学习'),
  '声母学习 - b p m f',
  '通过趣味动画学习拼音声母b p m f的正确发音和书写',
  'video',
  '/assets/courses/pinyin.png',
  'https://example.com/videos/pinyin_bpmf.mp4',
  323, -- 5分23秒
  'easy',
  4,
  6,
  '一年级',
  1,
  true
);

-- 汉字学习课程
INSERT INTO courses (category_id, title, description, type, thumbnail_url, content_url, duration, difficulty, target_age_min, target_age_max, recommended_grade, order_index, is_active)
VALUES (
  (SELECT id FROM course_categories WHERE name = '汉字学习'),
  '基础汉字 - 一二三',
  '学习最基础的汉字书写和认识，了解汉字的起源和演变',
  'video',
  '/assets/courses/characters.png',
  'https://example.com/videos/hanzi_basic.mp4',
  400, -- 6分40秒
  'easy',
  4,
  7,
  '一年级',
  1,
  true
);

-- 词语积累课程
INSERT INTO courses (category_id, title, description, type, thumbnail_url, content_url, duration, difficulty, target_age_min, target_age_max, recommended_grade, order_index, is_active)
VALUES (
  (SELECT id FROM course_categories WHERE name = '词语积累'),
  '日常生活词汇',
  '学习日常生活中最常用的词汇，提升词汇量和表达能力',
  'video',
  '/assets/courses/reading.png',
  'https://example.com/videos/words_daily.mp4',
  510, -- 8分30秒
  'medium',
  5,
  8,
  '二年级',
  1,
  true
);

-- 句子训练课程
INSERT INTO courses (category_id, title, description, type, thumbnail_url, content_url, duration, difficulty, target_age_min, target_age_max, recommended_grade, order_index, is_active)
VALUES (
  (SELECT id FROM course_categories WHERE name = '句子训练'),
  '简单问候语',
  '学习日常问候的简单句子，提升口语表达能力',
  'video',
  '/assets/courses/poetry.png',
  'https://example.com/videos/sentences_greeting.mp4',
  380, -- 6分20秒
  'easy',
  5,
  7,
  '一年级',
  1,
  true
);

-- 阅读乐园课程
INSERT INTO courses (category_id, title, description, type, thumbnail_url, content_url, duration, difficulty, target_age_min, target_age_max, recommended_grade, order_index, is_active)
VALUES (
  (SELECT id FROM course_categories WHERE name = '阅读乐园'),
  '童话故事阅读',
  '通过有趣的童话故事培养阅读兴趣，提升理解能力',
  'video',
  '/assets/courses/reading.png',
  'https://example.com/videos/reading_fairy_tale.mp4',
  600, -- 10分钟
  'medium',
  6,
  9,
  '三年级',
  1,
  true
);