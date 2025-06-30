import { useEffect, useRef, useCallback, useState } from 'react';

export const useGameAudio = () => {
    const [volume, setVolume] = useState(0.7);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
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

    // Initialize audio context on first user interaction
    const initializeAudio = useCallback(async () => {
        if (isInitializedRef.current) return;
        
        try {
            audioRefs.current.backgroundMusic = new Audio('/dist/public-uploads/sounds/background-music.mp3');
            audioRefs.current.bikeJump = new Audio('/dist/public-uploads/sounds/bike-jump.mp3');
            audioRefs.current.hittingBarrel = new Audio('/dist/public-uploads/sounds/hitting-barell.mp3');
            audioRefs.current.collectingBattery = new Audio('/dist/public-uploads/sounds/collecting-battery.mp3');
            audioRefs.current.gameOver = new Audio('/dist/public-uploads/sounds/game-over.mp3');

            // Configure background music
            if (audioRefs.current.backgroundMusic) {
                audioRefs.current.backgroundMusic.loop = true;
                audioRefs.current.backgroundMusic.volume = 0.3 * volume;
                audioRefs.current.backgroundMusic.preload = 'auto';
            }

            // Configure sound effects
            Object.values(audioRefs.current).forEach(audio => {
                if (audio && audio !== audioRefs.current.backgroundMusic) {
                    audio.volume = volume;
                    audio.preload = 'auto';
                }
            });

            isInitializedRef.current = true;
            setIsAudioEnabled(true);
        } catch (error) {
            console.warn('Failed to initialize audio:', error);
        }
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
        if (!isInitializedRef.current || !isAudioEnabled) return;

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
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.warn(`Failed to play ${soundName}:`, error);
                });
            }
        } catch (error) {
            console.warn(`Failed to play ${soundName}:`, error);
        }
    }, [isAudioEnabled]);

    const startBackgroundMusic = useCallback(async () => {
        // Initialize audio on first call (user interaction)
        if (!isInitializedRef.current) {
            await initializeAudio();
        }

        if (audioRefs.current.backgroundMusic && isInitializedRef.current && isAudioEnabled) {
            try {
                const playPromise = audioRefs.current.backgroundMusic.play();
                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        console.warn('Failed to start background music:', error);
                    });
                }
            } catch (error) {
                console.warn('Failed to start background music:', error);
            }
        }
    }, [initializeAudio, isAudioEnabled]);

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
        isAudioEnabled,
        initializeAudio,
    };
};