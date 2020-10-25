import { useEffect, useState } from "react";


export const useKeyDownListener = (key: string) => {
    const [isDown, setDown] = useState(false);

    useEffect(() => {
        const _dl = (e: KeyboardEvent) => {
            if (e.key === key) setDown(true);
        };
        const _ul = (e: KeyboardEvent) => {
            if (e.key === key) setDown(false);
        };;

        window.addEventListener('keydown', _dl);
        window.addEventListener('keyup', _ul);

        return () => {
            window.removeEventListener('keydown', _dl);
            window.removeEventListener('keyup', _ul);
        }
    }, [key]);

    return [isDown];
}