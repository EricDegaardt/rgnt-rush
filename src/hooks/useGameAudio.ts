
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
    });

    const lastPlayedRef = useRef({
        bikeJump: 0,
        hittingBarrel: 0,
        collectingBattery: 0,
    });

    // Load all audio files
    useEffect(() => {
        audioRefs.current.backgroundMusic = new Audio('/lovable-uploads/sounds/background-music.mp3');
        audioRefs.current.bikeJump = new Audio('/lovable-uploads/sounds/bike-jump.mp3');
        audioRefs.current.hittingBarrel = new Audio('/lovable-uploads/sounds/hitting-barell.mp3');
        audioRefs.current.collectingBattery = new Audio('/lovable-uploads/sounds/collecting-battery.mp3');

        // Configure background music
        if (audioRefs.current.backgroundMusic) {
            audioRefs.current.backgroundMusic.loop = true;
            audioRefs.current.backgroundMusic.volume = 0.3;
        }

        // Configure sound effects
        Object.values(audioRefs.current).forEach(audio => {
            if (audio && audio !== audioRefs.current.backgroundMusic) {
                audio.volume = 0.7;
            }
        });
    }, []);

    // Handle mute state
    useEffect(() => {
        localStorage.setItem('gameAudioMuted', JSON.stringify(isMuted));
        
        Object.values(audioRefs.current).forEach(audio => {
            if (audio) {
                audio.muted = isMuted;
            }
        });
    }, [isMuted]);

    const playSound = useCallback((soundName: keyof typeof audioRefs.current) => {
        if (isMuted) return;

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
        if (!isMuted && audioRefs.current.backgroundMusic) {
            audioRefs.current.backgroundMusic.play().catch(() => {
                // Ignore autoplay policy errors
            });
        }
    }, [isMuted]);

    const stopBackgroundMusic = useCallback(() => {
        if (audioRefs.current.backgroundMusic) {
            audioRefs.current.backgroundMusic.pause();
            audioRefs.current.backgroundMusic.currentTime = 0;
        }
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);

    return {
        playSound,
        startBackgroundMusic,
        stopBackgroundMusic,
        toggleMute,
        isMuted,
    };
};
