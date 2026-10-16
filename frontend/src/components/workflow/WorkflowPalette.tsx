
import {
  Play,
  Check,
  GitBranch,
  Layers,
  Layers2,
  CircleCheck,
  Plus,
  type LucideIcon,
} from "lucide-react";
// import { Button } from "@/components/ui/button";
import { nodeDefinitions } from "./workflow-data";
import type { WorkflowNodeKind } from "./workflow-types";

const icons: Record<WorkflowNodeKind, LucideIcon> = {
  start: Play,
  task: Check,
  condition: GitBranch,
  parallel: Layers,
  join: Layers2,
  end: CircleCheck,
};

interface WorkflowPaletteProps {
  onAddNode: (kind: WorkflowNodeKind) => void;
}

export function WorkflowPalette({ onAddNode }: WorkflowPaletteProps) {
  return (
    <aside className="flex h-full w-[190px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h2 className="text-[13px] font-medium text-slate-900">Nodos</h2>
        <p className="mt-1 text-[10px] text-slate-500">
          Agrega unidades al grafo
        </p>
      </div>

      <div className="space-y-1.5 overflow-y-auto px-3 py-3">
        {nodeDefinitions.map((node) => {
          const Icon = icons[node.kind];

          return (
            <button
              key={node.kind}
              onClick={() => onAddNode(node.kind)}
              className="group flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5 text-left transition hover:border-blue-300 hover:bg-blue-50/40"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#EDF3FF] text-[#0B398F]">
                <Icon size={15} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold text-slate-800">
                  {node.label}
                </span>
                <span className="mt-0.5 block text-[9px] text-slate-500">
                  {node.description}
                </span>
              </span>

              <Plus
                size={14}
                className="shrink-0 text-slate-400 group-hover:text-[#0B398F]"
              />
            </button>
          );
        })}
      </div>

      <div className="mt-auto border-t border-slate-100 p-3">
        <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-2.5">
          <p className="text-[10px] font-semibold text-[#0B398F]">
            Dependencias reales
          </p>
          <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
            Conecta los nodos para definir el orden de ejecución del flujo.
          </p>
        </div>
      </div>
    </aside>
  );
}
