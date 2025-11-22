-- SQL запросы для проверки изменений в базе данных после демонстрации API

-- ==============================================
-- 1. ПРОВЕРКА ТАБЛИЦЫ ГАЗОВ (GAS)
-- ==============================================

-- Показать все газы
SELECT
    id,
    name,
    formula,
    detailed_description,
    image_url,
    CASE
        WHEN image_url IS NOT NULL THEN 'Есть изображение'
        ELSE 'Нет изображения'
    END as image_status
FROM gas
ORDER BY id;

-- Показать количество газов
SELECT COUNT(*) as total_gases FROM gas;

-- Показать газы с изображениями
SELECT
    id,
    name,
    formula,
    image_url
FROM gas
WHERE image_url IS NOT NULL;

-- ==============================================
-- 2. ПРОВЕРКА ТАБЛИЦЫ ПОЛЬЗОВАТЕЛЕЙ (USERS)
-- ==============================================

-- Показать всех пользователей
SELECT
    id,
    login,
    email,
    first_name,
    last_name,
    CASE
        WHEN password IS NOT NULL THEN 'Пароль установлен'
        ELSE 'Пароль не установлен'
    END as password_status
FROM users
ORDER BY id;

-- Показать количество пользователей
SELECT COUNT(*) as total_users FROM users;

-- Показать пользователей с полными данными
SELECT
    id,
    login,
    email,
    first_name,
    last_name
FROM users
WHERE email IS NOT NULL
   OR first_name IS NOT NULL
   OR last_name IS NOT NULL;

-- ==============================================
-- 3. ПРОВЕРКА ТАБЛИЦЫ ЗАЯВОК (CALC_ORDER)
-- ==============================================

-- Показать все заявки с их статусами
SELECT
    id,
    user_id,
    temp_result,
    timestamp,
    status,
    description,
    CASE
        WHEN temp_result IS NOT NULL THEN 'Расчет выполнен'
        ELSE 'Расчет не выполнен'
    END as calculation_status
FROM calc_order
ORDER BY timestamp DESC;

-- Показать заявки по статусам
SELECT
    status,
    COUNT(*) as count
FROM calc_order
GROUP BY status
ORDER BY status;

-- Показать заявки с расчетами температуры
SELECT
    id,
    user_id,
    temp_result,
    timestamp,
    status,
    description
FROM calc_order
WHERE temp_result IS NOT NULL
ORDER BY timestamp DESC;

-- Показать последние заявки
SELECT
    id,
    user_id,
    temp_result,
    timestamp,
    status,
    description
FROM calc_order
ORDER BY timestamp DESC
LIMIT 10;

-- ==============================================
-- 4. ПРОВЕРКА ТАБЛИЦЫ СВЯЗИ ГАЗ-ЗАЯВКА (GAS_ORDER)
-- ==============================================

-- Показать все связи газ-заявка
SELECT
    go.id,
    go.gas_id,
    g.name as gas_name,
    g.formula as gas_formula,
    go.calc_order_id,
    co.status as order_status,
    go.concentration,
    go.temperature,
    go.concentration * go.temperature as weighted_temperature
FROM gas_order go
JOIN gas g ON go.gas_id = g.id
JOIN calc_order co ON go.calc_order_id = co.id
ORDER BY go.calc_order_id, go.gas_id;

-- Показать количество связей по заявкам
SELECT
    calc_order_id,
    COUNT(*) as gas_count,
    AVG(concentration) as avg_concentration,
    AVG(temperature) as avg_temperature
FROM gas_order
GROUP BY calc_order_id
ORDER BY calc_order_id;

-- Показать статистику по газам в заявках
SELECT
    gas_id,
    g.name as gas_name,
    COUNT(*) as usage_count,
    AVG(concentration) as avg_concentration,
    AVG(temperature) as avg_temperature
FROM gas_order go
JOIN gas g ON go.gas_id = g.id
GROUP BY gas_id, g.name
ORDER BY usage_count DESC;

-- ==============================================
-- 5. КОМПЛЕКСНЫЕ ЗАПРОСЫ ДЛЯ ДЕМОНСТРАЦИИ
-- ==============================================

-- Полная информация о заявке с газами
SELECT
    co.id as order_id,
    co.user_id,
    u.login as user_login,
    co.temp_result,
    co.timestamp,
    co.status,
    co.description,
    COUNT(go.id) as gas_count,
    STRING_AGG(g.name || ' (' || g.formula || ')', ', ') as gases
FROM calc_order co
LEFT JOIN users u ON co.user_id = u.id
LEFT JOIN gas_order go ON co.id = go.calc_order_id
LEFT JOIN gas g ON go.gas_id = g.id
GROUP BY co.id, co.user_id, u.login, co.temp_result, co.timestamp, co.status, co.description
ORDER BY co.timestamp DESC;

-- Детальная информация о конкретной заявке
SELECT
    co.id as order_id,
    co.user_id,
    u.login as user_login,
    co.temp_result,
    co.timestamp,
    co.status,
    co.description,
    go.id as gas_order_id,
    g.name as gas_name,
    g.formula as gas_formula,
    g.image_url as gas_image,
    go.concentration,
    go.temperature
FROM calc_order co
LEFT JOIN users u ON co.user_id = u.id
LEFT JOIN gas_order go ON co.id = go.calc_order_id
LEFT JOIN gas g ON go.gas_id = g.id
WHERE co.id = 1  -- Замените на нужный ID заявки
ORDER BY go.id;

-- Статистика по пользователям
SELECT
    u.id,
    u.login,
    u.email,
    u.first_name,
    u.last_name,
    COUNT(co.id) as total_orders,
    COUNT(CASE WHEN co.status = 'COMPLETED' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN co.status = 'DRAFT' THEN 1 END) as draft_orders,
    AVG(co.temp_result) as avg_temperature
FROM users u
LEFT JOIN calc_order co ON u.id = co.user_id
GROUP BY u.id, u.login, u.email, u.first_name, u.last_name
ORDER BY total_orders DESC;

-- ==============================================
-- 6. ПРОВЕРКА ИЗМЕНЕНИЙ ПОСЛЕ ДЕМОНСТРАЦИИ
-- ==============================================

-- Проверить, что заявка была сформирована (статус COMPLETED)
SELECT
    id,
    status,
    timestamp,
    description
FROM calc_order
WHERE status = 'COMPLETED'
ORDER BY timestamp DESC;

-- Проверить, что заявка была завершена (есть temp_result)
SELECT
    id,
    temp_result,
    timestamp,
    status,
    description
FROM calc_order
WHERE temp_result IS NOT NULL
ORDER BY timestamp DESC;

-- Проверить изменения в связях газ-заявка
SELECT
    go.calc_order_id,
    g.name as gas_name,
    go.concentration,
    go.temperature,
    go.concentration * go.temperature as weighted_temp
FROM gas_order go
JOIN gas g ON go.gas_id = g.id
WHERE go.calc_order_id = 1  -- Замените на нужный ID заявки
ORDER BY go.gas_id;

-- Проверить нового пользователя
SELECT
    id,
    login,
    email,
    first_name,
    last_name
FROM users
WHERE login = 'newuser';

-- ==============================================
-- 7. ПРОВЕРКА ТИПОВ ДАННЫХ
-- ==============================================

-- Проверить типы данных в таблицах
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('gas', 'users', 'calc_order', 'gas_order')
ORDER BY table_name, ordinal_position;

-- Проверить, что concentration и temperature имеют тип DOUBLE PRECISION
SELECT
    column_name,
    data_type,
    numeric_precision,
    numeric_scale
FROM information_schema.columns
WHERE table_name = 'gas_order'
  AND column_name IN ('concentration', 'temperature');

-- Проверить, что temp_result имеет тип DOUBLE PRECISION
SELECT
    column_name,
    data_type,
    numeric_precision,
    numeric_scale
FROM information_schema.columns
WHERE table_name = 'calc_order'
  AND column_name = 'temp_result';

-- ==============================================
-- 8. ПРОВЕРКА ОГРАНИЧЕНИЙ И СВЯЗЕЙ
-- ==============================================

-- Проверить внешние ключи
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('gas_order', 'calc_order')
ORDER BY tc.table_name, kcu.column_name;

-- Проверить уникальные ограничения
SELECT
    tc.table_name,
    kcu.column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_name IN ('gas', 'users')
ORDER BY tc.table_name, kcu.column_name;
