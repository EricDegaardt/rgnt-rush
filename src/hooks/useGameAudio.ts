import { useEffect, useRef, useCallback, useState } from 'react';

export const useGameAudio = () => {
    const [volume, setVolume] = useState(0.7);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [isAudioInitialized, setIsAudioInitialized] = useState(false);
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
            // Create audio elements
            audioRefs.current.backgroundMusic = new Audio('/lovable-uploads/sounds/background-music.mp3');
            audioRefs.current.bikeJump = new Audio('/lovable-uploads/sounds/bike-jump.mp3');
            audioRefs.current.hittingBarrel = new Audio('/lovable-uploads/sounds/hitting-barell.mp3');
            audioRefs.current.collectingBattery = new Audio('/lovable-uploads/sounds/collecting-battery.mp3');
            audioRefs.current.gameOver = new Audio('/lovable-uploads/sounds/game-over.mp3');

            // Configure background music
            if (audioRefs.current.backgroundMusic) {
                audioRefs.current.backgroundMusic.loop = true;
                audioRefs.current.backgroundMusic.volume = 0.3 * volume;
                audioRefs.current.backgroundMusic.preload = 'auto';
                // Add mobile-specific attributes
                audioRefs.current.backgroundMusic.setAttribute('playsinline', 'true');
                audioRefs.current.backgroundMusic.setAttribute('webkit-playsinline', 'true');
            }

            // Configure sound effects with mobile-specific attributes
            Object.values(audioRefs.current).forEach(audio => {
                if (audio && audio !== audioRefs.current.backgroundMusic) {
                    audio.volume = volume;
                    audio.preload = 'auto';
                    audio.setAttribute('playsinline', 'true');
                    audio.setAttribute('webkit-playsinline', 'true');
                }
            });

            // Try to load all audio files
            const loadPromises = Object.values(audioRefs.current).map(audio => {
                if (audio) {
                    return new Promise<void>((resolve) => {
                        const onCanPlay = () => {
                            audio.removeEventListener('canplaythrough', onCanPlay);
                            audio.removeEventListener('error', onError);
                            resolve();
                        };
                        const onError = () => {
                            audio.removeEventListener('canplaythrough', onCanPlay);
                            audio.removeEventListener('error', onError);
                            console.warn('Failed to load audio:', audio.src);
                            resolve(); // Continue even if one fails
                        };
                        
                        audio.addEventListener('canplaythrough', onCanPlay);
                        audio.addEventListener('error', onError);
                        
                        // Force load
                        audio.load();
                    });
                }
                return Promise.resolve();
            });

            await Promise.all(loadPromises);

            isInitializedRef.current = true;
            setIsAudioEnabled(true);
            setIsAudioInitialized(true);
            
            console.log('Audio initialized successfully');
        } catch (error) {
            console.warn('Failed to initialize audio:', error);
            setIsAudioEnabled(false);
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
        if (!isInitializedRef.current || !isAudioEnabled) {
            console.log('Audio not initialized or enabled');
            return;
        }

        const audio = audioRefs.current[soundName];
        if (!audio) {
            console.log('Audio element not found:', soundName);
            return;
        }

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
                playPromise
                    .then(() => {
                        console.log(`Successfully played ${soundName}`);
                    })
                    .catch((error) => {
                        console.warn(`Failed to play ${soundName}:`, error);
                        // On mobile, try to re-initialize audio on first play failure
                        if (!isAudioInitialized && error.name === 'NotAllowedError') {
                            console.log('Attempting to re-initialize audio after user interaction');
                            initializeAudio();
                        }
                    });
            }
        } catch (error) {
            console.warn(`Failed to play ${soundName}:`, error);
        }
    }, [isAudioEnabled, isAudioInitialized, initializeAudio]);

    const startBackgroundMusic = useCallback(async () => {
        console.log('Starting background music...');
        
        // Initialize audio on first call (user interaction)
        if (!isInitializedRef.current) {
            console.log('Initializing audio first...');
            await initializeAudio();
        }

        if (audioRefs.current.backgroundMusic && isInitializedRef.current && isAudioEnabled) {
            try {
                // Reset to beginning
                audioRefs.current.backgroundMusic.currentTime = 0;
                const playPromise = audioRefs.current.backgroundMusic.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Background music started successfully');
                        })
                        .catch((error) => {
                            console.warn('Failed to start background music:', error);
                        });
                }
            } catch (error) {
                console.warn('Failed to start background music:', error);
            }
        } else {
            console.log('Background music not ready:', {
                hasAudio: !!audioRefs.current.backgroundMusic,
                isInitialized: isInitializedRef.current,
                isEnabled: isAudioEnabled
            });
        }
    }, [initializeAudio, isAudioEnabled]);

    const stopBackgroundMusic = useCallback(() => {
        if (audioRefs.current.backgroundMusic) {
            audioRefs.current.backgroundMusic.pause();
            audioRefs.current.backgroundMusic.currentTime = 0;
            console.log('Background music stopped');
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
        isAudioInitialized,
        initializeAudio,
    };
};