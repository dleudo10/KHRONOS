import type { WorkflowNode } from "../types/workflow.types";
import { slugCode } from "./slugCode";

export const uniqueCode = (base: string, nodes: WorkflowNode[]) => {
    const used = new Set(nodes.map((n) => n.code));
    const root = slugCode(base);
    if (!used.has(root)) return root;
    let i = 2;
    while (used.has(`${root}-${i}`)) i++;
    return `${root}-${i}`;
};