import { Vector2d } from "konva/types/types";
import { useCallback, useEffect, useRef, useState } from 'react';

export const useDrag = <M extends HTMLElement, A extends HTMLElement>(position: Vector2d, callback?: (position: Vector2d) => void): UseDragType<M, A> => {
    const [movingElement, setMovingElement] = useState<M>();
    const [anchor, setAnchor] = useState<A>();
    const [x, setX] = useState(position.x);
    const [y, setY] = useState(position.y);
    const relX = useRef(0);
    const relY = useRef(0);
    const [isMoving, setMoving] = useState(false);

    const _update = throttle(() => {
        if (movingElement) {
            movingElement.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

    useEffect(() => {
        _update();
    }, [x, y, _update])

    const _mouseMove = useCallback((event: MouseEvent) => {
        setX(event.pageX - relX.current);
        setY(event.pageY - relY.current);
        event.preventDefault();
    }, [setX, setY]);

    const _mouseUp = useCallback((event: MouseEvent) => {
        document.removeEventListener('mousemove', _mouseMove);
        document.removeEventListener('mouseup', _mouseUp);
        setMoving(false);
        if (callback) callback({ x, y });
        event.preventDefault();
    }, [_mouseMove, setMoving, x, y, callback]);

    const _mouseDown = useCallback((event: MouseEvent) => {

        if (event.button !== 0 || !anchor) return;

        const { scrollLeft, scrollTop, clientLeft, clientTop } = document.body;
        // Try to avoid calling `getBoundingClientRect` if you know the size
        // of the moving element from the beginning. It forces reflow and is
        // the laggiest part of the code right now. Luckily it's called only
        // once per click.
        const { left, top } = anchor.getBoundingClientRect() || { left: 0, top: 0 };
        relX.current = event.pageX - (left + scrollLeft - clientLeft);
        relY.current = event.pageY - (top + scrollTop - clientTop);
        document.addEventListener('mousemove', _mouseMove);
        document.addEventListener('mouseup', _mouseUp);

        setMoving(true);
        event.preventDefault();
    }, [relX, relY, anchor, setMoving, _mouseUp, _mouseMove]);
    useEffect(() => {
        if (!anchor) return;
        anchor.addEventListener("mousedown", _mouseDown);
        _update();
        return () => { _update.cancel() };
    }, [_update, _mouseDown, anchor]);

    return [
        {
            isMoving,
            setMoving
        },
        setAnchor,
        setMovingElement
    ]
}


const throttle = (f: (...args: any[]) => void) => {
    let token: number | null = null;
    let lastArgs: any = null;
    const invoke = () => {
        f(...lastArgs);
        token = null;
    };
    const result = (...args: any) => {
        lastArgs = args;
        if (!token) {
            token = requestAnimationFrame(invoke);
        }
    };
    result.cancel = () => token && cancelAnimationFrame(token);
    return result;
};

type UseDragType<M extends HTMLElement, A extends HTMLElement> = [
    {
        isMoving: boolean,
        setMoving: (moving: boolean) => void
    },
    (anchor: A | undefined) => void,
    (element: M | undefined) => void
]