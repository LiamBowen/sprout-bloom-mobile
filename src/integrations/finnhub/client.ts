
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

export async function fetchLivePrice(symbol: string): Promise<number | null> {
  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}`,
      {
        headers: {
          'X-Finnhub-Token': 'd012td9r01qv3oh2c3mgd012td9r01qv3oh2c3n0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch price');
    }
    
    const data: FinnhubQuote = await response.json();
    return data.c;
  } catch (error) {
    console.error('Error fetching price:', error);
    return null;
  }
}
