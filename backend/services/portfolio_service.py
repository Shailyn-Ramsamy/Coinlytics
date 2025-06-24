import os
import requests
from collections import defaultdict
from sqlalchemy.orm import Session
from fastapi import HTTPException
from dotenv import load_dotenv
from datetime import datetime
from backend.models.userPurchase import UserPurchase

load_dotenv()

def get_portfolio_value_history(user_id: int, db: Session):
    token = os.getenv("TWELVE_DATA_API_KEY")
    if not token:
        raise HTTPException(status_code=500, detail="Twelve Data API key not configured.")

    purchases = (
        db.query(UserPurchase)
        .join(UserPurchase.stock)
        .filter(UserPurchase.user_id == user_id)
        .all()
    )

    if not purchases:
        raise HTTPException(status_code=404, detail="No purchases found for user.")

    portfolio_by_day = defaultdict(float)

    for purchase in purchases:
        symbol = purchase.stock.symbol.upper()
        shares = float(purchase.shares)
        start_date = purchase.purchase_date.strftime("%Y-%m-%d")
        end_date = datetime.now().strftime("%Y-%m-%d")

        print(f"\n--- Processing {symbol} ---")
        print(f"Shares: {shares}")
        print(f"Start Date: {start_date}, End Date: {end_date}")

        url = "https://api.twelvedata.com/time_series"
        params = {
            "symbol": symbol,
            "interval": "1day",
            "start_date": start_date,
            "end_date": end_date,
            "apikey": token,
        }
        print(f"Fetching: {url}?symbol={symbol}&interval=1day&start_date={start_date}&end_date={end_date}&apikey=***")

        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            values = data.get("values")
            if not values:
                print(f"No values found for {symbol}")
                continue

            for entry in values:
                date_str = entry["datetime"]
                close_price = float(entry["close"])
                portfolio_by_day[date_str] += close_price * shares

        except Exception as e:
            print(f"Error fetching data for {symbol}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Twelve Data error for {symbol}: {str(e)}")

    print("\n--- Final Portfolio Values ---")
    for date, value in sorted(portfolio_by_day.items()):
        print(f"{date}: ${round(value, 2)}")

    return [
        {"date": date, "total_value": round(value, 2)}
        for date, value in sorted(portfolio_by_day.items())
    ]
