
import { useCallback, useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { WorkflowNodeView } from "./WorkflowNode";
import type { WorkflowEdge, WorkflowNode } from "./workflow-types";

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<WorkflowEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  onSelectNode: (nodeId: string | null) => void;
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectNode,
}: WorkflowCanvasProps) {
  const nodeTypes = useMemo(
    () => ({
      workflow: WorkflowNodeView,
    }),
    [],
  );

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: WorkflowNode[] }) => {
      onSelectNode(selectedNodes[0]?.id ?? null);
    },
    [onSelectNode],
  );

  return (
    <div className="relative h-full min-h-0 w-full bg-[#F8FAFD]">
      <ReactFlow<WorkflowNode, WorkflowEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={handleSelectionChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.25}
        maxZoom={1.5}
        deleteKeyCode={["Backspace", "Delete"]}
        defaultEdgeOptions={{
          type: "smoothstep",
          style: {
            stroke: "#AAB8CB",
            strokeWidth: 1.5,
          },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#DCE4EF"
        />

        <Controls
          position="top-left"
          showInteractive={false}
          className="!ml-3 !mt-3 !overflow-hidden !rounded-lg !border !border-slate-200 !bg-white !shadow-sm"
        />

        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          nodeColor={(node) => {
            const workflowNode = node as WorkflowNode;

            switch (workflowNode.data.kind) {
              case "start":
                return "#10B981";
              case "condition":
                return "#8B5CF6";
              case "join":
                return "#F59E0B";
              case "end":
                return "#059669";
              default:
                return "#3B82F6";
            }
          }}
          maskColor="rgba(241,245,249,0.65)"
          className="!border !border-slate-200 !bg-white"
        />
      </ReactFlow>
    </div>
  );
}
