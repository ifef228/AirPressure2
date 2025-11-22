
CREATE  TABLE gas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    formula VARCHAR(255) NOT NULL,
    detailed_description TEXT NOT NULL,
    image_url VARCHAR(500)
);

-- Создание таблицы user
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100)
);

-- Создание таблицы calc_order
CREATE  TABLE calc_order (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER,
    temp_result DOUBLE PRECISION,
    timestamp TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    description VARCHAR(500),

    FOREIGN KEY (user_id) REFERENCES "users"(id)
);

-- Создание таблицы gas_order
create TABLE gas_order (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    gas_id INTEGER,
    calc_order_id INTEGER,
    concentration DOUBLE PRECISION NOT NULL,
    temperature DOUBLE PRECISION NOT NULL,

    FOREIGN KEY (gas_id) REFERENCES gas(id),
    FOREIGN KEY (calc_order_id) REFERENCES calc_order(id)
);

-- Создание индексов для улучшения производительности
CREATE INDEX idx_gas_name ON gas(name);
CREATE INDEX idx_gas_formula ON gas(formula);
CREATE INDEX idx_users_login ON users(login);
CREATE INDEX idx_calc_order_user_id ON calc_order(user_id);
CREATE INDEX idx_calc_order_timestamp ON calc_order(timestamp);
CREATE INDEX idx_gas_order_gas_id ON gas_order(gas_id);
CREATE INDEX idx_gas_order_calc_order_id ON gas_order(calc_order_id);
