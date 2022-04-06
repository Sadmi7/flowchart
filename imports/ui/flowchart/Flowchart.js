import React, { useCallback, useState, useRef, useEffect } from "react";
import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
} from "react-flow-renderer";

import TextUpdaterNode from "../textUpdaterNode/TextUpdaterNode";

import Sidebar from "./Sidebar";

import "../textUpdaterNode/text-updater-node.css";
import "./flowchart.scss";

let id = 0;

const getId = () => `dndnode_${id++}`;

const initialEdges = [
    { id: "edge-1", source: "node-1", target: "node-2", sourceHandle: "a" },
    { id: "edge", source: "node-1", target: "node-3", sourceHandle: "b" },
];

const nodeTypes = { textUpdater: TextUpdaterNode };

function Flow() {
    const [varA, setVarA] = useState("");
    const [varB, setVarB] = useState("");

    const onChangeVarriableA = useCallback((event) => {
        if (!event.target.value) {
            setVarA("0");
            return;
        }

        setVarA(event.target.value);
    }, []);

    const onChangeVarriableB = useCallback((event) => {
        if (!event.target.value) {
            setVarB("0");
            return;
        }

        setVarB(event.target.value);
    }, []);

    const reactFlowWrapper = useRef(null);
    const [updatedNodes, setUpdatedNodes] = useState([
        {
            id: "node-a",
            type: "textUpdater",
            position: { x: 0, y: 0 },
            data: { varValue: varA, label: "Varriable A", onChange: onChangeVarriableA },
        },
        {
            id: "node-b",
            type: "textUpdater",
            position: { x: 250, y: 0 },
            data: {
                varValue: varB,
                label: "Varriable B",
                onChange: onChangeVarriableB,
            },
        },
    ]);

    const [edges, setEdges] = useState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const onNodesChange = useCallback(
        (changes) => {
            setUpdatedNodes((nds) => applyNodeChanges(changes, nds));
        },
        [setUpdatedNodes]
    );
    const onEdgesChange = useCallback(
        (changes) => {
            setEdges((eds) => applyEdgeChanges(changes, eds));
        },
        [setEdges]
    );

    const onConnect = useCallback(
        (connection) => {
            const payload = {
                ...connection,
            };

            if (connection?.source === "node-a") {
                payload.a_val = varA;
            }

            if (connection?.source === "node-b") {
                payload.b_val = varB;
            }

            let newEdges = [...edges, payload];

            setEdges((eds) => addEdge(payload, eds));

            for (const item of newEdges) {
                const targetNode = newEdges?.filter(
                    (edge) => edge?.target === item?.target
                )[0]?.target;

                const findTarget = newEdges?.find((edge) => edge?.target === targetNode);
                const findFunc = updatedNodes?.find(
                    (node) => node?.id === item?.source && node?.data?.func
                );

                const findOutputNode = updatedNodes?.find(
                    (node) => node?.id === findTarget?.target && node?.type === "output"
                );

                let payload = {
                    ...findOutputNode,
                    function: findFunc?.data?.func,
                    varA,
                    varB,
                };

                delete payload.data;

                if (findOutputNode?.type) {
                    payload.data = {
                        label: eval(`${varA}${findFunc?.data?.func}${varB}`),
                    };
                }

                const filteredNodes = updatedNodes?.filter(
                    (item) => item.id !== payload.id
                );

                if (findOutputNode?.type) {
                    setUpdatedNodes([...filteredNodes, payload]);
                }
            }
        },
        [setEdges, setUpdatedNodes, varA, varB, edges, updatedNodes]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData("application/reactflow");
            const label = event.dataTransfer.getData("application/reactflow/label");
            const func = event.dataTransfer.getData("application/reactflow/func");

            if (!varA) {
                alert("Field A cannot be empty!");
                return;
            }

            if (!varB) {
                alert("Field B cannot be empty!");
                return;
            }

            if (typeof type === "undefined" || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${label}`, func },
            };

            setUpdatedNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, varA, varB]
    );

    useEffect(() => {
        const outputNodes = updatedNodes?.filter((item) => item.type === "output");

        if (outputNodes.length) {
            for (const item of outputNodes) {
                item.varA = varA;
                item.varB = varB;

                if (item?.data?.label !== "Result") {
                    item.data = {
                        label: eval(`${varA}${item?.function}${varB}`),
                    };
                }
            }

            const originalNodes = [
                ...updatedNodes.filter((item) => item.type !== "output"),
                ...outputNodes,
            ];

            setUpdatedNodes(originalNodes);
        }
    }, [varA, varB]);

    return (
        <div className="dndflow">
            <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={updatedNodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                />
            </div>
            <Sidebar />
        </div>
    );
}

export default Flow;
