import type { Activation, WorkflowNode } from "../types/workflow.types";
import { cfgStr } from "./cfgStr";

export const activationOf = (n: WorkflowNode): Activation =>
    cfgStr(n, "activation", "all") === "any" ? "any" : "all";