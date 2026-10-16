
import type { Node, Edge } from "@xyflow/react";

export type WorkflowNodeKind =
  | "start"
  | "task"
  | "condition"
  | "parallel"
  | "join"
  | "end";

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  description: string;
  kind: WorkflowNodeKind;
  assignee: string;
  sla: number;
  priority: "Baja" | "Normal" | "Alta" | "Crítica";
  warningPercent: number;
  activationPolicy: "all" | "any";
}

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface NodeDefinition {
  kind: WorkflowNodeKind;
  label: string;
  description: string;
}
