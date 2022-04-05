import React from "react";

export default () => {
    const onDragStart = (event, nodeType, label, func) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.setData("application/reactflow/label", label);
        event.dataTransfer.setData("application/reactflow/func", func);

        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <aside>
            <div
                className="dndnode"
                onDragStart={(event) => onDragStart(event, "default", "A + B", "+")}
                draggable
            >
                A + B
            </div>
            <div
                className="dndnode"
                onDragStart={(event) => onDragStart(event, "default", "A - B", "-")}
                draggable
            >
                A - B
            </div>
            <div
                className="dndnode"
                onDragStart={(event) => onDragStart(event, "default", "A * B", "*")}
                draggable
            >
                A * B
            </div>
            <div
                className="dndnode"
                onDragStart={(event) => onDragStart(event, "default", "A / B", "/")}
                draggable
            >
                A / B
            </div>
            <div
                className="dndnode output"
                onDragStart={(event) => onDragStart(event, "output", "Result")}
                draggable
            >
                Result
            </div>
        </aside>
    );
};
