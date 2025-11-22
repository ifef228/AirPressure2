-- Обновление схемы базы данных для добавления новых полей

-- Добавляем поле status в таблицу calc_order
ALTER TABLE calc_order ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'DRAFT';

-- Добавляем поле description в таблицу calc_order
ALTER TABLE calc_order ADD COLUMN IF NOT EXISTS description VARCHAR(500);

-- Обновляем существующие записи, устанавливая статус COMPLETED для заказов с результатом
UPDATE calc_order SET status = 'COMPLETED' WHERE temp_result IS NOT NULL;

-- Обновляем существующие записи, устанавливая статус DRAFT для заказов без результата
UPDATE calc_order SET status = 'DRAFT' WHERE temp_result IS NULL;

-- Добавляем описание для существующих записей
UPDATE calc_order SET description = 'Расчет атмосферного давления от ' || DATE(timestamp) WHERE description IS NULL;
