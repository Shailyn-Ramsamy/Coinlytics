from sqlalchemy.orm import Session
from services.purchase_service import get_stock_growth
from schemas.charts import PieChartData
from models.stocks import Stock
from sqlalchemy import func
from models.userPurchase import UserPurchase

def search_stocks(db: Session, query: str = "", page: int = 1, page_size: int = 20):
    offset = (page - 1) * page_size
    search_term = f"%{query.lower()}%"

    return (
        db.query(Stock)
        .filter(
            (Stock.name.ilike(search_term)) |
            (Stock.symbol.ilike(search_term))
        )
        .order_by(Stock.symbol.asc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

def get_portfolio_distribution(db: Session, user_id: int):
    # Get all distinct stocks the user has invested in
    stocks = (
        db.query(Stock)
        .join(Stock.purchases)
        .filter(Stock.purchases.any(user_id=user_id))
        .distinct()
        .all()
    )

    result: list[PieChartData] = []

    for stock in stocks:
        try:
            growth = get_stock_growth(user_id=user_id, stock_id=stock.id, db=db)
            if growth:
                latest = growth[-1]  # Most recent value
                result.append({
                    "name": f"{stock.name} ({stock.symbol})",
                    "value": latest["value"],
                })
        except Exception as e:
            print(f"Skipping {stock.symbol}: {e}")

    return result

