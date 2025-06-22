import axios from "axios";
import api from "../api/axios";

export interface StockGrowthPoint {
  date: string;
  value: number;
}

export type PurchasePayload = {
  stock_id: number;
  purchase_date: string;
  amount_spent: number;
};

export async function fetchStockGrowth(userId: number, stockId: number): Promise<StockGrowthPoint[]> {
  try {
    const response = await api.get<StockGrowthPoint[]>(
      `/stock/growth`,
      {
        params: { user_id: userId, stock_id: stockId },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching stock growth:", error);
    throw error;
  }
}

export async function fetchUserStocks(userId: number) {
  const res = await fetch(`http://localhost:8000/stock/user-stocks?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user stocks");
  return await res.json();
}

export async function searchStocks(query: string, page: number = 1, pageSize: number = 10) {
  const res = await fetch(
    `http://localhost:8000/stocks/search?query=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`
  );

  if (!res.ok) {
    throw new Error("Failed to search stocks");
  }

  const data = await res.json();
  return data as { id: number; symbol: string; name: string }[];
}




export async function postStockPurchase(userId: number, payload: PurchasePayload) {
  try {
    const response = await api.post("/stock/purchases", payload);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail || error.message || "Failed to add stock purchase";
    throw new Error(message);
  }
}

export async function fetchUserDistribution(userId: number) {
  const res = await fetch(`http://localhost:8000/stocks/distribution?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user stocks");
  return await res.json();
}

