-- Добавление поля result в таблицу gas_order для хранения результатов асинхронных расчетов
ALTER TABLE gas_order ADD COLUMN result DOUBLE PRECISION;
