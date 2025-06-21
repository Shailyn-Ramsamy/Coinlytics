// src/externalApis/coingecko.ts

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = process.env.REACT_APP_COINGECKO_API_KEY;

/**
 * Fetches simple price data for one or more coins.
 * @param ids - CoinGecko coin IDs (e.g., "bitcoin,ethereum")
 * @param vsCurrencies - Comparison currencies (e.g., "usd,eur")
 */
export async function fetchSimplePrices(
  ids: string,
  vsCurrencies: string = 'usd'
): Promise<Record<string, any>> {
  const url = `${COINGECKO_API_URL}/simple/price?ids=${ids}&vs_currencies=${vsCurrencies}&include_24hr_change=true`;

  const headers: HeadersInit = {};
  if (COINGECKO_API_KEY) {
    headers['x-cg-pro-api-key'] = COINGECKO_API_KEY;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetches full market data for a specific coin (for detail pages).
 * @param coinId - The CoinGecko ID of the coin (e.g., "bitcoin")
 */
export async function fetchCoinMarketData(coinId: string): Promise<any> {
  const url = `${COINGECKO_API_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&sparkline=true`;

  const headers: HeadersInit = {};
  if (COINGECKO_API_KEY) {
    headers['x-cg-pro-api-key'] = COINGECKO_API_KEY;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status}`);
  }

  return res.json();
}
