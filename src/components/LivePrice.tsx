
import { useEffect, useState } from 'react';
import { fetchLivePrice } from '@/integrations/finnhub/client';

interface LivePriceProps {
  symbol: string;
  className?: string;
}

export const LivePrice = ({ symbol, className = '' }: LivePriceProps) => {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrice = async () => {
      setIsLoading(true);
      const livePrice = await fetchLivePrice(symbol);
      setPrice(livePrice);
      setIsLoading(false);
    };

    if (symbol) {
      loadPrice();
      // Refresh price every minute
      const interval = setInterval(loadPrice, 60000);
      return () => clearInterval(interval);
    }
  }, [symbol]);

  if (isLoading) {
    return <span className={className}>Loading price...</span>;
  }

  if (!price) {
    return <span className={className}>Price temporarily unavailable</span>;
  }

  return (
    <span className={className}>
      £{price.toFixed(2)}
    </span>
  );
};
