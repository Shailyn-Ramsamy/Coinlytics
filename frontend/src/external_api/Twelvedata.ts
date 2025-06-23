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

export async function fetchTotalPortfolioGrowth(userId: number): Promise<StockGrowthPoint[]> {
  try {
    const response = await api.get<StockGrowthPoint[]>(
      `/stock/growth/total`,
      {
        params: { user_id: userId },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching stock growth:", error);
    throw error;
  }
}


export async function fetchUserStocks(userId: number) {
  try {
    const res = await api.get("/stock/user-stocks", {
      params: { user_id: userId },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch user stocks", err);
    throw new Error("Failed to fetch user stocks");
  }
}

export async function searchStocks(query: string, page: number = 1, pageSize: number = 10) {
  try {
    const res = await api.get("/stocks/search", {
      params: {
        query,
        page,
        page_size: pageSize,
      },
    });
    return res.data as { id: number; symbol: string; name: string }[];
  } catch (err) {
    console.error("Failed to search stocks", err);
    throw new Error("Failed to search stocks");
  }
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
  try {
    const res = await api.get("/stocks/distribution", {
      params: { user_id: userId },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch user stocks", err);
    throw new Error("Failed to fetch user stocks");
  }
}


