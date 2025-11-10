-- 向recommended_courses表添加推荐课程数据
-- 基于insert_sample_courses.sql中插入的课程数据

-- 添加每日推荐课程 (daily)
INSERT INTO recommended_courses (course_id, recommend_type, order_index)
VALUES
  ((SELECT id FROM courses WHERE title = '声母学习 - b p m f'), 'daily', 1),
  ((SELECT id FROM courses WHERE title = '基础汉字 - 一二三'), 'daily', 2),
  ((SELECT id FROM courses WHERE title = '日常生活词汇'), 'daily', 3);

-- 添加热门推荐课程 (popular)
INSERT INTO recommended_courses (course_id, recommend_type, order_index)
VALUES
  ((SELECT id FROM courses WHERE title = '童话故事阅读'), 'popular', 1),
  ((SELECT id FROM courses WHERE title = '日常生活词汇'), 'popular', 2),
  ((SELECT id FROM courses WHERE title = '简单问候语'), 'popular', 3);

-- 添加新课程推荐 (new)
INSERT INTO recommended_courses (course_id, recommend_type, order_index)
VALUES
  ((SELECT id FROM courses WHERE title = '声母学习 - b p m f'), 'new', 1),
  ((SELECT id FROM courses WHERE title = '基础汉字 - 一二三'), 'new', 2),
  ((SELECT id FROM courses WHERE title = '简单问候语'), 'new', 3);

-- 显示插入的推荐课程数据
SELECT rc.id, rc.recommend_type, rc.order_index, c.title as course_title
FROM recommended_courses rc
JOIN courses c ON rc.course_id = c.id
ORDER BY rc.recommend_type, rc.order_index;