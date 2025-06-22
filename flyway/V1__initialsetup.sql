CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- List of supported stocks
CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) UNIQUE NOT NULL, -- e.g., AAPL
    name VARCHAR(100) NOT NULL,         -- e.g., Apple Inc.
    exchange VARCHAR(50),               -- e.g., NASDAQ
    currency VARCHAR(10) DEFAULT 'USD'  -- USD, EUR, etc.
);

-- User stock purchases
-- User stock purchases
CREATE TABLE user_purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    amount_spent NUMERIC(20, 2) NOT NULL,         -- total amount the user invested
    shares NUMERIC(20, 6) NOT NULL,               -- calculated from API
    price_per_share NUMERIC(20, 2) NOT NULL,      -- fetched from external API
    purchase_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

