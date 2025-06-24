import { useEffect, useRef, useCallback, useState } from 'react';

export const useGameAudio = () => {
    const [volume, setVolume] = useState(0.7);
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

    // Load all audio files (but don't start background music automatically)
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
            audioRefs.current.backgroundMusic.volume = 0.3 * volume;
        }

        // Configure sound effects
        Object.values(audioRefs.current).forEach(audio => {
            if (audio && audio !== audioRefs.current.backgroundMusic) {
                audio.volume = volume;
            }
        });

        isInitializedRef.current = true;
    }, [volume]);

    // Update volume for all audio elements when volume changes
    useEffect(() => {
        if (!isInitializedRef.current) return;

        if (audioRefs.current.backgroundMusic) {
            audioRefs.current.backgroundMusic.volume = 0.3 * volume;
        }

        Object.values(audioRefs.current).forEach(audio => {
            if (audio && audio !== audioRefs.current.backgroundMusic) {
                audio.volume = volume;
            }
        });
    }, [volume]);

    const playSound = useCallback((soundName: keyof typeof audioRefs.current) => {
        if (!isInitializedRef.current) return;

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
    }, []);

    const startBackgroundMusic = useCallback(() => {
        if (audioRefs.current.backgroundMusic && isInitializedRef.current) {
            audioRefs.current.backgroundMusic.play().catch((error) => {
                console.warn('Failed to start background music:', error);
            });
        }
    }, []);

    const stopBackgroundMusic = useCallback(() => {
        if (audioRefs.current.backgroundMusic) {
            audioRefs.current.backgroundMusic.pause();
            audioRefs.current.backgroundMusic.currentTime = 0;
        }
    }, []);

    // Remove mute functionality - these are kept for compatibility but do nothing
    const toggleMute = useCallback(() => {
        // No-op - mute functionality removed
    }, []);

    const setGameVolume = useCallback((newVolume: number) => {
        setVolume(Math.max(0, Math.min(1, newVolume)));
    }, []);

    return {
        playSound,
        startBackgroundMusic,
        stopBackgroundMusic,
        toggleMute,
        isMuted: false, // Always false since mute is removed
        volume,
        setVolume: setGameVolume,
    };
};
