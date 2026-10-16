
import type { Edge } from "@xyflow/react";
import type {
  NodeDefinition,
  WorkflowNode,
  WorkflowNodeKind,
} from "./workflow-types";

export const nodeDefinitions: NodeDefinition[] = [
  { kind: "start", label: "Inicio", description: "Punto de entrada" },
  { kind: "task", label: "Tarea", description: "Unidad ejecutable" },
  { kind: "condition", label: "Condición", description: "Decisión lógica" },
  { kind: "parallel", label: "División", description: "Abre rutas paralelas" },
  { kind: "join", label: "Unión", description: "Espera dependencias" },
  { kind: "end", label: "Fin", description: "Cierre del flujo" },
];

export const nodeDefaults: Record<
  WorkflowNodeKind,
  {
    label: string;
    description: string;
    assignee: string;
    sla: number;
  }
> = {
  start: {
    label: "Alta médica",
    description: "Inicio del proceso",
    assignee: "Admisiones",
    sla: 0,
  },
  task: {
    label: "Nueva tarea",
    description: "Describe la tarea que se debe ejecutar",
    assignee: "Enfermería",
    sla: 20,
  },
  condition: {
    label: "Validar condición",
    description: "Evalúa una regla del flujo",
    assignee: "Admisiones",
    sla: 0,
  },
  parallel: {
    label: "Dividir proceso",
    description: "Ejecutar rutas en paralelo",
    assignee: "Sistema",
    sla: 0,
  },
  join: {
    label: "Unir gestiones",
    description: "Esperar las rutas anteriores",
    assignee: "Sistema",
    sla: 0,
  },
  end: {
    label: "Fin del proceso",
    description: "Cerrar el flujo",
    assignee: "Sistema",
    sla: 0,
  },
};

export const initialNodes: WorkflowNode[] = [
  {
    id: "start-1",
    type: "workflow",
    position: { x: 60, y: 230 },
    data: {
      kind: "start",
      label: "Alta médica",
      description: "Inicio del proceso",
      assignee: "Admisiones",
      sla: 0,
      priority: "Normal",
      warningPercent: 80,
      activationPolicy: "all",
    },
  },
  {
    id: "task-1",
    type: "workflow",
    position: { x: 300, y: 100 },
    data: {
      kind: "task",
      label: "Plan de egreso",
      description: "Preparar salida del paciente",
      assignee: "Enfermería",
      sla: 15,
      priority: "Normal",
      warningPercent: 80,
      activationPolicy: "all",
    },
  },
  {
    id: "task-2",
    type: "workflow",
    position: { x: 300, y: 350 },
    data: {
      kind: "task",
      label: "Facturación",
      description: "Cerrar cuenta hospitalaria",
      assignee: "Facturación",
      sla: 20,
      priority: "Normal",
      warningPercent: 80,
      activationPolicy: "all",
    },
  },
  {
    id: "condition-1",
    type: "workflow",
    position: { x: 570, y: 230 },
    data: {
      kind: "condition",
      label: "Validar copago",
      description: "Evaluar si requiere copago",
      assignee: "Facturación",
      sla: 0,
      priority: "Normal",
      warningPercent: 80,
      activationPolicy: "all",
    },
  },
  {
    id: "end-1",
    type: "workflow",
    position: { x: 850, y: 230 },
    data: {
      kind: "end",
      label: "Proceso finalizado",
      description: "Cierre del flujo",
      assignee: "Sistema",
      sla: 0,
      priority: "Normal",
      warningPercent: 80,
      activationPolicy: "all",
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: "e-start-task1",
    source: "start-1",
    target: "task-1",
    type: "smoothstep",
  },
  {
    id: "e-start-task2",
    source: "start-1",
    target: "task-2",
    type: "smoothstep",
  },
  {
    id: "e-task1-condition",
    source: "task-1",
    target: "condition-1",
    type: "smoothstep",
  },
  {
    id: "e-task2-condition",
    source: "task-2",
    target: "condition-1",
    type: "smoothstep",
  },
  {
    id: "e-condition-end",
    source: "condition-1",
    target: "end-1",
    type: "smoothstep",
  },
];
