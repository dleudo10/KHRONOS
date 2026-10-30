import type { WorkflowNode } from "../types/workflow.types";

export const cfgStr = (n: WorkflowNode, key: string, fallback: string) => {
    const v = n.configuration?.[key];
    return typeof v === "string" ? v : fallback;
};