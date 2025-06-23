// external_api/finnhub.ts
export async function fetchLatestStockNews(category?: string | null) {
  let url = "http://localhost:8000/news/stocks";
  if (category) {
    url += `?category=${category}`;
  }

  const res = await fetch(url, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch news");

  const data = await res.json();
  return data; 
}
