import { KonvaEventObject } from 'konva/types/Node';
import React, { useEffect, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import './App.css';
import { fromCenter } from './helperFunctions';
import { Circle } from './shapes/Circle';
import { Polygon } from './shapes/Polygon';
import { Rectangle } from './shapes/Rectangle';
import { Toolbox } from './Toolbox';


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
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [image, setImage] = useState<string | null>(localStorage.getItem('image'));

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

  useEffect(() => {
    setHeight(ref?.current?.clientHeight ?? 0);
    setWidth(ref?.current?.clientWidth ?? 0);
  }, [ref]);

  useEffect(() => {
    if(image) localStorage.setItem('image', image);
    else localStorage.removeItem('image');
  }, [image])

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

 
  return (<div className="main-container" ref={ref}>
    <Toolbox onImageChange={setImage} />
    {image && <img src={image} />}
    <Stage width={width} height={height}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      onDblClick={addComponent}
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
  </div>
  );
}

export default App;
