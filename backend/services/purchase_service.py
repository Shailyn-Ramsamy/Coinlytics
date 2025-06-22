from datetime import timedelta
import os
import requests
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.userPurchase import UserPurchase
from models.stocks import Stock
from schemas.purchase import PurchaseCreate
from collections import defaultdict
from datetime import date, timedelta


def create_purchase(db: Session, user_id: int, purchase: PurchaseCreate):
    token = os.getenv("TWELVE_DATA_API_KEY")
    if not token:
        raise HTTPException(status_code=500, detail="Twelve Data API key not configured.")

    stock = db.query(Stock).filter(Stock.id == purchase.stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    symbol = stock.symbol.upper()
    purchase_date = purchase.purchase_date  # assuming this is a `date` or `datetime` object
    end_date = purchase_date + timedelta(days=1)

    url = "https://api.twelvedata.com/time_series"
    params = {
        "symbol": symbol,
        "interval": "1day",
        "start_date": purchase_date.isoformat(),
        "end_date": end_date.isoformat(),
        "apikey": token,
    }

    print(f"Fetching historical price for {symbol} on {purchase_date}")
    response = requests.get(url, params=params, timeout=10)
    data = response.json()

    values = data.get("values")
    if not values:
        raise HTTPException(status_code=404, detail=f"No data for {symbol} on {purchase_date}")

    try:
        price_per_share = float(values[0]["close"])
    except (KeyError, ValueError):
        raise HTTPException(status_code=500, detail="Malformed response from Twelve Data")

    shares = round(purchase.amount_spent / price_per_share, 6)

    db_purchase = UserPurchase(
        user_id=user_id,
        stock_id=purchase.stock_id,
        amount_spent=purchase.amount_spent,
        shares=shares,
        price_per_share=round(price_per_share, 2),
        purchase_date=purchase.purchase_date,
    )
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

def get_user_unique_stocks(db: Session, user_id: int):
    return (
        db.query(Stock)
        .join(UserPurchase, Stock.id == UserPurchase.stock_id)
        .filter(UserPurchase.user_id == user_id)
        .distinct()
        .all()
    )



def get_stock_growth(user_id: int, stock_id: int, db: Session):
    token = os.getenv("TWELVE_DATA_API_KEY")
    if not token:
        raise HTTPException(status_code=500, detail="API key not configured")

    purchases = (
        db.query(UserPurchase)
        .filter(UserPurchase.user_id == user_id, UserPurchase.stock_id == stock_id)
        .order_by(UserPurchase.purchase_date)
        .all()
    )

    if not purchases:
        raise HTTPException(status_code=404, detail="No purchases found")

    symbol = db.query(Stock).filter(Stock.id == stock_id).first().symbol.upper()
    start_date = min(p.purchase_date for p in purchases)
    today = date.today()

    url = "https://api.twelvedata.com/time_series"
    params = {
        "symbol": symbol,
        "interval": "1day",
        "start_date": start_date.isoformat(),
        "end_date": today.isoformat(),
        "apikey": token,
    }

    print(f"Fetching prices for {symbol} from {start_date} to {today}")
    response = requests.get(url, params=params, timeout=10)
    data = response.json()
    values = data.get("values", [])
    if not values:
        raise HTTPException(status_code=404, detail="No price data available")

    prices_by_date = {entry["datetime"]: float(entry["close"]) for entry in values}
    prices_by_date = dict(sorted(prices_by_date.items()))

    portfolio_value_by_date = {}
    cumulative_shares = 0

    for price_date in prices_by_date:
        date_obj = date.fromisoformat(price_date)

        for purchase in purchases:
            if purchase.purchase_date == date_obj:
                cumulative_shares += float(purchase.shares)

        portfolio_value = cumulative_shares * prices_by_date[price_date]
        portfolio_value_by_date[price_date] = round(portfolio_value, 2)

    return [
        {"date": d, "value": v}
        for d, v in portfolio_value_by_date.items()
    ]
