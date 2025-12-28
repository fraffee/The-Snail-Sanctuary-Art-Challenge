
import React from 'react';
import { SnailData, Vector2 } from '../types.ts';

interface SnailProps {
  data: SnailData;
  position: Vector2;
  direction: number; // 1 for right, -1 for left
  isPaused: boolean;
  onClick: (data: SnailData) => void;
}

const Snail: React.FC<SnailProps> = ({ data, position, direction, isPaused, onClick }) => {
  // If original PNG faces left: 
  // direction -1 (Left) -> scaleX(1)
  // direction 1 (Right) -> scaleX(-1)
  const flipScale = direction === -1 ? 1 : -1;

  return (
    <div
      className="absolute cursor-pointer select-none transition-all duration-[800ms] ease-linear"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scaleX(${flipScale})`,
        zIndex: 10 + data.id,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(data);
      }}
    >
      {/* Ground Shadow - Stays at the base of the container while the snail image bobs */}
      <div 
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 md:w-12 md:h-3 bg-black/15 blur-[6px] rounded-[50%] transition-opacity duration-500"
        style={{
          opacity: isPaused ? 0.3 : 1,
          transform: `translateX(-50%) scale(${isPaused ? 0.9 : 1})`,
        }}
      />

      <img
        src={data.image}
        alt={`Snail ${data.id}`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/144/snail.png';
        }}
        // Small size as requested
        className="w-12 h-12 md:w-16 md:h-16 drop-shadow-md pointer-events-none relative z-10"
        style={{
          animation: isPaused ? 'none' : `snail-bob ${4 + (data.id % 4)}s ease-in-out infinite`,
          transition: 'transform 0.8s ease-in-out' // Smooth the flip
        }}
      />
      <style>{`
        @keyframes snail-bob {
          0%, 100% { transform: translateY(0) scale(1, 1); }
          25% { transform: translateY(-5px) scale(1.02, 0.98); }
          50% { transform: translateY(0) scale(1.04, 0.96); }
          75% { transform: translateY(-3px) scale(1.02, 0.98); }
        }
      `}</style>
    </div>
  );
};

export default Snail;
