from pydantic import BaseModel

class PieChartData(BaseModel):
    name: str
    value: float
