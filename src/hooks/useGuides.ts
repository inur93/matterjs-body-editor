
import { KonvaEventObject } from 'konva/types/Node';
import { Shape as KonvaShape, ShapeConfig } from 'konva/types/Shape';
import { Stage as KonvaStage } from 'konva/types/Stage';
import { useCallback, useState } from 'react';

const GUIDELINE_OFFSET = 5;

export const useGuides = (skipSnap: boolean = false): UseGuideType => {
    const [guides, setGuides] = useState<MBE.GuideType[]>([]);
    // const [layer, setLayer] = useState<KonvaLayer>();
    const onDrag = useCallback((e: KonvaEventObject<DragEvent>) => {
        const stage = e.target.getStage();
        if (!stage) return;

        // find possible snapping lines
        var lineGuideStops = getLineGuideStops(e.target, stage);
        // find snapping points of current object
        var itemBounds = getObjectSnappingEdges(e.target);

        // now find where can we snap current object
        var guides = getGuides(lineGuideStops, itemBounds);

        // do nothing if no snapping
        if (!guides.length) {
            return;
        }

        console.clear();
        console.table(guides);

        setGuides(guides);

        var absPos = e.target.absolutePosition();

        if (skipSnap) return;
        // now force object position - do the snap
        guides.forEach((lg) => {

            switch (lg.orientation) {
                case 'V': {
                    absPos.x = lg.lineGuide + lg.offset;
                    break;
                }
                case 'H': {
                    absPos.y = lg.lineGuide + lg.offset;
                    break;
                }
                default: break;
            }
        });

        e.target.absolutePosition(absPos);
    }, [setGuides, skipSnap]);

    const onDragEnd = () => {
        setGuides([]);
    }
    return [guides, onDrag, onDragEnd]
}


// what points of the object will trigger to snapping?
// it can be just center of the object
// but we will enable all edges and center
function getObjectSnappingEdges(node: KonvaShape<ShapeConfig> | KonvaStage): MBE.ObjectSnappingEdgesType {
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
            vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
            horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
        })
    })

    return {
        vertical: new Set(vertical.flat()),
        horizontal: new Set(horizontal.flat()),
    };
}


function getGuides(lineGuideStops: MBE.LineStopsType, itemBounds: MBE.ObjectSnappingEdgesType): MBE.GuideType[] {
    var resultV: MBE.GuideStopType[] = [];
    var resultH: MBE.GuideStopType[] = [];

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

    var guides: MBE.GuideType[] = [];

    // find closest snap
    var minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    var minH = resultH.sort((a, b) => a.diff - b.diff)[0];
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



type UseGuideType = [
    MBE.GuideType[],
    (e: KonvaEventObject<DragEvent>) => void,
    (e: KonvaEventObject<DragEvent>) => void
]