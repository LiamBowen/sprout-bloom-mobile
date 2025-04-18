
import { useEffect, useState } from 'react';
import { fetchLivePrice } from '@/integrations/finnhub/client';
import { Skeleton } from '@/components/ui/skeleton';

interface LivePriceProps {
  symbol: string;
  className?: string;
}

export const LivePrice = ({ symbol, className = '' }: LivePriceProps) => {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrice = async () => {
      if (!symbol) {
        setIsLoading(false);
        setError("No symbol provided");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const livePrice = await fetchLivePrice(symbol);
        setPrice(livePrice);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load price:", err);
        setError("Failed to fetch price");
        setIsLoading(false);
      }
    };

    if (symbol) {
      loadPrice();
      // Refresh price every minute
      const interval = setInterval(loadPrice, 60000);
      return () => clearInterval(interval);
    } else {
      setIsLoading(false);
      setError("No symbol provided");
    }
  }, [symbol]);

  if (isLoading) {
    return <Skeleton className={`h-4 w-16 ${className}`} />;
  }

  if (error || price === null) {
    return <span className={`text-yellow-500 ${className}`}>Price unavailable</span>;
  }

  return (
    <span className={className}>
      £{price.toFixed(2)}
    </span>
  );
};
