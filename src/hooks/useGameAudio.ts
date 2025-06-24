import { useEffect, useRef, useCallback, useState } from 'react';

export const useGameAudio = () => {
    const [volume, setVolume] = useState(70); // Default volume at 70%
    
    const audioRefs = useRef({
        backgroundMusic: null as HTMLAudioElement | null,
        bikeJump: null as HTMLAudioElement | null,
        hittingBarrel: null as HTMLAudioElement | null,
        collectingBattery: null as HTMLAudioElement | null,
        gameOver: null as HTMLAudioElement | null,
    });

    const lastPlayedRef = useRef({
        bikeJump: 0,
        hittingBarrel: 0,
        collectingBattery: 0,
        gameOver: 0,
    });

    const isInitializedRef = useRef(false);

    // Load all audio files ONLY ONCE - completely isolated from any state changes
    useEffect(() => {
        if (isInitializedRef.current) return;
        
        audioRefs.current.backgroundMusic = new Audio('/lovable-uploads/sounds/background-music.mp3');
        audioRefs.current.bikeJump = new Audio('/lovable-uploads/sounds/bike-jump.mp3');
        audioRefs.current.hittingBarrel = new Audio('/lovable-uploads/sounds/hitting-barell.mp3');
        audioRefs.current.collectingBattery = new Audio('/lovable-uploads/sounds/collecting-battery.mp3');
        audioRefs.current.gameOver = new Audio('/lovable-uploads/sounds/game-over.mp3');

        // Configure background music
        if (audioRefs.current.backgroundMusic) {
            audioRefs.current.backgroundMusic.loop = true;
            audioRefs.current.backgroundMusic.volume = 0.3 * (volume / 100);
            
            // Start background music immediately
            audioRefs.current.backgroundMusic.play().catch(() => {
                // Ignore autoplay policy errors
            });
        }

        // Configure sound effects
        Object.values(audioRefs.current).forEach(audio => {
            if (audio && audio !== audioRefs.current.backgroundMusic) {
                audio.volume = 0.7 * (volume / 100);
            }
        });

        isInitializedRef.current = true;
    }, []); // Empty dependency array - initialize only once!

    // Handle volume changes without affecting initialization
    useEffect(() => {
        if (!isInitializedRef.current) return;
        
        const volumeMultiplier = volume / 100;
        
        // Update background music volume
        if (audioRefs.current.backgroundMusic) {
            audioRefs.current.backgroundMusic.volume = 0.3 * volumeMultiplier;
        }
        
        // Update sound effects volume
        Object.entries(audioRefs.current).forEach(([key, audio]) => {
            if (audio && key !== 'backgroundMusic') {
                audio.volume = 0.7 * volumeMultiplier;
            }
        });
    }, [volume]);

    // Stable playSound function that doesn't change
    const playSound = useCallback((soundName: keyof typeof audioRefs.current) => {
        if (!isInitializedRef.current || volume === 0) return;

        const audio = audioRefs.current[soundName];
        if (!audio) return;

        // Prevent rapid-fire sounds (except background music)
        if (soundName !== 'backgroundMusic') {
            const now = Date.now();
            const lastPlayed = lastPlayedRef.current[soundName as keyof typeof lastPlayedRef.current];
            if (lastPlayed && now - lastPlayed < 100) return; // 100ms cooldown
            lastPlayedRef.current[soundName as keyof typeof lastPlayedRef.current] = now;
        }

        try {
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Ignore autoplay policy errors
            });
        } catch (error) {
            console.warn(`Failed to play ${soundName}:`, error);
        }
    }, []); // No dependencies to prevent function recreation

    const startBackgroundMusic = useCallback(() => {
        if (audioRefs.current.backgroundMusic && isInitializedRef.current) {
            audioRefs.current.backgroundMusic.play().catch(() => {
                // Ignore autoplay policy errors
            });
        }
    }, []);

    const stopBackgroundMusic = useCallback(() => {
        // Background music continues playing - this is kept for compatibility
    }, []);

    // Volume control function
    const setVolumeLevel = useCallback((newVolume: number) => {
        const clampedVolume = Math.max(0, Math.min(100, newVolume));
        setVolume(clampedVolume);
    }, []);

    return {
        playSound,
        startBackgroundMusic,
        stopBackgroundMusic,
        volume,
        setVolumeLevel,
    };
};