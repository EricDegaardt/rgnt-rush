import React, { useState, useEffect, useRef } from 'react';

const PARTICLE_COUNT = 10;
const DURATION_MS = 700;
const GRAVITY = 0.4;

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    opacity: number;
    size: number;
}

const CollectionEffect = ({ x, y, onComplete }: { x: number; y: number; onComplete: () => void; }) => {
    const particlesRef = useRef<Particle[]>([]);
    const [_, setTick] = useState(0); // Used to trigger re-renders

    useEffect(() => {
        // Initialize particles only once
        if (particlesRef.current.length === 0) {
            particlesRef.current = Array.from({ length: PARTICLE_COUNT }).map(() => ({
                x: 0,
                y: 0,
                vx: (Math.random() - 0.5) * 8,   // Horizontal velocity
                vy: Math.random() * 12 + 4,      // Initial upward vertical velocity
                opacity: 1,
                size: 2 + Math.random() * 3,
            }));
        }

        const startTime = Date.now();
        let animationFrameId: number;

        const animate = () => {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime >= DURATION_MS) {
                onComplete();
                return;
            }

            const progress = elapsedTime / DURATION_MS;

            particlesRef.current = particlesRef.current.map(p => ({
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy,
                vy: p.vy - GRAVITY, // Apply gravity
                opacity: 1 - progress,
            }));

            setTick(t => t + 1);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [onComplete]);

    // Convert from bottom-based positioning to top-based positioning
    const gameHeight = window.innerHeight;
    const topPosition = gameHeight - y - 30; // Added 30px adjustment

    return (
        // The container is positioned at the collection point using translate3d
        <div 
            className="absolute" 
            style={{ 
                transform: `translate3d(${x}px, ${topPosition}px, 0)`,
                willChange: 'transform',
                zIndex: 20 
            }}
        >
            {particlesRef.current.map((p, i) => (
                <div
                    key={i}
                    className="absolute bg-yellow-400 rounded-full"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        // Particles move relative to the container
                        transform: `translate(${p.x}px, ${-p.y}px)`,
                        opacity: p.opacity,
                    }}
                />
            ))}
        </div>
    );
};

export default CollectionEffect;