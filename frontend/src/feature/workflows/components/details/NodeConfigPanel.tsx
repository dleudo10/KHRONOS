import Badge, { type Tone } from "../../../../components/ui/Badge";
import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/ui/Icon";
import type { Intervenor } from "../../../intervenors/types/intervenor.types";
import { SYSTEM_ACTION_OPTIONS } from "../../types/const";
import { nodeIcon, type GraphTransition, type WorkflowNode } from "../../types/workflow.types";
import { activationOf } from "../../utils/activationOf";
import { cfgNum } from "../../utils/cfgNum";
import { cfgStr } from "../../utils/cfgStr";
import { typeLabelFor } from "../../utils/typeLabelFor";

/* Deben coincidir con lo que el backend acepta en condition_config */
const RULE_FIELDS = ["Tipo de alta", "Requiere copago", "Servicio", "Estado de facturación"];
const RULE_OPERATORS = ["Es igual a", "No es igual a", "Contiene"];

const ruleValue = (t: GraphTransition, key: string) => String(t.condition_config?.[key] ?? "");

type NodeConfigPanelProps = {
    selected: WorkflowNode | null;
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
    updateTransition: (id: number, patch: Partial<GraphTransition>) => void;

    intervenors: Intervenor[];
    intervenorsLoading: boolean;
};

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
    updateTransition,
    intervenors,
    intervenorsLoading,
}: NodeConfigPanelProps) => {
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

    const incoming = selected ? incomingOf(selected.id) : [];
    const outgoing = selected ? transitions.filter((t) => t.source_node === selected.id) : [];

    /* Candidatos: no Fin, no el mismo nodo, no ya conectados y que no generen ciclo */
    const linked = new Set(incoming.map((t) => t.source_node));
    const candidateOptions = selected
        ? nodes.filter(
              (n) =>
                  n.id !== selected.id &&
                  n.node_type !== "end" &&
                  !linked.has(n.id) &&
                  !reaches(selected.id, n.id),
          )
        : [];

    const candidateId =
        candidateOptions.find((n) => n.id === dependencyCandidate)?.id ??
        candidateOptions[0]?.id ??
        null;

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

    /* Cambia una ruta entre "Siempre" y "Con regla" */
    const setRouteMode = (t: GraphTransition, mode: "always" | "rule") => {
        if (mode === "always") {
            updateTransition(t.id, { condition_type: "always", condition_config: {} });
        } else {
            updateTransition(t.id, {
                condition_type: "rule",
                condition_config: { field: RULE_FIELDS[0], operator: RULE_OPERATORS[0], value: "" },
            });
        }
    };

    const patchRule = (t: GraphTransition, key: string, value: string) =>
        updateTransition(t.id, { condition_config: { ...t.condition_config, [key]: value } });

    const typeLabel = selected ? typeLabelFor(selected.node_type) : "";

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

                    {/* ── TAREA: único tipo con interventor y tiempos ── */}
                    {selected.node_type === "task" && (
                        <>
                            <label>
                                Interventor

                                <select
                                    value={selected.interventor_id ?? ""}
                                    disabled={readOnly || intervenorsLoading}
                                    onFocus={beginEdit}
                                    onChange={(e) =>
                                        patchNode(selected.id, {
                                            interventor_id: e.target.value
                                                ? Number(e.target.value)
                                                : null,
                                        })
                                    }
                                >
                                    <option value="">
                                        {intervenorsLoading
                                            ? "Cargando interventores..."
                                            : "Selecciona un interventor"}
                                    </option>

                                    {intervenors.map((intervenor) => (
                                        <option key={intervenor.id} value={intervenor.id}>
                                            {intervenor.name} ({intervenor.code})
                                        </option>
                                    ))}
                                </select>

                                {!intervenorsLoading && intervenors.length === 0 && (
                                    <small>No hay interventores activos disponibles.</small>
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

                    {/* ── ACCIÓN DEL SISTEMA: sin interventor, solo qué acción ejecuta ── */}
                    {selected.node_type === "system_action" && (
                        <label>
                            Acción a ejecutar
                            <select
                                value={cfgStr(selected, "action", "")}
                                disabled={readOnly}
                                onFocus={beginEdit}
                                onChange={(e) => patchConfig(selected.id, { action: e.target.value })}
                            >
                                <option value="">Selecciona…</option>
                                {SYSTEM_ACTION_OPTIONS.map((a) => (
                                    <option key={a.value} value={a.value}>{a.label}</option>
                                ))}
                            </select>
                        </label>
                    )}

                    {/* ── DEPENDENCIAS (entrantes) ── */}
                    {selected.node_type !== "start" && (
                        <div className="dependency-editor">
                            <div className="dependency-head">
                                <div>
                                    <h4>Dependencias</h4>
                                    <span>Qué debe terminar antes</span>
                                </div>
                                <Badge tone={incoming.length > 1 ? "info" : "neutral"}>
                                    {incoming.length}
                                </Badge>
                            </div>

                            {incoming.length > 1 && (
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
                            )}

                            <div className="dependency-list">
                                {incoming.length === 0 && (
                                    <p>Este nodo todavía no tiene predecesores.</p>
                                )}
                                {incoming.map((t) => {
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

                            {!readOnly && candidateOptions.length > 0 && (
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

                            {incoming.length > 1 && (
                                <div className="dependency-note">
                                    <Icon name="spark" />
                                    <span>
                                        {activationOf(selected) === "all"
                                            ? "Se ejecutará cuando todos los predecesores terminen."
                                            : "Se ejecutará cuando termine cualquiera de sus predecesores."}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── RUTAS DE SALIDA (donde viven las condiciones) ── */}
                    {selected.node_type !== "end" && outgoing.length > 1 && (
                        <div className="dependency-editor">
                            <div className="dependency-head">
                                <div>
                                    <h4>Rutas de salida</h4>
                                    <span>Cuándo sigue cada camino</span>
                                </div>
                                <Badge tone="info">{outgoing.length}</Badge>
                            </div>

                            <div className="dependency-list">
                                {outgoing.map((t) => {
                                    const target = nodes.find((n) => n.id === t.target_node);
                                    const isRule = t.condition_type === "rule";
                                    return (
                                        <div key={t.id} className="route-item">
                                            <span>
                                                <Icon name={target ? nodeIcon(target.node_type) : "flow"} size={12} />
                                                {target?.name ?? "Nodo eliminado"}
                                            </span>

                                            <select
                                                value={t.condition_type}
                                                disabled={readOnly}
                                                onFocus={beginEdit}
                                                onChange={(e) => setRouteMode(t, e.target.value as "always" | "rule")}
                                            >
                                                <option value="always">Siempre / por defecto</option>
                                                <option value="rule">Con regla</option>
                                            </select>

                                            {isRule && (
                                                <>
                                                    <select
                                                        value={ruleValue(t, "field")}
                                                        disabled={readOnly}
                                                        onFocus={beginEdit}
                                                        onChange={(e) => patchRule(t, "field", e.target.value)}
                                                    >
                                                        {RULE_FIELDS.map((f) => <option key={f}>{f}</option>)}
                                                    </select>
                                                    <div className="field-row">
                                                        <select
                                                            value={ruleValue(t, "operator")}
                                                            disabled={readOnly}
                                                            onFocus={beginEdit}
                                                            onChange={(e) => patchRule(t, "operator", e.target.value)}
                                                        >
                                                            {RULE_OPERATORS.map((o) => <option key={o}>{o}</option>)}
                                                        </select>
                                                        <input
                                                            placeholder="Valor"
                                                            value={ruleValue(t, "value")}
                                                            disabled={readOnly}
                                                            onFocus={beginEdit}
                                                            onChange={(e) => patchRule(t, "value", e.target.value)}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="dependency-note">
                                <Icon name="spark" />
                                <span>
                                    Si todas las rutas son “Siempre”, se ejecutan en paralelo. Si alguna tiene
                                    regla, el flujo elige según el valor y la ruta “Siempre” actúa como alternativa
                                    por defecto.
                                </span>
                            </div>
                        </div>
                    )}

                    {!readOnly &&
                        selected.node_type !== "start" &&
                        selected.node_type !== "end" && (
                            <div className="config-actions mt-4!">
                                <Button variant="danger" onClick={() => removeNode(selected.id)}>
                                    Eliminar nodo
                                </Button>
                            </div>
                        )}
                </>
            )}
        </aside>
    );
};

export default NodeConfigPanel;
