
'use client';

import { useState, useEffect } from 'react';

export function AnimatedBackground() {
  const [stars, setStars] = useState<Array<{ cx: number; cy: number; r: number; delay: number }>>([]);
  const [shootingStars, setShootingStars] = useState<Array<{ y: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 100 }).map(() => ({
        cx: Math.random() * 100,
        cy: Math.random() * 100,
        r: Math.random() * 0.8 + 0.2,
        delay: Math.random() * 4,
      }));
      setStars(newStars);
    };

    const generateShootingStars = () => {
        const newShootingStars = Array.from({ length: 5 }).map(() => ({
            y: Math.random() * 100,
            delay: Math.random() * 10 + 2, // Start after a delay
            duration: Math.random() * 5 + 5, // 5 to 10 seconds duration
        }));
        setShootingStars(newShootingStars);
    };

    generateStars();
    generateShootingStars();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
            {/* Twinkling Stars */}
            {stars.map((star, i) => (
            <circle
                key={`star-${i}`}
                cx={`${star.cx}%`}
                cy={`${star.cy}%`}
                r={star.r}
                fill="white"
                className="animate-twinkle"
                style={{ animationDelay: `${star.delay}s` }}
            />
            ))}

            {/* Shooting Stars */}
            {shootingStars.map((star, i) => (
                <circle
                    key={`shooting-star-${i}`}
                    cx="0"
                    cy={`${star.y}%`}
                    r="1.5"
                    fill="white"
                    className="animate-shoot"
                    style={{ 
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                        filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))'
                    }}
                />
            ))}
        </svg>
    </div>
  );
}
