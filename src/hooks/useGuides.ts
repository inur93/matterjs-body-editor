
import { Layer as KonvaLayer } from 'konva/types/Layer';
import { KonvaEventObject } from 'konva/types/Node';
import { Shape as KonvaShape, ShapeConfig } from 'konva/types/Shape';
import { Stage as KonvaStage } from 'konva/types/Stage';
import { useCallback, useState } from 'react';

const GUIDELINE_OFFSET = 5;

export const useGuides = (): UseGuideType => {
    const [guides, setGuides] = useState<GuideType[]>([]);
    const [layer, setLayer] = useState<KonvaLayer>();
    const onDrag = useCallback((e: KonvaEventObject<DragEvent>) => {
        const stage = e.target.getStage();
        if (!layer || !stage) return;

        // find possible snapping lines
        var lineGuideStops = getLineGuideStops(e.target, stage);
        // find snapping points of current object
        var itemBounds = getObjectSnappingEdges(e.target);

        // now find where can we snap current object
        var guides = getGuides(lineGuideStops, itemBounds);

        // do nothing of no snapping
        if (!guides.length) {
            return;
        }

        // drawGuides(guides);
        setGuides(guides);

        var absPos = e.target.absolutePosition();

        // now force object position - do the snap
        guides.forEach((lg) => {
            switch (lg.snap) {
                case 'start': {
                    switch (lg.orientation) {
                        case 'V': {
                            absPos.x = lg.lineGuide + lg.offset;
                            break;
                        }
                        case 'H': {
                            absPos.y = lg.lineGuide + lg.offset;
                            break;
                        }
                    }
                    break;
                }
                case 'center': {
                    switch (lg.orientation) {
                        case 'V': {
                            absPos.x = lg.lineGuide + lg.offset;
                            break;
                        }
                        case 'H': {
                            absPos.y = lg.lineGuide + lg.offset;
                            break;
                        }
                    }
                    break;
                }
                case 'end': {
                    switch (lg.orientation) {
                        case 'V': {
                            absPos.x = lg.lineGuide + lg.offset;
                            break;
                        }
                        case 'H': {
                            absPos.y = lg.lineGuide + lg.offset;
                            break;
                        }
                    }
                    break;
                }
            }
        });

        e.target.absolutePosition(absPos);
    }, [layer, setGuides]);

    const onDragEnd = () => {
        setGuides([]);
    }
    return [guides, onDrag, onDragEnd, setLayer]
}


// what points of the object will trigger to snapping?
// it can be just center of the object
// but we will enable all edges and center
function getObjectSnappingEdges(node: KonvaShape<ShapeConfig> | KonvaStage): ObjectSnappingEdgesType {
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
                guide: Math.round(box.x + box.width / 2),
                offset: Math.round(absPos.x - box.x - box.width / 2),
                snap: 'center',
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
                guide: Math.round(box.y + box.height / 2),
                offset: Math.round(absPos.y - box.y - box.height / 2),
                snap: 'center',
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
function getLineGuideStops(skipShape: KonvaShape<ShapeConfig> | KonvaStage, stage: KonvaStage) {

    // we can snap to stage borders and the center of the stage
    const vertical = [[0, stage.width() / 2, stage.width()]];
    const horizontal = [[0, stage.height() / 2, stage.height()]];

    // and we snap over edges and center of each object on the canvas
    stage.children.each(layer => {
        layer.children.each((guideItem) => {
            //skip selected shape and other guide shapes
            if (guideItem === skipShape || guideItem.name() === 'guide') {
                return;
            }
            var box = guideItem.getClientRect();
            // console.log('data', {box});
            // and we can snap to all edges of shapes
            vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
            horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
        })
    })

    return {
        vertical: new Set(vertical.flat()),
        horizontal: new Set(horizontal.flat()),
    };
}


function getGuides(lineGuideStops: LineStopsType, itemBounds: ObjectSnappingEdgesType): GuideType[] {
    var resultV: GuideStopType[] = [];
    var resultH: GuideStopType[] = [];

    lineGuideStops.vertical.forEach((lineGuide) => {
        itemBounds.vertical.forEach((itemBound) => {
            var diff = Math.abs(lineGuide - itemBound.guide);
            // if the distance between guide line and object snap point is close we can consider this for snapping
            if (diff < GUIDELINE_OFFSET) {
                resultV.push({
                    lineGuide: lineGuide,
                    diff: diff,
                    snap: itemBound.snap,
                    offset: itemBound.offset,
                });
            }
        });
    });

    lineGuideStops.horizontal.forEach((lineGuide) => {
        itemBounds.horizontal.forEach((itemBound) => {
            var diff = Math.abs(lineGuide - itemBound.guide);
            if (diff < GUIDELINE_OFFSET) {
                resultH.push({
                    lineGuide: lineGuide,
                    diff: diff,
                    snap: itemBound.snap,
                    offset: itemBound.offset,
                });
            }
        });
    });

    var guides: GuideType[] = [];

    // find closest snap
    var minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    var minH = resultH.sort((a, b) => a.diff - b.diff)[0];
    if (minV) {
        console.log('minv', minV.lineGuide);
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


type UseGuideType = [
    GuideType[],
    (e: KonvaEventObject<DragEvent>) => void,
    (e: KonvaEventObject<DragEvent>) => void,
    (layer: KonvaLayer) => void
]

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