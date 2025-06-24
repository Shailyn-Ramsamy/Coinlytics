// external_api/finnhub.ts
import api from "../api/axios";

export async function fetchLatestStockNews(category?: string | null) {
  try {
    const res = await api.get("/news/stocks", {
      params: category ? { category } : {},
    });

    return res.data;
  } catch (err) {
    console.error("Failed to fetch news", err);
    throw err;
  }
}
