# Full implementation with historical price storage

from datetime import date, timedelta
import os
import requests
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.userPurchase import UserPurchase
from models.stocks import Stock
from models.stockprice import StockPrice
from schemas.purchase import PurchaseCreate


def create_purchase(db: Session, user_id: int, purchase: PurchaseCreate):
    token = os.getenv("TWELVE_DATA_API_KEY")
    if not token:
        raise HTTPException(status_code=500, detail="Twelve Data API key not configured.")

    stock = db.query(Stock).filter(Stock.id == purchase.stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    symbol = stock.symbol.upper()
    purchase_date = purchase.purchase_date
    end_date = purchase_date + timedelta(days=1)

    # Check if price already exists in DB
    existing_price = (
        db.query(StockPrice)
        .filter(StockPrice.stock_id == stock.id, StockPrice.date == purchase_date)
        .first()
    )

    if existing_price:
        price_per_share = float(existing_price.close_price)
    else:
        # Fetch from API
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

        # Save to DB
        db_price = StockPrice(
            stock_id=stock.id,
            date=purchase_date,
            close_price=round(price_per_share, 2),
        )
        db.add(db_price)
        db.commit()

    shares = round(purchase.amount_spent / price_per_share, 6)

    db_purchase = UserPurchase(
        user_id=user_id,
        stock_id=purchase.stock_id,
        amount_spent=purchase.amount_spent,
        shares=shares,
        price_per_share=round(price_per_share, 2),
        purchase_date=purchase_date,
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
    purchases = (
        db.query(UserPurchase)
        .filter(UserPurchase.user_id == user_id, UserPurchase.stock_id == stock_id)
        .order_by(UserPurchase.purchase_date)
        .all()
    )

    if not purchases:
        raise HTTPException(status_code=404, detail="No purchases found")

    start_date = min(p.purchase_date for p in purchases)
    today = date.today()

    # Fetch any missing price data from API and store
    existing_price_dates = {
        p.date for p in db.query(StockPrice).filter(StockPrice.stock_id == stock_id).all()
    }
    missing_dates = [start_date + timedelta(days=i) for i in range((today - start_date).days + 1)
                     if (start_date + timedelta(days=i)) not in existing_price_dates]

    if missing_dates:
        token = os.getenv("TWELVE_DATA_API_KEY")
        if not token:
            raise HTTPException(status_code=500, detail="API key not configured")

        symbol = db.query(Stock).filter(Stock.id == stock_id).first().symbol.upper()
        url = "https://api.twelvedata.com/time_series"
        params = {
            "symbol": symbol,
            "interval": "1day",
            "start_date": missing_dates[0].isoformat(),
            "end_date": today.isoformat(),
            "apikey": token,
        }
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        values = data.get("values", [])
        for v in values:
            date_obj = date.fromisoformat(v["datetime"])
            if date_obj in existing_price_dates:
                continue  # Skip existing entry
            try:
                price = float(v["close"])
                db.add(StockPrice(stock_id=stock_id, date=date_obj, close_price=round(price, 2)))
            except (KeyError, ValueError):
                continue  # Skip malformed data
        db.commit()

    # Build price lookup
    prices = (
        db.query(StockPrice)
        .filter(StockPrice.stock_id == stock_id, StockPrice.date >= start_date)
        .all()
    )
    price_map = {p.date.isoformat(): p.close_price for p in prices}
    sorted_dates = sorted(price_map.keys())

    cumulative_shares = 0
    portfolio_value_by_date = {}
    for d in sorted_dates:
        d_obj = date.fromisoformat(d)
        for p in purchases:
            if p.purchase_date == d_obj:
                cumulative_shares += float(p.shares)
        portfolio_value_by_date[d] = round(cumulative_shares * float(price_map[d]), 2)

    return [{"date": d, "value": v} for d, v in portfolio_value_by_date.items()]


def get_total_portfolio_growth(user_id: int, db: Session):
    from collections import defaultdict

    # Get all user purchases grouped by stock
    purchases = (
        db.query(UserPurchase)
        .filter(UserPurchase.user_id == user_id)
        .order_by(UserPurchase.purchase_date)
        .all()
    )
    if not purchases:
        raise HTTPException(status_code=404, detail="No purchases found")

    stock_ids = list({p.stock_id for p in purchases})
    start_date = min(p.purchase_date for p in purchases)
    today = date.today()

    # Ensure price data exists for all stocks and dates
    token = os.getenv("TWELVE_DATA_API_KEY")
    if not token:
        raise HTTPException(status_code=500, detail="API key not configured")

    for stock_id in stock_ids:
        symbol = db.query(Stock).filter(Stock.id == stock_id).first().symbol.upper()
        existing_dates = {
            p.date for p in db.query(StockPrice).filter(StockPrice.stock_id == stock_id).all()
        }
        missing_dates = [start_date + timedelta(days=i) for i in range((today - start_date).days + 1)
                         if (start_date + timedelta(days=i)) not in existing_dates]

        if missing_dates:
            url = "https://api.twelvedata.com/time_series"
            params = {
                "symbol": symbol,
                "interval": "1day",
                "start_date": missing_dates[0].isoformat(),
                "end_date": today.isoformat(),
                "apikey": token,
            }
            response = requests.get(url, params=params, timeout=10)
            values = response.json().get("values", [])
            for v in values:
                try:
                    d = date.fromisoformat(v["datetime"])
                    if d in existing_dates:
                        continue
                    price = float(v["close"])
                    db.add(StockPrice(stock_id=stock_id, date=d, close_price=round(price, 2)))
                except (KeyError, ValueError):
                    continue
            db.commit()

    # Aggregate total value over time
    price_lookup = defaultdict(dict)
    all_prices = db.query(StockPrice).filter(StockPrice.stock_id.in_(stock_ids)).all()
    for p in all_prices:
        price_lookup[p.stock_id][p.date] = float(p.close_price)

    portfolio_by_date = defaultdict(float)
    shares_by_stock = defaultdict(float)

    current_date = start_date
    while current_date <= today:
        for p in purchases:
            if p.purchase_date == current_date:
                shares_by_stock[p.stock_id] += float(p.shares)

        for stock_id in stock_ids:
            if current_date in price_lookup[stock_id]:
                portfolio_by_date[current_date] += shares_by_stock[stock_id] * price_lookup[stock_id][current_date]
        current_date += timedelta(days=1)

    return [{"date": d.isoformat(), "value": round(v, 2)} for d, v in sorted(portfolio_by_date.items())]

