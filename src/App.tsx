import { KonvaEventObject } from 'konva/types/Node';
import React, { useState } from 'react';
import { Layer, Stage } from 'react-konva';
import './App.css';
import { fromCenter } from './helperFunctions';
import { Circle } from './shapes/Circle';
import { Polygon } from './shapes/Polygon';
import { Rectangle } from './shapes/Rectangle';


const Component = ({ type, data, props }: ComponentType<RectangleType | PolygonType | CircleType>) => {

  switch (type) {
    case "line":
    case "rectangle":
      return <Rectangle {...props} data={data as RectangleType} />;
    case "polygon":
      return <Polygon {...props} data={data as PolygonType} />;
    case "circle":
      return <Circle {...props} data={data as CircleType} />;
  }
}

function App() {
  const [shapes, setShapes] = useState<AnyShapeType[]>([{
    type: 'polygon',
    id: 'test',
    data: {
      id: 'test',
      x: 0,
      y: 0,
      vertices: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 70 },
      ]
    }
  },
  {
    type: 'rectangle',
    id: 'test1',
    data: {
      id: 'test1',
      x: 0,
      y: 0,
      width: 100,
      height: 100
    }
  },
  {
    type: 'circle',
    id: 'circle1',
    data: {
      id: 'circle1',
      x: 10,
      y: 10,
      r: 50
    }
  }]);
  const [selectedId, setSelected] = useState<string | null>(null);

  const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelected(null);
    }
  };

  const addComponent = (e: KonvaEventObject<MouseEvent>) => {
    const width = 200, height = 200;
    const [x, y] = fromCenter(e.evt.x, e.evt.y, width, height);
    setShapes((prev) => [...prev, {
      type: 'rectangle',
      id: `${new Date().getTime()}`,
      data: {
        id: `${new Date().getTime()}`,
        x,
        y,
        width,
        height
      }
    }])
  }
  return (

    <Stage width={window.innerWidth} height={window.innerHeight}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    // onDblClick={addComponent}
    >
      <Layer>
        {shapes.map((x, i) => <Component key={x.data.id}
          {...x}
          props={{
            isSelected: x.data.id === selectedId,
            onSelect: () => setSelected(x.data.id),
            onChange: (data => {
              const sliced = shapes.slice();
              sliced[i].data = data;
              setShapes(sliced);
            })
          }
          }
        />)}
      </Layer>
    </Stage>
  );
}

export default App;
