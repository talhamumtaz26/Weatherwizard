import { motion } from "framer-motion";
import { useMemo } from "react";

interface RainEffectProps {
  intensity: number; // 0-1 scale
  isThunder?: boolean;
}

export function RainEffect({ intensity, isThunder = false }: RainEffectProps) {
  const raindrops = useMemo(() => {
    const drops = [];
    const count = Math.floor(intensity * 100 + 20); // 20-120 drops based on intensity
    
    for (let i = 0; i < count; i++) {
      drops.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.5 + Math.random() * 0.5,
        opacity: 0.3 + Math.random() * 0.4,
        size: intensity > 0.7 ? 2 + Math.random() * 2 : 1 + Math.random() * 1,
      });
    }
    return drops;
  }, [intensity]);

  const thunderFlash = useMemo(() => {
    if (!isThunder) return null;
    return Math.random() * 5000 + 3000; // Random interval between 3-8 seconds
  }, [isThunder]);

  if (intensity === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Rain drops */}
      {raindrops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute bg-blue-300"
          style={{
            left: `${drop.x}%`,
            width: `${drop.size}px`,
            height: `${drop.size * 8}px`,
            opacity: drop.opacity,
            borderRadius: '0 0 50% 50%',
          }}
          initial={{ y: -50, x: 0 }}
          animate={{ 
            y: '100vh',
            x: intensity > 0.5 ? -20 : -10, // More wind effect for heavy rain
          }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Thunder effect */}
      {isThunder && (
        <motion.div
          className="fixed inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: thunderFlash ? thunderFlash / 1000 : 4,
          }}
        />
      )}

      {/* Rain overlay for depth */}
      <div 
        className="fixed inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-blue-900/10"
        style={{ opacity: intensity * 0.3 }}
      />
    </div>
  );
}