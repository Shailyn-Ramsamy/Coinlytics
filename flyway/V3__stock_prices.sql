CREATE TABLE stock_prices (
    id SERIAL PRIMARY KEY,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    close_price NUMERIC(20, 4) NOT NULL,
    UNIQUE (stock_id, date)
);