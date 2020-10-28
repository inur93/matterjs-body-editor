type ToolboxSettings = {
    x: number,
    y: number
}

declare namespace MBE {
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

    type LineStopsType = {
        vertical: Set<number>,
        horizontal: Set<number>
    }

    type ObjectSnappingEdgesType = {
        vertical: SnappingEdgeType[],
        horizontal: SnappingEdgeType[]
    }

    type SnappingEdgeType = {
        guide: number,
        offset: number,
        snap: string
    }

    type GuideStopType = {
        lineGuide: number,
        diff: number,
        snap: string,
        offset: number,
    }

    type GuideType = {
        lineGuide: number,
        offset: number,
        orientation: 'V' | 'H',
        snap: string,
    }
}