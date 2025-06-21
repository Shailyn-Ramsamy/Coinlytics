export async function fetchLatestCryptoNews() {
  const res = await fetch("http://localhost:8000/news"); // Point to your FastAPI backend
  if (!res.ok) throw new Error("Failed to fetch news");
  const data = await res.json();
  return data.results;
}
