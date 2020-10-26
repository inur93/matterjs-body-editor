import Konva from "konva";
import { KonvaEventObject } from 'konva/types/Node';
import React, { Component, useEffect, useRef } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";


const Rect1 = () => (
    <Rect
        name="rectange1"
        strokeScaleEnabled={false}
        x={20}
        y={20}
        width={50}
        height={50}
        fill="red"
        draggable
    />
);

const Rect2 = () => (
    <Rect
        name="rectange2"
        x={60}
        y={120}
        width={50}
        height={50}
        stroke="green"
        strokeWidth={2}
        draggable
    />
);

export const TransformerComponent = (props: { selectedShapeName: string }) => {
    const ref = useRef<Konva.Transformer>() as React.MutableRefObject<Konva.Transformer>;
    const checkNode = () => {
        const transformer = ref.current;
        const stage = ref.current.getStage();
        const { selectedShapeName } = props;

        if (!stage || !transformer) return;

        const selectedNode = stage.findOne("." + selectedShapeName);
        if (selectedNode === transformer.getNode()) {
            return;
        }
        if (selectedNode) {
            transformer.attachTo(selectedNode);
        } else {
            transformer.detach();
        }
        transformer.getLayer()?.batchDraw();
    }

    useEffect(() => {
        checkNode();
    }, [checkNode, props.selectedShapeName])

    return (
        <Transformer
            ignoreStroke
            ref={ref}
        />
    );

}

export class TestApp extends Component {
    state = {
        selectedShapeName: ""
    };
    handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
        this.setState({
            selectedShapeName: e.target.name()
        });
    };
    render() {
        return (
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
            >
                <Layer onClick={this.handleStageClick}>
                    <Rect1 />
                    <Rect2 />
                    <TransformerComponent
                        selectedShapeName={this.state.selectedShapeName}
                    />
                </Layer>
            </Stage>
        );
    }
}

