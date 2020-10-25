import { useEffect } from 'react';

export const useKeyListener = (key: string, callback: () => void) => {

    useEffect(() => {
        const l = (e: KeyboardEvent) => {
            if (e.key === key) callback();
        };
        window.addEventListener('keyup', l);
        return () => window.removeEventListener('keyup', l);
    }, [key, callback]);

};

export default useKeyListener;