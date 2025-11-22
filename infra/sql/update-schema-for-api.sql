-- Обновление схемы базы данных для API
-- Выполнить этот скрипт для обновления существующей базы данных

-- Обновление таблицы users
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- Добавление уникального ограничения на login, если его нет
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'users_login_key'
        AND table_name = 'users'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_login_key UNIQUE (login);
    END IF;
END $$;

-- Обновление типов данных в calc_order
ALTER TABLE calc_order ALTER COLUMN temp_result TYPE DOUBLE PRECISION;

-- Обновление типов данных в gas_order
ALTER TABLE gas_order ALTER COLUMN concentration TYPE DOUBLE PRECISION;
ALTER TABLE gas_order ALTER COLUMN temperature TYPE DOUBLE PRECISION;

-- Переименование колонки, если она называется неправильно
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'gas_order'
        AND column_name = 'calk_order_id'
    ) THEN
        ALTER TABLE gas_order RENAME COLUMN calk_order_id TO calc_order_id;
    END IF;
END $$;

-- Обновление внешних ключей, если нужно
DO $$
BEGIN
    -- Удаляем старый внешний ключ, если он существует
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'gas_order_calc_order_id_fkey'
        AND table_name = 'gas_order'
    ) THEN
        ALTER TABLE gas_order DROP CONSTRAINT gas_order_calc_order_id_fkey;
    END IF;

    -- Добавляем новый внешний ключ
    ALTER TABLE gas_order ADD CONSTRAINT gas_order_calc_order_id_fkey
    FOREIGN KEY (calc_order_id) REFERENCES calc_order(id);
END $$;

-- Создание индексов, если их нет
CREATE INDEX IF NOT EXISTS idx_users_login ON users(login);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_calc_order_status ON calc_order(status);
CREATE INDEX IF NOT EXISTS idx_calc_order_timestamp ON calc_order(timestamp);

COMMENT ON TABLE gas IS 'Таблица газов (услуг)';
COMMENT ON TABLE users IS 'Таблица пользователей';
COMMENT ON TABLE calc_order IS 'Таблица заявок (заказов)';
COMMENT ON TABLE gas_order IS 'Таблица связи газов и заявок';

COMMENT ON COLUMN gas.image_url IS 'URL изображения газа в Minio';
COMMENT ON COLUMN calc_order.status IS 'Статус заявки: DRAFT, COMPLETED, DELETED';
COMMENT ON COLUMN calc_order.temp_result IS 'Результат расчета температуры';
COMMENT ON COLUMN gas_order.concentration IS 'Концентрация газа (в процентах)';
COMMENT ON COLUMN gas_order.temperature IS 'Температура газа (в градусах Цельсия)';
