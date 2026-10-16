
import { memo } from "react";
import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";
import {
  Activity,
  Check,
  CircleCheck,
  GitBranch,
  Layers,
  Play,
  Users,
  Clock3,
} from "lucide-react";
import type { WorkflowNode } from "./workflow-types";

const styles = {
  start: {
    label: "INICIO",
    icon: Play,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  task: {
    label: "TAREA",
    icon: Check,
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  condition: {
    label: "CONDICIÓN",
    icon: GitBranch,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  parallel: {
    label: "DIVISIÓN",
    icon: Layers,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  join: {
    label: "UNIÓN",
    icon: Users,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  end: {
    label: "FIN",
    icon: CircleCheck,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
};

export const WorkflowNodeView = memo(function WorkflowNodeView({
  data,
  selected,
}: NodeProps<WorkflowNode>) {
  const config = styles[data.kind];
  const Icon = config.icon;
  const isStart = data.kind === "start";
  const isEnd = data.kind === "end";

  return (
    <div
      className={[
        "w-[205px] rounded-lg border bg-white shadow-[0_2px_7px_rgba(15,23,42,0.07)]",
        "transition-shadow",
        selected
          ? "border-blue-500 ring-1 ring-blue-400 shadow-md"
          : "border-slate-200",
      ].join(" ")}
    >
      {!isStart && (
        <Handle
          type="target"
          position={Position.Left}
          className="!size-2.5 !border-2 !border-white !bg-slate-400"
        />
      )}

      <div className="flex items-start gap-2.5 p-3">
        <div
          className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md ${config.bg} ${config.color}`}
        >
          <Icon size={15} />
        </div>

        <div className="min-w-0 flex-1">
          <p className={`text-[8px] font-bold tracking-[0.12em] ${config.color}`}>
            {config.label}
          </p>

          <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-[1.4] text-slate-800">
            {data.label}
          </p>

          <p className="mt-1 line-clamp-2 text-[9px] leading-[1.5] text-slate-500">
            {data.description}
          </p>

          {data.kind === "task" && (
            <div className="mt-2 flex items-center gap-1 text-[9px] text-slate-500">
              <Users size={10} />
              <span className="truncate">{data.assignee}</span>
              <span>·</span>
              <Clock3 size={10} />
              <span>{data.sla} min</span>
            </div>
          )}

          {data.kind === "condition" && (
            <div className="mt-2 flex items-center gap-1 text-[9px] text-slate-500">
              <Activity size={10} />
              Regla de decisión
            </div>
          )}
        </div>
      </div>

      {!isEnd && (
        <Handle
          type="source"
          position={Position.Right}
          className="!size-2.5 !border-2 !border-white !bg-slate-400"
        />
      )}
    </div>
  );
});
