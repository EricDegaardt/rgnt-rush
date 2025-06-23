
import { useEffect, useRef } from 'react';

export const usePlayerInput = (handleJump: () => void, gameOver: boolean) => {
    const jumpKeyPressedRef = useRef(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !gameOver && !jumpKeyPressedRef.current) {
                e.preventDefault(); // Prevent page scroll
                console.log('Space key pressed, attempting jump'); // Debug log
                handleJump();
                jumpKeyPressedRef.current = true;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                jumpKeyPressedRef.current = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleJump, gameOver]);
};
