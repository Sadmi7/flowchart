import React, { useCallback, useState } from "react";
import { Handle, Position } from "react-flow-renderer";

function TextUpdaterNode({ data }) {
    const { label, value, onChange } = data;

    return (
        <div className="text-updater-node">
            <div>
                <label>{label}</label>
                <input
                    id="text"
                    value={value}
                    name="text"
                    type="number"
                    onChange={onChange}
                />
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
        </div>
    );
}

export default TextUpdaterNode;
