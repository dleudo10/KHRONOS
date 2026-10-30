import { useMemo, useRef, useState } from "react";
import Badge, { type Tone } from "../../../../components/ui/Badge";
import Icon from "../../../../components/ui/Icon";
import { nodeIcon, type GraphTransition, type WorkflowNode } from "../../types/workflow.types";
import { uniqueCode } from "../../utils/uniqueCode";
import { INTERVENTOR_OPTIONS } from "../../types/const";
import { cfgStr } from "../../utils/cfgStr";
import { activationOf } from "../../utils/activationOf";
import { typeLabelFor } from "../../utils/typeLabelFor";

type DraggingType = {
    id: number;
    clientX: number;
    clientY: number;
    x: number;
    y: number;
};

const NODE_W = 220;
const NODE_PORT_Y = 55;

type GraphCanvasProps = {
    readOnly: boolean;
    snapshot: () => void;
    nodes: WorkflowNode[]; 
    setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>;    
    setDirty: React.Dispatch<React.SetStateAction<boolean>>;
    dirty: boolean,
    guardReadOnly: () => boolean;
    notify: (message: string, tone?: Tone) => void;
    tempId: React.RefObject<number>;
    incomingOf: (id: number) => GraphTransition[];
    commitGraph: (nextNodes: WorkflowNode[], nextTransitions: GraphTransition[]) => void;
    transitions: GraphTransition[];
    setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
    selectedId: number | null;
    simulation: number | null;
    levels: Map<number, number>;
    setDependencyCandidate: React.Dispatch<React.SetStateAction<number | null>>;
    removeNode: (id: number) => void;
}

const GraphCanvas = ({
    readOnly, 
    snapshot, 
    nodes, 
    setNodes, 
    setDirty, 
    dirty,
    guardReadOnly, 
    notify, 
    tempId,
    incomingOf,
    commitGraph,
    transitions,
    setSelectedId,
    selectedId,
    simulation,
    levels,
    setDependencyCandidate,
    removeNode
}: GraphCanvasProps) => {
    const [zoom, setZoom] = useState(75);
    const [dragging, setDragging] = useState<DraggingType | null>(null);

    const dragMoved = useRef(false);
    const relationCount = transitions.length;
    
    /* ── Drag & drop ── */
    const onMove = (event: React.MouseEvent<HTMLElement>) => {
        if (!dragging || readOnly) return;
        if (!dragMoved.current) {
            dragMoved.current = true;
            snapshot();
        }
        const dx = (event.clientX - dragging.clientX) / (zoom / 100);
        const dy = (event.clientY - dragging.clientY) / (zoom / 100);
        setNodes((cur) =>
            cur.map((n) =>
                n.id === dragging.id
                    ? {
                          ...n,
                          position_x: Math.max(10, Math.round(dragging.x + dx)),
                          position_y: Math.max(10, Math.round(dragging.y + dy)),
                      }
                    : n,
            ),
        );
        setDirty(true);
    };

    const endDrag = () => {
        dragMoved.current = false;
        setDragging(null);
    };

    const stageSize = useMemo(() => {
        const maxX = Math.max(1900, ...nodes.map((n) => n.position_x + NODE_W + 120));
        const maxY = Math.max(760, ...nodes.map((n) => n.position_y + 260));
        return { w: maxX, h: maxY };
    }, [nodes]);

    const duplicateNode = (node: WorkflowNode) => {
        if (guardReadOnly()) return;
        if (node.node_type === "start" || node.node_type === "end") {
            return notify("Este nodo no se puede duplicar", "warning");
        }
        const id = tempId.current--;
        const name = `${node.name} copia`;
        const copy: WorkflowNode = {
            ...node,
            id,
            name,
            code: uniqueCode(name, nodes),
            position_x: node.position_x + 35,
            position_y: node.position_y + 130,
            configuration: { ...node.configuration },
            created_at: new Date().toISOString(),
        };
        const copies = incomingOf(node.id).map((t) => ({
            id: tempId.current--,
            source_node: t.source_node,
            target_node: id,
            condition_type: t.condition_type,
            condition_config: { ...t.condition_config },
        }));
        commitGraph([...nodes, copy], [...transitions, ...copies]);
        setSelectedId(id);
        notify("Nodo duplicado", "success");
    };

    const executionState = (node: WorkflowNode) => {
        if (simulation === null) return "idle";
        const lv = levels.get(node.id) ?? 0;
        return lv < simulation ? "complete" : lv === simulation ? "running" : "waiting";
    };

    const interventorName = (id: number | null) =>
        id === null ? "Sin interventor" : (INTERVENTOR_OPTIONS.find((i) => i.id === id)?.name ?? `Interventor #${id}`);

    return (
        <main
            className="canvas graph-canvas"
            onMouseMove={onMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
        >
            <div className="canvas-grid" />
            <div className="zoom-tools">
                <button onClick={() => setZoom((z) => Math.max(45, z - 10))}>−</button>
                <span>{zoom}%</span>
                <button onClick={() => setZoom((z) => Math.min(120, z + 10))}>+</button>
                <button title="Ajustar vista" onClick={() => setZoom(75)}>
                    <Icon name="eye" size={15} />
                </button>
            </div>
            <div className="canvas-meta">
                <Badge tone={readOnly ? "success" : dirty ? "warning" : "info"}>
                    {readOnly ? "Solo lectura" : dirty ? "Cambios sin guardar" : "Borrador guardado"}
                </Badge>
                <span>{nodes.length} nodos · {relationCount} relaciones</span>
            </div>

            <div
                className="graph-stage"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
            >
                {/* LÍNEAS */}
                <svg
                    className="graph-edges"
                    width={stageSize.w}
                    height={stageSize.h}
                    viewBox={`0 0 ${stageSize.w} ${stageSize.h}`}
                >
                    <defs>
                        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                            <path d="M0,0 L8,3 L0,6 Z" />
                        </marker>
                    </defs>
                    {transitions.map((t) => {
                        const src = nodes.find((n) => n.id === t.source_node);
                        const tgt = nodes.find((n) => n.id === t.target_node);
                        if (!src || !tgt) return null;
                        const x1 = src.position_x + NODE_W;
                        const y1 = src.position_y + NODE_PORT_Y;
                        const x2 = tgt.position_x;
                        const y2 = tgt.position_y + NODE_PORT_Y;
                        const curve = Math.max(50, Math.abs(x2 - x1) / 2);
                        const label =
                            src.node_type === ""
                                ? `SI ${cfgStr(src, "value", "…")}`
                                : incomingOf(tgt.id).length > 1
                                  ? activationOf(tgt) === "all" ? "TODAS" : "CUALQUIERA"
                                  : "";

                        return (
                            <g key={t.id}>
                                <path
                                    className={`edge edge-${executionState(tgt)}`}
                                    d={`M${x1},${y1} C${x1 + curve},${y1} ${x2 - curve},${y2} ${x2},${y2}`}
                                    markerEnd="url(#arrowhead)"
                                />
                                {label && (
                                    <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 7}>{label}</text>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* NODOS */}
                {nodes.map((node) => {
                    const deps = incomingOf(node.id).length;
                    return (
                        <div
                            key={node.id}
                            className={`graph-node workflow-node node-${node.node_type} ${selectedId === node.id ? "node-selected" : ""} simulation-${executionState(node)}`}
                            style={{ left: node.position_x, top: node.position_y }}
                            onMouseDown={(e) => {
                                if ((e.target as HTMLElement).closest("button")) return;
                                setSelectedId(node.id);
                                setDependencyCandidate(null);
                                if (readOnly) return;
                                dragMoved.current = false;
                                setDragging({
                                    id: node.id,
                                    clientX: e.clientX,
                                    clientY: e.clientY,
                                    x: node.position_x,
                                    y: node.position_y,
                                });
                            }}
                        >
                            <span className="node-icon">
                                <Icon name={nodeIcon(node.node_type)} size={16} />
                            </span>
                            <div>
                                <span className="node-type">{typeLabelFor(node.node_type)}</span>
                                <strong>{node.name}</strong>
                                <small>{node.description || "Sin descripción"}</small>
                                {node.node_type === "task" && (
                                    <p>
                                        <Icon name="clock" size={12} /> {interventorName(node.interventor_id)} ·{" "}
                                        {node.sla_minutes ?? "—"} min
                                    </p>
                                )}
                                <div className="dependency-count">
                                    <Icon name="flow" size={11} />
                                    {deps} dependencia{deps === 1 ? "" : "s"}
                                </div>
                            </div>
                            {!readOnly && (
                                <div className="node-actions">
                                    <button
                                        title="Duplicar"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            duplicateNode(node);
                                        }}
                                    >
                                        <Icon name="layers" size={12} />
                                    </button>
                                    <button
                                        title="Eliminar"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeNode(node.id);
                                        }}
                                    >
                                        <Icon name="close" size={12} />
                                    </button>
                                </div>
                            )}
                            <span className="port port-in" />
                            <span className="port port-out" />
                        </div>
                    );
                })}
            </div>
        </main>
    )
}

export default GraphCanvas