import { Vector2d } from "konva/types/types";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useDrag<M extends HTMLElement, A extends HTMLElement>(position: Vector2d, callback?: (position: Vector2d) => void): UseDragType<M, A> {
    const [movingElement, setMovingElement] = useState<M>();
    const [anchor, setAnchor] = useState<A>();
    const positionRef = useRef(position);
    const relX = useRef(0);
    const relY = useRef(0);
    const [isMoving, setMoving] = useState(false);

    const _update = useMemo(
        () => throttle((pos: Vector2d) => {
            if (movingElement) {
                movingElement.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            }
        }), [movingElement]);

    // useEffect(() => {
    //     _update();
    //     console.log('update');
    // }, [x, y, _update]);

    const _mouseMove = useCallback(function (event: MouseEvent) {
        // setX(event.pageX - relX.current);
        // setY(event.pageY - relY.current);
        console.log('mouse move');
        _update({ x: event.pageX - relX.current, y: event.pageY - relY.current });
        event.preventDefault();
    }, [relX, relY, _update]);

    const _mouseUp = useCallback(function (event: MouseEvent) {
        document.removeEventListener('mousemove', _mouseMove);
        document.removeEventListener('mouseup', _mouseUp);
        console.log('mouse up');
        setMoving(false);
        if (callback) callback(positionRef.current);
        event.preventDefault();
    }, [_mouseMove, callback, positionRef]);

    const _mouseDown = useCallback(function (event: MouseEvent) {

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
        console.log('mouse down');
        setMoving(true);
        event.preventDefault();
    }, [relX, relY, anchor, _mouseMove, _mouseUp]);

    useEffect(function attachMouseDownListener() {
        if (!anchor) return;
        anchor.addEventListener("mousedown", _mouseDown);
        console.log('init drag');
        _update(positionRef.current);
        return () => {
            _update.cancel();
            anchor.removeEventListener("mousedown", _mouseDown);
        };
    }, [anchor, positionRef, _mouseDown, _update]);

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