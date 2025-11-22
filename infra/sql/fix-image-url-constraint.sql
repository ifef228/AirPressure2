-- Исправление ограничения NOT NULL для поля image_url в таблице gas
-- Этот скрипт нужно выполнить в вашей существующей базе данных

-- 1. Сначала проверим текущую структуру таблицы
SELECT column_name, is_nullable, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'gas' AND column_name = 'image_url';

-- 2. Если поле имеет ограничение NOT NULL, удаляем его
-- (PostgreSQL не позволяет напрямую изменить is_nullable, нужно пересоздать колонку)

-- Сначала создаем временную колонку
ALTER TABLE gas ADD COLUMN image_url_temp VARCHAR(500);

-- Копируем данные из старой колонки
UPDATE gas SET image_url_temp = image_url WHERE image_url IS NOT NULL;

-- Удаляем старую колонку
ALTER TABLE gas DROP COLUMN image_url;

-- Переименовываем временную колонку
ALTER TABLE gas RENAME COLUMN image_url_temp TO image_url;

-- 3. Проверяем результат
SELECT column_name, is_nullable, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'gas' AND column_name = 'image_url';

-- 4. Проверяем, что данные сохранились
SELECT id, name, formula, image_url FROM gas LIMIT 5;
