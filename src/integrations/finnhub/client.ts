
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

interface FinnhubQuote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchLivePrice(symbol: string, retries = 2): Promise<number | null> {
  try {
    // Format symbol to handle special cases
    const formattedSymbol = symbol.replace('&', '');
    
    const response = await fetch(
      `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(formattedSymbol)}`,
      {
        headers: {
          'X-Finnhub-Token': 'd012td9r01qv3oh2c3mgd012td9r01qv3oh2c3n0'
        }
      }
    );
    
    if (!response.ok) {
      if (retries > 0) {
        await delay(1000); // Wait 1 second before retrying
        return fetchLivePrice(symbol, retries - 1);
      }
      throw new Error(`Failed to fetch price: ${response.statusText}`);
    }
    
    const data: FinnhubQuote = await response.json();
    return data.c;
  } catch (error) {
    console.error('Error fetching price:', error);
    return null;
  }
}
