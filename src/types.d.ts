type Vector = {
    x: number,
    y: number
}

type ToolboxSettings = {
    x: number,
    y: number
}

namespace MBE {
    type EventListener = (...params: any[]) => void;
    type DisposeListener = () => void;
    type Image = {
        name: string;
        src: string;
        width: number;
        height: number;
    }




    type DragType = 'start' | 'end' | 'move';

    type ShapeType = 'line' | 'rectangle' | 'polygon' | 'circle';
    interface Shape {
        type: ShapeType;
        id: string;
        x: number;
        y: number;
    }

    interface ShapeComponent<T extends Shape> {
        data: T,
        props: ShapeComponentProps<T>
    }
    interface ShapeComponentProps<T extends Shape> {
        // onSelect: (id: string) => void,
        onChange: ShapeOnChange<T>,
        isSelected: boolean,
        data: T
    }
    type ShapeOnChange<T extends Shape> = (data: T) => void;

    interface Rectangle extends Shape {
        width: number;
        height: number;
    }

    interface Circle extends Shape {
        rX: number,
        rY: number,
        angle: number
    }

    interface Polygon extends Shape {
        vertices: Vector[]
    }

    interface RectangleProps extends ShapeComponentProps<Rectangle> { }
    interface PolygonProps extends ShapeComponentProps<Polygon> { }
    interface CircleProps extends ShapeComponentProps<Circle> { }
}