
import {
  Settings2,
  Trash2,
  X,
  Clock3,
  Users,
} from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import type { WorkflowNode } from "./workflow-types";

interface WorkflowInspectorProps {
  node: WorkflowNode | null;
  onUpdate: (id: string, changes: Partial<WorkflowNode["data"]>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function WorkflowInspector({
  node,
  onUpdate,
  onDelete,
  onClose,
}: WorkflowInspectorProps) {
  if (!node) {
    return (
      <aside className="flex h-full w-[270px] shrink-0 flex-col items-center justify-center border-l border-slate-200 bg-white px-6 text-center">
        <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <Settings2 size={19} />
        </div>
        <p className="mt-3 text-xs font-medium text-slate-700">
          Configuración del nodo
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
          Selecciona un nodo del lienzo para editar sus propiedades.
        </p>
      </aside>
    );
  }

  const update = (changes: Partial<WorkflowNode["data"]>) =>
    onUpdate(node.id, changes);

  const isTask = node.data.kind === "task";

  return (
    <aside className="flex h-full w-[270px] shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="flex h-[49px] shrink-0 items-center justify-between border-b border-slate-100 px-4">
        <div>
          <h2 className="text-[12px] font-semibold text-slate-900">
            Configuración de {node.data.kind === "task" ? "tarea" : "nodo"}
          </h2>
          <p className="mt-0.5 text-[9px] text-slate-400">
            ID #{node.id}
          </p>
        </div>
        <button
          // variant="ghost"
          // size="icon"
          className="size-7"
          onClick={onClose}
          aria-label="Cerrar panel"
        >
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-slate-600">
            Nombre
          </label>
          <input
            value={node.data.label}
            onChange={(event) => update({ label: event.target.value })}
            className="h-9 text-[11px]"
            maxLength={100}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-slate-600">
            Descripción
          </label>
          <textarea
            value={node.data.description}
            onChange={(event) => update({ description: event.target.value })}
            className="min-h-[72px] resize-y text-[11px]"
            maxLength={500}
          />
        </div>

        {isTask && (
          <>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
                <Users size={12} /> Interventor
              </label>
              {/* <Select
                value={node.data.assignee}
                onValueChange={(value) => update({ assignee: value })}
              >
                <SelectTrigger className="h-9 text-[11px]">
                  <SelectValue placeholder="Seleccionar interventor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enfermería">Enfermería</SelectItem>
                  <SelectItem value="Facturación">Facturación</SelectItem>
                  <SelectItem value="Servicios Generales">Servicios Generales</SelectItem>
                  <SelectItem value="Admisiones">Admisiones</SelectItem>
                </SelectContent>
              </Select> */}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[10px] font-medium text-slate-600">
                  <Clock3 size={11} /> SLA (min)
                </label>
                <input
                  type="number"
                  min={1}
                  value={node.data.sla}
                  onChange={(event) =>
                    update({ sla: Math.max(1, Number(event.target.value) || 1) })
                  }
                  className="h-9 text-[11px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-slate-600">
                  Advertencia (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={node.data.warningPercent}
                  onChange={(event) =>
                    update({
                      warningPercent: Math.min(
                        100,
                        Math.max(1, Number(event.target.value) || 1),
                      ),
                    })
                  }
                  className="h-9 text-[11px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-slate-600">
                Prioridad
              </label>
              {/* <Select
                value={node.data.priority}
                onValueChange={(value) =>
                  update({
                    priority: value as WorkflowNode["data"]["priority"],
                  })
                }
              >
                <SelectTrigger className="h-9 text-[11px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baja">Baja</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Crítica">Crítica</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          </>
        )}

        <div className="border-t border-slate-100 pt-4">
          <p className="text-[11px] font-semibold text-slate-800">
            Dependencias
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            Define cómo se activa este nodo.
          </p>

          <label className="mb-1.5 mt-3 block text-[10px] text-slate-600">
            Política de activación
          </label>

          {/* <Select
            value={node.data.activationPolicy}
            onValueChange={(value) =>
              update({
                activationPolicy: value as "all" | "any",
              })
            }
          >
            <SelectTrigger className="h-9 text-[11px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las dependencias</SelectItem>
              <SelectItem value="any">Cualquier dependencia</SelectItem>
            </SelectContent>
          </Select> */}
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-100 p-3">
        <button
          // variant="outline"
          className="w-full gap-2 border-red-200 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onDelete(node.id)}
          disabled={node.data.kind === "start"}
        >
          <Trash2 size={14} />
          Eliminar nodo
        </button>
      </div>
    </aside>
  );
}
