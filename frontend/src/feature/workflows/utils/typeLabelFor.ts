import type { NodeType } from "../types/workflow.types";
 
const labels: Record<NodeType, string> = {
    start: "Inicio",
    task: "Tarea",
    system_action: "Acción del sistema",
    end: "Fin",
};
 
export const typeLabelFor = (type: NodeType): string => labels[type];