import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Icon from "../../../components/ui/Icon";
import BuilderTop from "../components/details/BuilderTop";
import { useDetailsWorkflow } from "../hooks/useDetailsWorkflow";
import { type ComponentListType, type GraphTransition, type Issue, type NodeType, type WorkflowGraphPayload, type WorkflowNode } from "../types/workflow.types";
import ComponentsPanel from "../components/details/ComponentsPanel";
import { activationOf } from "../utils/activationOf";
import { uniqueCode } from "../utils/uniqueCode";
import GraphCanvas from "../components/details/GraphCanvas";
import NodeConfigPanel from "../components/details/NodeConfigPanel";
import PanelValidation from "../components/details/PanelValidation";
import PublishConfirmDialog from "../components/details/PublishConfirmDialog";
import { useGetIntervenors } from "../../intervenors/hooks/useGetIntervenors";

type Snapshot = { nodes: WorkflowNode[]; transitions: GraphTransition[] };
type Tone = "success" | "info" | "warning" | "danger" | "neutral";

const componentList: ComponentListType[] = [
    { type: "start", label: "Inicio", icon: "play", hint: "Punto de entrada" },
    { type: "task", label: "Tarea", icon: "check", hint: "Unidad ejecutable" },
    { type: "system_action", label: "Sistema", icon: "flow", hint: "Intervención por el sistema" },
    { type: "end", label: "Fin", icon: "check", hint: "Cierre del flujo" },
];

const defaultNames: Record<NodeType, string> = {
    start: "Inicio",
    task: "Nueva tarea",
    system_action: "Acción del sistema",
    end: "Fin",
};

const defaultConfiguration = (type: NodeType): Record<string, unknown> =>
    type === "system_action" ? { action: "" } : {};

const WorkflowBuilder = () => {
    const { id_workflow, id_workflow_version } = useParams<{
        id_workflow: string;
        id_workflow_version: string;
    }>();
    const workflowId = Number(id_workflow);
    const workflowVersionId = Number(id_workflow_version);
    const { data, isLoading, isError } = useDetailsWorkflow(workflowId);
    const workflow = data?.data;
    const selectedVersion = workflow?.versions.find(
        version => version.id === workflowVersionId
    );

    /* ── Estado local del grafo (editable) ── */
    const [nodes, setNodes] = useState<WorkflowNode[]>([]);
    const [transitions, setTransitions] = useState<GraphTransition[]>([]);
    const [history, setHistory] = useState<Snapshot[]>([]);
    const [future, setFuture] = useState<Snapshot[]>([]);
    const [dirty, setDirty] = useState(false);
    const [localPublished, setLocalPublished] = useState(false);

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [dependencyCandidate, setDependencyCandidate] = useState<number | null>(null);
    
    const [simulation, setSimulation] = useState<number | null>(null);
    const [validationOpen, setValidationOpen] = useState(false);
    const [publishConfirm, setPublishConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(null);

    const tempId = useRef(-1);
    const toastTimer = useRef<number | undefined>(undefined);

    const readOnly = selectedVersion
        ? selectedVersion.status !== "draft" || localPublished
        : true;

    /* ── Sincroniza con el servidor cuando cambia la versión o se refresca ── */
    useEffect(() => {
        if (!selectedVersion) return;
        setNodes(selectedVersion.nodes ?? []);
        setTransitions(
            (selectedVersion.transitions ?? []).map((t) => ({
                id: t.id,
                source_node: t.source_node,
                target_node: t.target_node,
                condition_type: t.condition_type,
                condition_config: t.condition_config ?? {},
            })),
        );
        setHistory([]);
        setFuture([]);
        setDirty(false);
        setSimulation(null);
        setLocalPublished(false);
        setSelectedId((prev) =>
            selectedVersion.nodes.some((n) => n.id === prev)
                ? prev
                : (selectedVersion.nodes[0]?.id ?? null),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVersion?.id, selectedVersion?.updated_at]);

    useEffect(() => () => window.clearTimeout(toastTimer.current), []);

    /* ── Derivados ── */
    const selected = nodes.find((n) => n.id === selectedId) ?? null;

    const incomingOf = (id: number) => transitions.filter((t) => t.target_node === id);
    const outgoingOf = (id: number) => transitions.filter((t) => t.source_node === id);

    /** Nivel de ejecución de cada nodo (para la simulación). */
    const levels = useMemo(() => {
        const byId = new Map(nodes.map((n) => [n.id, n]));
        const memo = new Map<number, number>();
        const calc = (id: number, trail: Set<number>): number => {
            if (memo.has(id)) return memo.get(id)!;
            if (trail.has(id)) return 0;
            const node = byId.get(id);
            if (!node) return 0;
            const sources = transitions
                .filter((t) => t.target_node === id)
                .map((t) => t.source_node);
            if (!sources.length) {
                memo.set(id, 0);
                return 0;
            }
            const next = new Set(trail).add(id);
            const lv = sources.map((s) => calc(s, next));
            const value =
                1 +
                (activationOf(node) === "any" ? Math.min(...lv) : Math.max(...lv));
            memo.set(id, value);
            return value;
        };
        nodes.forEach((n) => calc(n.id, new Set()));
        return memo;
    }, [nodes, transitions]);

    const maxLevel = nodes.length ? Math.max(...nodes.map((n) => levels.get(n.id) ?? 0)) : 0;

    /* ── Utilidades UI ── */
    const notify = (message: string, tone: Tone = "info") => {
        setToast({ message, tone });
        window.clearTimeout(toastTimer.current);
        toastTimer.current = window.setTimeout(() => setToast(null), 3200);
    };

    const guardReadOnly = () => {
        if (readOnly) {
            notify("Las versiones publicadas o archivadas son de solo lectura", "warning");
            return true;
        }
        return false;
    };

    /* ── Historial ── */
    const snapshot = () => {
        setHistory((h) => [...h.slice(-49), { nodes, transitions }]);
        setFuture([]);
    };
    
    const commitGraph = (nextNodes: WorkflowNode[], nextTransitions: GraphTransition[]) => {
        snapshot();
        setNodes(nextNodes);
        setTransitions(nextTransitions);
        setDirty(true);
    };

    const undo = () => {
        if (guardReadOnly()) return;
        if (!history.length) return notify("No hay cambios para deshacer");
        const prev = history[history.length - 1];
        setFuture((f) => [{ nodes, transitions }, ...f]);
        setHistory((h) => h.slice(0, -1));
        setNodes(prev.nodes);
        setTransitions(prev.transitions);
        setDirty(true);
    };

    const redo = () => {
        if (guardReadOnly()) return;
        if (!future.length) return notify("No hay cambios para rehacer");
        const next = future[0];
        setHistory((h) => [...h, { nodes, transitions }]);
        setFuture((f) => f.slice(1));
        setNodes(next.nodes);
        setTransitions(next.transitions);
        setDirty(true);
    };

    /* ── Operaciones sobre el grafo ── */
    const addNode = (type: NodeType) => {
        if (guardReadOnly()) return;
        if (
            (type === "start" && nodes.some((n) => n.node_type === "start")) ||
            (type === "end" && nodes.some((n) => n.node_type === "end"))
        ) {
            return notify(
                `El grafo solo puede tener un nodo de ${type === "start" ? "inicio" : "fin"}`,
                "warning",
            );
        }
        const parent = selected && selected.node_type !== "end" ? selected : null;
        const siblings = parent ? outgoingOf(parent.id).length : 0;
        const id = tempId.current--;
        const name = defaultNames[type];
        const node: WorkflowNode = {
            id,
            name,
            code: uniqueCode(name, nodes),
            description: "",
            node_type: type,
            position_x: parent ? parent.position_x + 270 : 120 + nodes.length * 30,
            position_y: parent ? parent.position_y + siblings * 130 : 120 + nodes.length * 30,
            configuration: defaultConfiguration(type),
            interventor_id: null,
            expected_duration_minutes: null,
            sla_minutes: type === "task" ? 20 : null,
            created_at: new Date().toISOString(),
        };
        const nextTransitions =
            parent && type !== "start"
                ? [
                      ...transitions,
                      {
                          id: tempId.current--,
                          source_node: parent.id,
                          target_node: id,
                          condition_type: "always" as const,
                          condition_config: {},
                      },
                  ]
                : transitions;
        commitGraph([...nodes, node], nextTransitions);
        setSelectedId(id);
        notify(`${name} agregado al grafo`, "success");
    };

    const removeNode = (id: number) => {
        if (guardReadOnly()) return;
        const node = nodes.find((n) => n.id === id);
        if (!node) return;
        if (node.node_type === "start" || node.node_type === "end") {
            return notify("Inicio y Fin son obligatorios", "warning");
        }
        const nextNodes = nodes.filter((n) => n.id !== id);
        commitGraph(
            nextNodes,
            transitions.filter((t) => t.source_node !== id && t.target_node !== id),
        );
        setSelectedId(nextNodes[0]?.id ?? null);
        notify("Nodo y sus relaciones fueron eliminados", "success");
    };

    const updateTransition = (transitionId: number, patch: Partial<GraphTransition>) => {
        if (guardReadOnly()) return;
        setTransitions((cur) => cur.map((t) => (t.id === transitionId ? { ...t, ...patch } : t)));
        setDirty(true);
    };

    /* ── Validación ── */
    const validateGraph = (): { errors: Issue[]; warnings: Issue[] } => {
        const errors: Issue[] = [];
        const warnings: Issue[] = [];
        const starts = nodes.filter((n) => n.node_type === "start");
        const ends = nodes.filter((n) => n.node_type === "end");

        if (starts.length !== 1)
            errors.push({ title: "Nodo Inicio", message: "Debe existir exactamente un nodo Inicio." });
        if (ends.length !== 1)
            errors.push({ title: "Nodo Fin", message: "Debe existir exactamente un nodo Fin." });

        const codes = new Map<string, number>();
        nodes.forEach((n) => {
            if (!n.name.trim())
                errors.push({ nodeId: n.id, title: "Nodo sin nombre", message: "Todos los nodos requieren nombre." });
            codes.set(n.code, (codes.get(n.code) ?? 0) + 1);
            if (n.node_type !== "start" && !incomingOf(n.id).length)
                errors.push({ nodeId: n.id, title: n.name, message: "Requiere al menos una dependencia." });
            if (n.node_type !== "end" && !outgoingOf(n.id).length)
                errors.push({ nodeId: n.id, title: n.name, message: "No tiene un nodo siguiente." });
            if (n.node_type === "task") {
                if (!n.interventor_id)
                    errors.push({ nodeId: n.id, title: n.name, message: "La tarea requiere un interventor." });
                if (!n.sla_minutes || n.sla_minutes <= 0)
                    errors.push({ nodeId: n.id, title: n.name, message: "La tarea requiere un SLA mayor a 0." });
                if (!n.description.trim())
                    warnings.push({ nodeId: n.id, title: n.name, message: "La descripción podría incluir el criterio de finalización." });
                if (n.expected_duration_minutes && n.sla_minutes && n.expected_duration_minutes > n.sla_minutes)
                    warnings.push({ nodeId: n.id, title: n.name, message: "La duración esperada supera el SLA." });
            }
        });
        codes.forEach((count, code) => {
            if (count > 1)
                errors.push({ title: "Código duplicado", message: `El código ${code} se repite en la versión.` });
        });

        // Alcanzabilidad desde Inicio
        if (starts.length === 1) {
            const seen = new Set<number>();
            const stack = [starts[0].id];
            while (stack.length) {
                const cur = stack.pop()!;
                if (seen.has(cur)) continue;
                seen.add(cur);
                outgoingOf(cur).forEach((t) => stack.push(t.target_node));
            }
            nodes.forEach((n) => {
                if (!seen.has(n.id))
                    errors.push({ nodeId: n.id, title: n.name, message: "No es alcanzable desde el nodo Inicio." });
            });
        }
        return { errors, warnings };
    };

    const validation = validationOpen ? validateGraph() : null;

    /* ── Payload hacia el backend ── */
    const buildPayload = (): Omit<WorkflowGraphPayload, "workflow_id" | "workflow_version_id"> => ({
        nodes: nodes.map((n) => {
            const isTask = n.node_type === "task";
            return {
                id: n.id > 0 ? n.id : null, // null = nodo nuevo
                client_id: n.id, // id temporal para resolver transiciones
                name: n.name.trim(),
                code: n.code,
                description: n.description,
                node_type: n.node_type,
                // Solo las tareas llevan interventor y tiempos; el resto va en null
                interventor_id: isTask ? n.interventor_id : null,
                expected_duration_minutes: isTask ? n.expected_duration_minutes : null,
                sla_minutes: isTask ? n.sla_minutes : null,
                position_x: Math.round(n.position_x),
                position_y: Math.round(n.position_y),
                configuration: n.configuration,
            };
        }),
        transitions: transitions.map((t) => ({
            id: t.id > 0 ? t.id : null,
            source_node: t.source_node, // id real o client_id (negativo)
            target_node: t.target_node,
            condition_type: t.condition_type,
            condition_config: t.condition_type === "rule" ? t.condition_config : {},
        })),
    });

    const persistGraph = async (): Promise<boolean> => {
        // const payload = buildPayload();
        const payload = {
            'workflow_id': workflowId,
            'workflow_version_id': workflowVersionId,
            ...buildPayload(),
        }
        console.info("[WorkflowBuilder] payload", payload);
        return true;
    };

    const handleSave = async () => {
        if (guardReadOnly()) return;
        setSaving(true);
        try {
            // El borrador se puede guardar incompleto; solo publicar exige un grafo válido
            if (await persistGraph()) {
                setDirty(false);
                notify("Borrador guardado", "success");
            }
        } catch {
            notify("No se pudo guardar el borrador", "danger");
        } finally {
            setSaving(false);
        }
    };

    const handleValidate = () => setValidationOpen(true);

    const handlePublish = () => {
        if (readOnly) return notify("Esta versión ya está publicada y es inmutable", "warning");
        const { errors } = validateGraph();
        if (errors.length) return setValidationOpen(true);
        setPublishConfirm(true);
    };

    const simulate = () => {
        if (validateGraph().errors.length) {
            setValidationOpen(true);
            return notify("Corrige los errores antes de previsualizar", "danger");
        }
        setSimulation((cur) => (cur === null ? 0 : cur >= maxLevel ? null : cur + 1));
    };
    const simulationLabel = simulation === null ? "Previsualizar" : simulation >= maxLevel ? "Reiniciar" : "Siguiente etapa";
    const {data:intervenorsData, isLoading:isLoadingIntervenors} = useGetIntervenors({
        page: 1,
        pageSize: 100,
        search: "",
        isActive: true,
    })
    const intervenors = intervenorsData?.data?.results ?? [];
    /* ───────── Retornos tempranos (después de TODOS los hooks) ───────── */
    if (isLoading) return <p>Cargando workflow...</p>;
    if (isError) return <p>Error al cargar el workflow.</p>;
    if (!workflow) return <p>Workflow no encontrado.</p>;
    if (!selectedVersion) return <p>La versión solicitada no existe en este workflow.</p>;

    const status = localPublished ? "published" : selectedVersion.status;

    return (
        <div className="builder-shell">
            {/* HEADER */}
            <BuilderTop 
                status={status}
                title={workflow.name}
                version={selectedVersion.version_number}
                dirty={dirty}
                saving={saving}
                simulationLabel={simulationLabel}
                onUndo={undo}
                onRedo={redo}
                onSimulate={simulate}
                onSave={handleSave}
                onValidate={handleValidate}
                onPublish={handlePublish}
            />
            


            <div className="builder-body">
                {/* PANEL IZQUIERDO */}
                <ComponentsPanel 
                    componentList={componentList}
                    addNode={addNode}
                />

                <GraphCanvas 
                    readOnly={readOnly}
                    snapshot={snapshot} 
                    nodes={nodes}
                    setNodes={setNodes}
                    setDirty={setDirty}
                    dirty={dirty}
                    guardReadOnly={guardReadOnly}
                    notify={notify} 
                    tempId={tempId}
                    incomingOf={incomingOf}
                    commitGraph={commitGraph}
                    transitions={transitions}
                    setSelectedId={setSelectedId}
                    selectedId={selectedId}
                    simulation={simulation}
                    levels={levels}
                    setDependencyCandidate={setDependencyCandidate}
                    removeNode={removeNode}
                    intervenors={intervenors}
                    intervenorsLoading={isLoading}
                />

                {/* PANEL DERECHO */}
                <NodeConfigPanel 
                    selected={selected}
                    nodes={nodes}
                    dependencyCandidate={dependencyCandidate}
                    readOnly={readOnly}
                    setNodes={setNodes}
                    setDirty={setDirty}
                    snapshot={snapshot} 
                    transitions={transitions}
                    notify={notify} 
                    guardReadOnly={guardReadOnly}
                    commitGraph={commitGraph}
                    tempId={tempId}
                    incomingOf={incomingOf}
                    setDependencyCandidate={setDependencyCandidate}
                    removeNode={removeNode}
                    updateTransition={updateTransition}
                    intervenors={intervenors}
                    intervenorsLoading={isLoadingIntervenors}
                />
            </div>

            {/* PANEL DE VALIDACIÓN */}
            {validationOpen && validation && (
                <PanelValidation 
                    setValidationOpen={setValidationOpen}
                    validation={validation}
                    setSelectedId={setSelectedId}
                    readOnly={readOnly}
                    setPublishConfirm={setPublishConfirm}
                />
            )}

            {/* CONFIRMACIÓN DE PUBLICACIÓN */}
            {publishConfirm && (
                <PublishConfirmDialog 
                    selectedVersion={selectedVersion}
                    setPublishConfirm={setPublishConfirm}
                    saving={saving}
                    notify={notify}
                    setSaving={setSaving}
                    persistGraph={persistGraph}
                    setLocalPublished={setLocalPublished}
                    setDirty={setDirty}
                />
            )}

            {/* TOAST */}
            <div className={`toast ${toast ? `show toast-${toast.tone}` : ""}`}>
                {toast && (
                    <>
                        <Icon name={toast.tone === "success" ? "check" : toast.tone === "danger" ? "alert" : "bell"} />
                        <span>{toast.message}</span>
                    </>
                )}
            </div>
        </div>
    )
}

export default WorkflowBuilder