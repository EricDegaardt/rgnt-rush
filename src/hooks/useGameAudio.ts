import { useEffect, useRef, useState, useCallback } from 'react';

export const useGameAudio = () => {
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem('gameAudioMuted');
        return saved ? JSON.parse(saved) : false;
    });

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

    // Load all audio files
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
            audioRefs.current.backgroundMusic.volume = 0.3;
            
            // Start background music immediately if not muted
            if (!isMuted) {
                audioRefs.current.backgroundMusic.play().catch(() => {
                    // Ignore autoplay policy errors
                });
            }
        }

        // Configure sound effects
        Object.values(audioRefs.current).forEach(audio => {
            if (audio && audio !== audioRefs.current.backgroundMusic) {
                audio.volume = 0.7;
            }
        });

        isInitializedRef.current = true;
    }, [isMuted]);

    // Handle mute state changes
    useEffect(() => {
        localStorage.setItem('gameAudioMuted', JSON.stringify(isMuted));
        
        // Control all audio based on mute state
        Object.values(audioRefs.current).forEach(audio => {
            if (audio) {
                audio.muted = isMuted;
            }
        });

        // Control background music playback
        if (audioRefs.current.backgroundMusic && isInitializedRef.current) {
            if (isMuted) {
                audioRefs.current.backgroundMusic.pause();
            } else {
                audioRefs.current.backgroundMusic.play().catch(() => {
                    // Ignore autoplay policy errors
                });
            }
        }
    }, [isMuted]);

    const playSound = useCallback((soundName: keyof typeof audioRefs.current) => {
        if (isMuted || !isInitializedRef.current) return;

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
    }, [isMuted]);

    const startBackgroundMusic = useCallback(() => {
        if (!isMuted && audioRefs.current.backgroundMusic && isInitializedRef.current) {
            audioRefs.current.backgroundMusic.play().catch(() => {
                // Ignore autoplay policy errors
            });
        }
    }, [isMuted]);

    const stopBackgroundMusic = useCallback(() => {
        // Background music continues playing - this is kept for compatibility
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const newMuted = !prev;
            console.log('Toggling mute:', prev, '->', newMuted); // Debug log
            return newMuted;
        });
    }, []);

    return {
        playSound,
        startBackgroundMusic,
        stopBackgroundMusic,
        toggleMute,
        isMuted,
    };
};