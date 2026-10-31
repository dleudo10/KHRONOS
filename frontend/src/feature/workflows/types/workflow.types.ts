import type { IconName } from "../../../components/ui/Icon";
import type { PaginatedResponse } from "../../../types/services.types";

export type Status = 
    'draft' |
    'published' | 
    'archived'

export type NodeType = "start" | "task" | "system_action" | "end";

export type TransitionConditionType = "always" | "rule";

export type Workflow = {
    id: number;
    name: string;
    code: string;
    description: string;
    is_active: boolean;
    published: string;
    version_number: number;
    created_at: string;
    updated_at: string;
    author: string;
    status: Status
}

export type Summary = {
    published_version: string;
    total_nodes: number;
    versions_count: number;
}

export type WorkflowNode = {
    id: number;
    name: string;
    code: string;
    description: string;
    node_type: NodeType;
    position_x: number;
    position_y: number;
    configuration: Record<string, unknown>;
    interventor_id: number | null;
    expected_duration_minutes: number | null;
    sla_minutes: number | null;
    created_at: string;
};

export type WorkflowTransition = {
    id: number;
    source_node: number;
    source_node_name: string;
    target_node: number;
    target_node_name: string;
    condition_type: TransitionConditionType;
    condition_config: Record<string, unknown>;
};

export type WorkflowGraphPayload = {
    workflow_id: number;
    workflow_version_id: number;
    nodes: {
        id: number | null;
        client_id: number;
        name: string;
        code: string;
        description: string;
        node_type: NodeType;
        interventor_id: number | null;
        expected_duration_minutes: number | null;
        sla_minutes: number | null;
        position_x: number;
        position_y: number;
        configuration: Record<string, unknown>;
    }[];
    transitions: {
        id: number | null;
        source_node: number;
        target_node: number;
        condition_type: TransitionConditionType;
        condition_config: Record<string, unknown>;
    }[];
};

export type Versions = {
    id: number;
    published: string;
    status: Status;
    version_number: number;
    nodes_count: number;
    updated_at: string;
    created_at: string;
    nodes: WorkflowNode[];
    transitions: WorkflowTransition[];
    transitions_count: number; 
}

export type WorkflowDetails = {
    id: number;
    name: string;
    code: string;
    description: string;
    is_active: boolean;
    summary: Summary;
    versions: Versions[];
}

export type WorkflowPayload = {
    name: string;
    code: string;
    description: string;
    is_active: boolean;
}

export type WorkflowsResponse = PaginatedResponse<Workflow>;
export type WorkflowStatusFilter = "all" | "active" | "inactive";

export type ComponentListType = {
    type: NodeType;
    label: string;
    icon: IconName;
    hint: string;
}

export type Activation = "all" | "any";

export type GraphTransition = Pick<
    WorkflowTransition,
    "id" | "source_node" | "target_node" | "condition_type" | "condition_config"
>;

export const nodeIcon = (type: NodeType): IconName =>
    type === "start"
        ? "play"
        : type === "task"
          ? "check"
          : type === "system_action"
            ? "zap"
            : type === "end"
              ? "check"
              : "layers";

;

export type Issue = { nodeId?: number; title: string; message: string };
