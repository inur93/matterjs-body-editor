

type ShapeOnChange<T> = (props: T) => void;

interface ShapeType {
    id: string
}

interface ShapePropsType<T> {
    onSelect: (id: string) => void,
    onChange: ShapeOnChange<T>,
    isSelected: boolean,
    data: T
}

interface RectangleType extends ShapeType {
    x: number,
    y: number,
    width: number,
    height: number
}

interface CircleType extends ShapeType {
    x: number,
    y: number,
    r: number
}

type Vector = {
    x: number,
    y: number
}
interface PolygonType extends ShapeType {
    vertices: Vector[],
    x: number,
    y: number
}

interface RectanglePropsType extends ShapePropsType<RectangleType> {

}

interface PolygonProps extends ShapePropsType<PolygonType> {

}

interface CircleProps extends ShapePropsType<CircleType> {

}

type ComponentType<T extends ShapeType> = {
    type: ComponentShapeType,
    data: T,
    props: ShapePropsType<T>
}

type DragType = 'start' | 'end' | 'move';

type AnchorProps = {
    id: string,
    x: number,
    y: number,
    labelText: string,
    onDrag: (position: Vector) => void
    // onDrag: (type: DragType, evt: KonvaEventObject<DragEvent>) => void
}



type AnyShapeType = ComponentType;

type ComponentShapeType = 'line' | 'rectangle' | 'polygon' | 'circle';

type ToolboxSettings = {
    x: number,
    y: number
}