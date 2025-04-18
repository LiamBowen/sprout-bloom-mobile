
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

// Map friendly asset names to actual ticker symbols
const assetToTickerMap: Record<string, string> = {
  // ETFs and Indices
  'S&P 500 ETFs': 'SPY',
  'SP 500 ETFs': 'SPY',
  'Dividend Stocks': 'VYM',  // Vanguard High Dividend Yield ETF
  'Bonds': 'BND',            // Vanguard Total Bond Market ETF
  'Growth ETFs': 'VUG',      // Vanguard Growth ETF
  'Large-cap stocks': 'VOO', // Vanguard S&P 500 ETF
  'Balanced funds': 'VBINX', // Vanguard Balanced Index Fund
  
  // Crypto
  'Bitcoin (BTC)': 'BTC-USD',
  'Ethereum (ETH)': 'ETH-USD',
  'Solana (SOL)': 'SOL-USD',
  'Stablecoins (USDT, USDC)': 'USDT-USD',
  
  // For specific stocks
  'Blue-chip stocks': 'AAPL',  // Using Apple as example of blue chip
  'Tech stocks': 'QQQ',         // NASDAQ ETF
  'Small-cap stocks': 'IWM',    // Russell 2000 ETF
  'Emerging tech stocks': 'ARKK', // ARK Innovation ETF
  'Disruptive growth ETFs': 'ARKK',
  'Volatile tech stocks': 'TQQQ', // ProShares UltraPro QQQ
  'Low-risk ETFs': 'SPLV'        // Invesco S&P 500 Low Volatility ETF
};

// Mock prices for fallback when API fails
const mockPrices: Record<string, number> = {
  'SPY': 458.32,
  'VYM': 119.75,
  'BND': 72.88,
  'VUG': 340.12,
  'VOO': 420.45,
  'VBINX': 88.76,
  'BTC-USD': 63421.55,
  'ETH-USD': 3042.18,
  'SOL-USD': 142.33,
  'USDT-USD': 1.00,
  'AAPL': 169.93,
  'QQQ': 430.27,
  'IWM': 201.18,
  'ARKK': 47.92,
  'TQQQ': 51.30,
  'SPLV': 65.47,
  // Default fallback price
  'DEFAULT': 100.00
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchLivePrice(symbol: string, retries = 2): Promise<number | null> {
  try {
    // Check if we have a ticker mapping for this descriptive name
    const tickerSymbol = assetToTickerMap[symbol] || symbol;
    
    // Format symbol to handle special cases
    const formattedSymbol = tickerSymbol.replace('&', '');
    
    // First try to fetch from Finnhub API
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
      
      // If API fails after retries, use mock price data as fallback
      console.log(`Using mock price for ${tickerSymbol} after API failure`);
      return mockPrices[tickerSymbol] || mockPrices['DEFAULT'];
    }
    
    const data: FinnhubQuote = await response.json();
    return data.c;
  } catch (error) {
    console.error('Error fetching price:', error);
    
    // Use mock price data as fallback
    const tickerSymbol = assetToTickerMap[symbol] || symbol;
    console.log(`Using mock price for ${tickerSymbol} after error`);
    return mockPrices[tickerSymbol] || mockPrices['DEFAULT'];
  }
}
