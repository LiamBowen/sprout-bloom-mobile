
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchLivePrice(symbol: string, retries = 2): Promise<number | null> {
  try {
    // Check if we have a ticker mapping for this descriptive name
    const tickerSymbol = assetToTickerMap[symbol] || symbol;
    
    // Format symbol to handle special cases
    const formattedSymbol = tickerSymbol.replace('&', '');
    
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
