
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Snail from './Snail.tsx';
import { ASSETS, SNAILS_CONFIG, MOVEMENT_SETTINGS } from '../constants.ts';
import { SnailData, SnailState } from '../types.ts';
import { Volume2, VolumeX } from 'lucide-react';

interface SanctuaryProps {
  activeSnailId: number | null;
  onSnailClick: (data: SnailData) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

// Internal state extension for organic movement
interface ExtendedSnailState extends SnailState {
  baseSpeed: number;
  speedOffset: number;
}

const Sanctuary: React.FC<SanctuaryProps> = ({ 
  activeSnailId, 
  onSnailClick, 
  isMuted, 
  onToggleMute 
}) => {
  const [snails, setSnails] = useState<ExtendedSnailState[]>(() => {
    // Distribute snails across lanes to minimize friction
    const numLanes = 25; 
    const laneHeight = (window.innerHeight - 300) / numLanes;
    
    return SNAILS_CONFIG.map((cfg, i) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const laneIndex = i % numLanes;
      const yPos = 220 + (laneIndex * laneHeight) + (Math.random() * 15 - 7.5);
      const baseSpeed = MOVEMENT_SETTINGS.MIN_SPEED + Math.random() * (MOVEMENT_SETTINGS.MAX_SPEED - MOVEMENT_SETTINGS.MIN_SPEED);
      
      return {
        id: cfg.id,
        position: { 
          x: Math.random() * window.innerWidth, 
          y: yPos
        },
        laneY: yPos,
        speed: baseSpeed,
        baseSpeed: baseSpeed,
        speedOffset: Math.random() * 1000, // Random phase for speed oscillation
        direction: direction,
      };
    });
  });

  const requestRef = useRef<number | null>(null);
  const turnCooldowns = useRef<Record<number, number>>({});

  const animate = useCallback((time: number) => {
    setSnails((prevSnails) => {
      return prevSnails.map((snail) => {
        if (snail.id === activeSnailId) return snail;

        let { x, y } = snail.position;
        let { baseSpeed, direction, speedOffset } = snail;

        // Apply a very slow speed oscillation (breathing speed)
        // This makes them feel like they are "pushing" forward or resting
        const oscillation = Math.sin((time + speedOffset) * 0.0005); 
        const currentSpeed = baseSpeed * (0.8 + oscillation * 0.4);

        x += currentSpeed * direction;

        // Organic turn logic: Increased cooldown to 10 seconds.
        // Snails should be persistent and lazy.
        const now = performance.now();
        const cooldown = turnCooldowns.current[snail.id] || 0;
        const canTurn = now - cooldown > 10000; 

        const margin = 200; // Large margin so they disappear and reappear
        if (canTurn) {
          // Boundary checks: Only turn if headed towards a very deep off-screen boundary
          if (x < -margin && direction === -1) {
            direction = 1;
            turnCooldowns.current[snail.id] = now;
          } else if (x > window.innerWidth + margin && direction === 1) {
            direction = -1;
            turnCooldowns.current[snail.id] = now;
          }

          // Horizontal spacing: Reduced sensitivity and added laziness
          prevSnails.forEach(other => {
            if (snail.id === other.id) return;
            // Check if they are in nearly the same horizontal lane
            if (Math.abs(snail.laneY - other.laneY) < 20) {
              const dx = x - other.position.x;
              const dist = Math.abs(dx);
              
              // Only react if very close and actually moving towards each other
              if (dist < MOVEMENT_SETTINGS.SNAIL_RADIUS * 3.5) {
                const movingTowards = (direction === 1 && dx < 0) || (direction === -1 && dx > 0);
                if (movingTowards) {
                  // Flipping direction with heavy cooldown
                  direction *= -1;
                  turnCooldowns.current[snail.id] = now;
                }
              }
            }
          });
        }

        return {
          ...snail,
          position: { x, y },
          direction,
          speed: currentSpeed
        };
      });
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [activeSnailId]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#064e3b] select-none">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url('${ASSETS.background}')`,
          backgroundSize: 'cover',
          filter: activeSnailId !== null ? 'brightness(0.3) blur(12px)' : 'brightness(1) blur(0px)',
          transform: activeSnailId !== null ? 'scale(1.15)' : 'scale(1)',
        }}
      />

      {/* Centered Opaque Title & Subtitle */}
      <div className="absolute top-16 left-0 right-0 z-20 flex flex-col items-center pointer-events-none select-none px-6">
        <h1 className="text-4xl md:text-7xl font-momentz text-white drop-shadow-2xl text-center leading-tight">
          The Snail Sanctuary
        </h1>
        <p className="mt-4 max-w-3xl text-center text-white text-sm md:text-lg font-light tracking-wide leading-relaxed opacity-90 drop-shadow-md">
          A slow creativity challenge for creatives that don't want to rush. 
          <br className="hidden md:block" />
          Click a snail and make something inspired by the prompt. 
          Use any materials you like.
        </p>
      </div>

      {snails.map((snailState) => {
        const config = SNAILS_CONFIG.find(c => c.id === snailState.id)!;
        return (
          <Snail
            key={snailState.id}
            data={config}
            position={snailState.position}
            direction={snailState.direction}
            isPaused={activeSnailId === snailState.id}
            onClick={onSnailClick}
          />
        );
      })}

      <button 
        onClick={onToggleMute}
        className="absolute bottom-10 left-10 z-30 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white/70 transition-all border border-white/10 backdrop-blur-md shadow-xl"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
    </div>
  );
};

export default Sanctuary;
