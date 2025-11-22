-- Добавление поля role в таблицу users
-- Выполнить этот скрипт для обновления существующей базы данных

ALTER TABLE users ADD COLUMN role VARCHAR(128);

-- Обновляем существующих пользователей, устанавливая роль по умолчанию
UPDATE users SET role = 'USER' WHERE role IS NULL;

-- Опционально: добавляем ограничение на непустое значение
-- ALTER TABLE users ALTER COLUMN role SET NOT NULL;
