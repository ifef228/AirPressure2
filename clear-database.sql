-- Очистка базы данных для тестирования корзины
-- Выполните эти команды в PostgreSQL

-- Очищаем все таблицы
DELETE FROM gas_order;
DELETE FROM calc_order;
DELETE FROM gasi;
DELETE FROM users;

-- Сбрасываем счетчики ID
ALTER SEQUENCE gas_order_id_seq RESTART WITH 1;
ALTER SEQUENCE calc_order_id_seq RESTART WITH 1;
ALTER SEQUENCE gasi_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- Проверяем, что таблицы пусты
SELECT 'gas_order' as table_name, COUNT(*) as count FROM gas_order
UNION ALL
SELECT 'calc_order' as table_name, COUNT(*) as count FROM calc_order
UNION ALL
SELECT 'gasi' as table_name, COUNT(*) as count FROM gasi
UNION ALL
SELECT 'users' as table_name, COUNT(*) as count FROM users;
