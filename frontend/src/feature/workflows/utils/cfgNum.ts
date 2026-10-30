import type { WorkflowNode } from "../types/workflow.types";

export const cfgNum = (n: WorkflowNode, key: string, fallback: number) => {
    const v = n.configuration?.[key];
    return typeof v === "number" ? v : fallback;
};