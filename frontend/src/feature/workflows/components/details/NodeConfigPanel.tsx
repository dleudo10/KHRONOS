import Badge, { type Tone } from "../../../../components/ui/Badge";
import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/ui/Icon";
import { INTERVENTOR_OPTIONS } from "../../types/const";
import { nodeIcon, type GraphTransition, type NodeType, type WorkflowNode } from "../../types/workflow.types";
import { activationOf } from "../../utils/activationOf";
import { cfgNum } from "../../utils/cfgNum";
import { cfgStr } from "../../utils/cfgStr";

type NodeConfigPanelProps = {
    selected: WorkflowNode | null 
    nodes: WorkflowNode[];
    dependencyCandidate: number | null;
    readOnly: boolean;
    setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>;  
    setDirty: React.Dispatch<React.SetStateAction<boolean>>;
    snapshot: () => void;
    transitions: GraphTransition[];
    guardReadOnly: () => boolean;
    notify: (message: string, tone?: Tone) => void;
    commitGraph: (nextNodes: WorkflowNode[], nextTransitions: GraphTransition[]) => void;
    tempId: React.RefObject<number>;
    incomingOf: (id: number) => GraphTransition[];
    setDependencyCandidate: React.Dispatch<React.SetStateAction<number | null>>;
    removeNode: (id: number) => void;
}

const NodeConfigPanel = ({
    selected, 
    nodes, 
    dependencyCandidate, 
    readOnly, 
    setNodes, 
    setDirty,
    snapshot,
    transitions,
    notify,
    guardReadOnly,
    commitGraph,
    tempId,
    incomingOf,
    setDependencyCandidate,
    removeNode,
}: NodeConfigPanelProps) => {
    const candidateOptions = selected
        ? nodes.filter((n) => n.id !== selected.id && n.node_type !== "end")
        : [];

    const candidateId =
        candidateOptions.find((n) => n.id === dependencyCandidate)?.id ??
        candidateOptions[0]?.id ??
        null
    ;

    const patchNode = (id: number, patch: Partial<WorkflowNode>) => {
        if (readOnly) return;
        setNodes((cur) => cur.map((n) => (n.id === id ? { ...n, ...patch } : n)));
        setDirty(true);
    };

    const patchConfig = (id: number, patch: Record<string, unknown>) => {
        if (readOnly) return;
        setNodes((cur) =>
            cur.map((n) =>
                n.id === id ? { ...n, configuration: { ...n.configuration, ...patch } } : n,
            ),
        );
        setDirty(true);
    };
    
    const beginEdit = () => {
        if (!readOnly) snapshot();
    };

    const reaches = (from: number, target: number) => {
        const seen = new Set<number>();
        const stack = [from];
        while (stack.length) {
            const cur = stack.pop()!;
            if (cur === target) return true;
            if (seen.has(cur)) continue;
            seen.add(cur);
            transitions.filter((t) => t.source_node === cur).forEach((t) => stack.push(t.target_node));
        }
        return false;
    };

    const addDependency = () => {
        if (guardReadOnly() || !selected || candidateId === null) return;
        if (selected.node_type === "start")
            return notify("Inicio no puede tener dependencias", "warning");
        if (candidateId === selected.id)
            return notify("Un nodo no puede depender de sí mismo", "danger");
        if (transitions.some((t) => t.source_node === candidateId && t.target_node === selected.id))
            return notify("La relación ya existe", "warning");
        if (reaches(selected.id, candidateId))
            return notify("La relación produciría un ciclo y no puede crearse", "danger");
        commitGraph(nodes, [
            ...transitions,
            {
                id: tempId.current--,
                source_node: candidateId,
                target_node: selected.id,
                condition_type: "always",
                condition_config: {},
            },
        ]);
        notify("Dependencia conectada", "success");
    };

    const removeDependency = (transitionId: number) => {
        if (guardReadOnly()) return;
        commitGraph(nodes, transitions.filter((t) => t.id !== transitionId));
        notify("Relación eliminada");
    };

    const typeLabel = selected
        ? ({
              start: "Inicio",
              task: "Tarea",
              condition: "Condición",
              split: "División paralela",
              join: "Unión",
              end: "Fin",
          } as Record<NodeType, string>)[selected.node_type]
        : ""
    ;

    return (
        <aside className="config-panel">
            {!selected ? (
                <div className="config-head">
                    <div>
                        <h3>Sin selección</h3>
                        <span>Selecciona un nodo del grafo</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="config-head">
                        <div>
                            <h3>Configuración de {typeLabel.toLowerCase()}</h3>
                            <span>
                                {selected.id > 0 ? `ID #${selected.id}` : "Nodo nuevo"} · {selected.code}
                            </span>
                        </div>
                        <Badge tone={selected.node_type === "start" || selected.node_type === "end" ? "success" : "info"}>
                            {typeLabel}
                        </Badge>
                    </div>

                    <label>
                        Nombre
                        <input
                            value={selected.name}
                            disabled={readOnly}
                            onFocus={beginEdit}
                            onChange={(e) => patchNode(selected.id, { name: e.target.value })}
                        />
                    </label>
                    <label>
                        Descripción
                        <textarea
                            value={selected.description}
                            disabled={readOnly}
                            onFocus={beginEdit}
                            onChange={(e) => patchNode(selected.id, { description: e.target.value })}
                        />
                    </label>

                    {selected.node_type === "task" && (
                        <>
                            <label>
                                Interventor
                                {INTERVENTOR_OPTIONS.length ? (
                                    <select
                                        value={selected.interventor_id ?? ""}
                                        disabled={readOnly}
                                        onFocus={beginEdit}
                                        onChange={(e) =>
                                            patchNode(selected.id, {
                                                interventor_id: e.target.value ? Number(e.target.value) : null,
                                            })
                                        }
                                    >
                                        <option value="">Selecciona…</option>
                                        {INTERVENTOR_OPTIONS.map((i) => (
                                            <option key={i.id} value={i.id}>{i.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="ID del interventor"
                                        value={selected.interventor_id ?? ""}
                                        disabled={readOnly}
                                        onFocus={beginEdit}
                                        onChange={(e) =>
                                            patchNode(selected.id, {
                                                interventor_id: e.target.value ? Number(e.target.value) : null,
                                            })
                                        }
                                    />
                                )}
                            </label>
                            <div className="field-row">
                                <label>
                                    Duración esperada (min)
                                    <input
                                        type="number"
                                        min="1"
                                        value={selected.expected_duration_minutes ?? ""}
                                        disabled={readOnly}
                                        onFocus={beginEdit}
                                        onChange={(e) =>
                                            patchNode(selected.id, {
                                                expected_duration_minutes: e.target.value ? Number(e.target.value) : null,
                                            })
                                        }
                                    />
                                </label>
                                <label>
                                    SLA (min)
                                    <input
                                        type="number"
                                        min="1"
                                        value={selected.sla_minutes ?? ""}
                                        disabled={readOnly}
                                        onFocus={beginEdit}
                                        onChange={(e) =>
                                            patchNode(selected.id, {
                                                sla_minutes: e.target.value ? Number(e.target.value) : null,
                                            })
                                        }
                                    />
                                </label>
                            </div>
                            <div className="field-row">
                                <label>
                                    Advertencia (%)
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={cfgNum(selected, "warning", 80)}
                                        disabled={readOnly}
                                        onFocus={beginEdit}
                                        onChange={(e) => patchConfig(selected.id, { warning: Number(e.target.value) })}
                                    />
                                </label>
                                <label>
                                    Prioridad
                                    <select
                                        value={cfgStr(selected, "priority", "Normal")}
                                        disabled={readOnly}
                                        onFocus={beginEdit}
                                        onChange={(e) => patchConfig(selected.id, { priority: e.target.value })}
                                    >
                                        <option>Baja</option>
                                        <option>Normal</option>
                                        <option>Alta</option>
                                        <option>Crítica</option>
                                    </select>
                                </label>
                            </div>
                        </>
                    )}

                    {selected.node_type === "condition" && (
                        <>
                            <label>
                                Campo a evaluar
                                <select
                                    value={cfgStr(selected, "field", "Tipo de alta")}
                                    disabled={readOnly}
                                    onFocus={beginEdit}
                                    onChange={(e) => patchConfig(selected.id, { field: e.target.value })}
                                >
                                    <option>Tipo de alta</option>
                                    <option>Requiere copago</option>
                                    <option>Servicio</option>
                                    <option>Estado de facturación</option>
                                </select>
                            </label>
                            <label>
                                Operador
                                <select
                                    value={cfgStr(selected, "operator", "Es igual a")}
                                    disabled={readOnly}
                                    onFocus={beginEdit}
                                    onChange={(e) => patchConfig(selected.id, { operator: e.target.value })}
                                >
                                    <option>Es igual a</option>
                                    <option>No es igual a</option>
                                    <option>Contiene</option>
                                </select>
                            </label>
                            <label>
                                Valor
                                <input
                                    value={cfgStr(selected, "value", "")}
                                    disabled={readOnly}
                                    onFocus={beginEdit}
                                    onChange={(e) => patchConfig(selected.id, { value: e.target.value })}
                                />
                            </label>
                        </>
                    )}

                    {selected.node_type === "join" && (
                        <label>
                            Estrategia de unión
                            <select
                                value={cfgStr(selected, "strategy", "Esperar todas")}
                                disabled={readOnly}
                                onFocus={beginEdit}
                                onChange={(e) => patchConfig(selected.id, { strategy: e.target.value })}
                            >
                                <option>Esperar todas</option>
                                <option>Continuar con la primera</option>
                                <option>Esperar rutas obligatorias</option>
                            </select>
                        </label>
                    )}

                    {selected.node_type !== "start" && (
                        <div className="dependency-editor">
                            <div className="dependency-head">
                                <div>
                                    <h4>Dependencias</h4>
                                    <span>Qué debe terminar antes</span>
                                </div>
                                <Badge tone={incomingOf(selected.id).length > 1 ? "info" : "neutral"}>
                                    {incomingOf(selected.id).length}
                                </Badge>
                            </div>

                            <label>
                                Política de activación
                                <select
                                    value={activationOf(selected)}
                                    disabled={readOnly}
                                    onFocus={beginEdit}
                                    onChange={(e) => patchConfig(selected.id, { activation: e.target.value })}
                                >
                                    <option value="all">Todas las dependencias</option>
                                    <option value="any">Cualquiera de las dependencias</option>
                                </select>
                            </label>

                            <div className="dependency-list">
                                {incomingOf(selected.id).length === 0 && (
                                    <p>Este nodo todavía no tiene predecesores.</p>
                                )}
                                {incomingOf(selected.id).map((t) => {
                                    const dep = nodes.find((n) => n.id === t.source_node);
                                    return (
                                        <div key={t.id}>
                                            <span>
                                                <Icon name={dep ? nodeIcon(dep.node_type) : "flow"} size={12} />
                                                {dep?.name ?? "Nodo eliminado"}
                                            </span>
                                            {!readOnly && (
                                                <button onClick={() => removeDependency(t.id)}>
                                                    <Icon name="close" size={12} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {!readOnly && (
                                <div className="add-dependency">
                                    <select
                                        value={candidateId ?? ""}
                                        onChange={(e) => setDependencyCandidate(Number(e.target.value))}
                                    >
                                        {candidateOptions.map((n) => (
                                            <option key={n.id} value={n.id}>{n.name}</option>
                                        ))}
                                    </select>
                                    <Button icon="plus" onClick={addDependency}>Conectar</Button>
                                </div>
                            )}

                            <div className="dependency-note">
                                <Icon name="spark" />
                                <span>
                                    {activationOf(selected) === "all"
                                        ? "Se ejecutará cuando todos los predecesores terminen."
                                        : "Se ejecutará cuando termine cualquiera de sus predecesores."}
                                </span>
                            </div>
                        </div>
                    )}

                    {!readOnly &&
                        selected.node_type !== "start" &&
                        selected.node_type !== "end" && (
                            <div className="config-actions">
                                <Button variant="danger" onClick={() => removeNode(selected.id)}>
                                    Eliminar nodo
                                </Button>
                            </div>
                        )
                    }
                </>
            )}
        </aside>
    )
}

export default NodeConfigPanel