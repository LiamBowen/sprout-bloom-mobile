
import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";

const Confetti = () => {
  const { showConfetti } = useApp();
  const [confetti, setConfetti] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (showConfetti) {
      // Generate random confetti pieces
      const colors = ["bg-sprout-pink", "bg-sprout-green", "bg-sprout-blue", "bg-sprout-lavender", "bg-yellow-300"];
      const newConfetti = Array(50)
        .fill(0)
        .map((_, i) => {
          const size = Math.random() * 10 + 5;
          const color = colors[Math.floor(Math.random() * colors.length)];
          const left = `${Math.random() * 100}%`;
          const animationDuration = `${Math.random() * 2 + 2}s`;
          const animationDelay = `${Math.random() * 0.5}s`;
          
          return (
            <div
              key={`confetti-${i}`}
              className={`confetti ${color} absolute rounded-md`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left,
                animationDuration,
                animationDelay,
              }}
            />
          );
        });
        
      setConfetti(newConfetti);
      
      // Clean up after animation ends
      const timer = setTimeout(() => {
        setConfetti([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  if (!showConfetti) return null;
  
  return (
    <div className="fixed inset-0 overflow-hidden z-50 pointer-events-none">
      {confetti}
      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti {
          position: absolute;
          top: -10px;
          animation: confetti-fall var(--animation-duration, 3s) forwards;
        }
      `}</style>
    </div>
  );
};

export default Confetti;
