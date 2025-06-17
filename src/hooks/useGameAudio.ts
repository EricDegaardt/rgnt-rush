
import { useEffect, useRef, useState } from 'react';

export const useGameAudio = () => {
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem('gameAudioMuted');
        return saved ? JSON.parse(saved) : false;
    });

    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Save mute preference to localStorage
        localStorage.setItem('gameAudioMuted', JSON.stringify(isMuted));
    }, [isMuted]);

    const getAudioContext = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioContextRef.current;
    };

    const playTone = (frequency: number, duration: number, type: OscillatorType = 'square') => {
        if (isMuted) return;

        const audioContext = getAudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    };

    const playJumpSound = () => {
        if (isMuted) return;
        
        // Quick ascending tone for jump
        playTone(220, 0.1);
        setTimeout(() => playTone(330, 0.1), 50);
    };

    const playCollectSound = () => {
        if (isMuted) return;
        
        // Cheerful ascending sequence for collecting battery
        playTone(523, 0.1); // C5
        setTimeout(() => playTone(659, 0.1), 80); // E5
        setTimeout(() => playTone(784, 0.15), 160); // G5
    };

    const playHitSound = () => {
        if (isMuted) return;
        
        // Descending crash sound for hitting obstacle
        playTone(150, 0.2, 'sawtooth');
        setTimeout(() => playTone(100, 0.3, 'sawtooth'), 100);
    };

    const playGameOverSound = () => {
        if (isMuted) return;
        
        // Sad descending sequence
        playTone(330, 0.3);
        setTimeout(() => playTone(294, 0.3), 200);
        setTimeout(() => playTone(220, 0.5), 400);
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    return {
        isMuted,
        toggleMute,
        playJumpSound,
        playCollectSound,
        playHitSound,
        playGameOverSound
    };
};
