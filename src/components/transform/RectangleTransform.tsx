import Konva from 'konva';
import { KonvaEventObject, Node, NodeConfig } from 'konva/types/Node';
import { Stage as KonvaStage } from 'konva/types/Stage';
import React, { memo, useEffect, useState } from 'react';
import { Transformer } from 'react-konva';
import { useViewport } from '../../hooks/useViewport';
import Guide from './Guide';


const GUIDELINE_OFFSET = 5;

function RectangleTransform({ node }: TransformProps) {
    const trRef = React.useRef<Konva.Transformer>() as React.MutableRefObject<Konva.Transformer>;
    const [guides, setGuides] = useState<GuideType[]>([]);
    const [viewport] = useViewport();
    useEffect(() => {
        trRef.current?.nodes(node ? [node] : []);
        //shows the shape as selected right away.
        trRef.current?.getLayer()?.batchDraw();

    }, [node, trRef]);

    const handleDrag = (e: KonvaEventObject<DragEvent>) => {
        const node = e.target;
        const stage = trRef.current.getStage();
        if (!stage) return;

        const lineGuideStops = getLineGuideStops(node, stage);
        const itemBounds = getObjectSnappingEdges(trRef.current);
        var guides = getGuides(lineGuideStops, itemBounds);

        setGuides(guides);

        const absPos = node.getAbsolutePosition();
        const dims = {
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            width: node.width(),
            height: node.height()
        }


        guides.forEach((lg) => {

            switch (lg.snap) {
                case 'start': {
                    switch (lg.orientation) {
                        case 'V': {

                            const newWidth = dims.width * dims.scaleX;


                            //we need to add the diff as width, otherwise the shape might keep shrinking or growing.
                            const newX = lg.lineGuide + lg.offset;
                            const diff = absPos.x - newX;
                            const newScaleX = (newWidth + diff) / dims.width;

                            console.log('data', {
                                // x: absPos.x,
                                // newX: newX,
                                // width: dims.width*dims.scaleX,
                                // newWidth: newScaleX * dims.width,
                                dw: dims.width * dims.scaleX - newScaleX * dims.width,
                                dx: absPos.x - newX,
                                // scaleX: dims.scaleX,
                                // newScaleX: newScaleX
                            })

                            absPos.x = newX;
                            dims.scaleX = newScaleX;
                            // absPos.x = lg.lineGuide + lg.offset;
                            break;
                        }
                        case 'H': {
                            absPos.y = (lg.lineGuide + lg.offset);
                            break;
                        }
                    }
                    break;
                }
                case 'end': {
                    switch (lg.orientation) {
                        case 'V': {
                            dims.scaleX = (dims.width * dims.scaleX + lg.lineGuide + lg.offset - absPos.x) / dims.width;
                            break;
                        }
                        case 'H': {
                            dims.scaleY = (dims.height * dims.scaleY + lg.lineGuide + lg.offset - absPos.y) / dims.height;
                            break;
                        }
                    }
                    break;
                }
            }
        });

        // node.setAbsolutePosition(absPos);

        // node.scaleX(dims.scaleX);
        // node.scale({
        //     x: dims.scaleX,
        //     y: dims.scaleY
        // })
        // node.scale({ x: dims.scaleX, y: dims.scaleY });
    }

    const onTransformEnd = (e: KonvaEventObject<Event>) => {
        node?.setDraggable(true);
        setGuides([]);
    }

    const onTransformStart = (e: KonvaEventObject<Event>) => {
        node?.setDraggable(false);
    }

    return <React.Fragment>
        <Transformer
            ref={trRef}
            name="transform"
            ignoreStroke
            onTransformStart={onTransformStart}
            onTransformEnd={onTransformEnd}
            boundBoxFunc={(oldbox, newbox) => {
                if (newbox.width < 5 || newbox.height < 5) {
                    return oldbox;
                }

                newbox.x = Math.round(newbox.x);
                newbox.y = Math.round(newbox.y);
                newbox.width = Math.round(newbox.width);
                newbox.height = Math.round(newbox.height);

                return newbox;
            }}
        />
        {
            (guides || []).map((guide) => <Guide guide={guide} offset={viewport.offset} scale={viewport.scale} />)
        }
    </React.Fragment>
}

export default memo(RectangleTransform);

type TransformProps = {
    node?: Node<NodeConfig>
}


function getGuides(lineGuideStops: LineStopsType, itemBounds: ObjectSnappingEdgesType): GuideType[] {

    const reducer = (bounds: SnappingEdgeType[]) => (results: GuideStopType[], lineGuide: number) => {
        bounds.forEach((itemBound) => {
            var diff = Math.abs(lineGuide - itemBound.guide);
            if (diff < 0.001) {
                console.log('diff is 0');
            }
            // if the distance between guide line and object snap point is close we can consider this for snapping
            if (diff < GUIDELINE_OFFSET) {
                results.push({
                    lineGuide: lineGuide,
                    diff: diff,
                    snap: itemBound.snap,
                    offset: itemBound.offset,
                });
            }
        });
        return results;
    }

    const resultV = [...lineGuideStops.vertical].reduce(reducer(itemBounds.vertical), []);
    const resultH = [...lineGuideStops.horizontal].reduce(reducer(itemBounds.horizontal), []);

    let guides: GuideType[] = [];

    // find closest snap
    const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    const minH = resultH.sort((a, b) => a.diff - b.diff)[0];
    if (minV) {
        guides.push({
            lineGuide: minV.lineGuide,
            offset: minV.offset,
            orientation: 'V',
            snap: minV.snap,
        });
    }
    if (minH) {
        guides.push({
            lineGuide: minH.lineGuide,
            offset: minH.offset,
            orientation: 'H',
            snap: minH.snap,
        });
    }
    return guides;
}

// what points of the object will trigger to snapping?
// it can be just center of the object
// but we will enable all edges and center
function getObjectSnappingEdges(node: Konva.Transformer): ObjectSnappingEdgesType {
    const box = node.getClientRect();
    const absPos = node.absolutePosition();

    return {
        vertical: [
            {
                guide: Math.round(box.x),
                offset: Math.round(absPos.x - box.x),
                snap: 'start',
            },
            {
                guide: Math.round(box.x + box.width),
                offset: Math.round(absPos.x - box.x - box.width),
                snap: 'end',
            },
        ],
        horizontal: [
            {
                guide: Math.round(box.y),
                offset: Math.round(absPos.y - box.y),
                snap: 'start',
            },
            {
                guide: Math.round(box.y + box.height),
                offset: Math.round(absPos.y - box.y - box.height),
                snap: 'end',
            },
        ],
    };
}

// were can we snap our objects?
function getLineGuideStops(skipShape: Node<NodeConfig> | KonvaStage, stage: KonvaStage) {

    // we can snap to stage borders and the center of the stage
    const vertical = [[0, stage.width()]];
    const horizontal = [[0, stage.height()]];

    // and we snap over edges and center of each object on the canvas
    stage.children.each(layer => {
        layer.children.each((guideItem) => {
            //skip selected shape, guide shapes and transform shapes
            if (guideItem === skipShape
                || guideItem.name() === 'guide'
                || guideItem.name() === 'transform') {
                return;
            }
            var box = guideItem.getClientRect();
            // and we can snap to all edges of shapes
            vertical.push([box.x, box.x + box.width]);
            horizontal.push([box.y, box.y + box.height]);
        })
    })

    return {
        vertical: new Set(vertical.flat()),
        horizontal: new Set(horizontal.flat()),
    };
}

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