import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("TWELVE_DATA_API_KEY")
TWELVE_DATA_URL = "https://api.twelvedata.com/stocks"

EXCLUDE_KEYWORDS = [
    "Preferred Stock", "Series", "Warrant", "Note", "Bond",
    "ETF", "Fund", "Trust", "REIT"
]

def is_common_equity(name: str) -> bool:
    upper_name = name.upper()
    return not any(keyword.upper() in upper_name for keyword in EXCLUDE_KEYWORDS)

def fetch_twelve_data_symbols(exchange: str = "NASDAQ", country: str = "United States"):
    params = {
        "exchange": exchange,
        "country": country,
        "format": "JSON",
        "apikey": API_KEY
    }

    try:
        res = requests.get(TWELVE_DATA_URL, params=params, timeout=10)
        res.raise_for_status()
        data = res.json()

        if isinstance(data, dict) and "data" in data:
            return data["data"]
        else:
            print("⚠️ Unexpected response format:", data)
            return []

    except Exception as e:
        print(f"❌ Error fetching symbols: {e}")
        return []


def main():
    symbols = fetch_twelve_data_symbols()

    with open("V2__seed_stocks.sql", "w", encoding="utf-8") as f:
        for stock in symbols:
            name = stock.get("name", "").strip()
            if not name or not is_common_equity(name):
                continue

            symbol = stock.get("symbol", "").replace("'", "''")
            name = name.replace("'", "''")
            exchange = stock.get("exchange", "UNKNOWN").replace("'", "''")
            currency = stock.get("currency", "USD").upper()

            f.write(
                f"INSERT INTO stocks (symbol, name, exchange, currency) "
                f"VALUES ('{symbol}', '{name}', '{exchange}', '{currency}') "
                f"ON CONFLICT (symbol) DO NOTHING;\n"
            )

    print("✅ Filtered seed SQL file generated successfully.")

if __name__ == "__main__":
    main()
