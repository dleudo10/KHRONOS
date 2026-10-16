
import {
  ArrowLeft,
  // CheckCircle2,
  Play,
  Redo2,
  Save,
  Undo2,
  Upload,
  ShieldCheck,
} from "lucide-react";
// import { Button } from "@/components/ui/button";

interface WorkflowToolbarProps {
  name: string;
  onNameChange: (name: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSimulate: () => void;
  onSave: () => void;
  onValidate: () => void;
  onPublish: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function WorkflowToolbar({
  name,
  onNameChange,
  onUndo,
  onRedo,
  onSimulate,
  onSave,
  onValidate,
  // onPublish,
  canUndo,
  canRedo,
}: WorkflowToolbarProps) {
  return (
    <div className="flex min-h-[54px] shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          // variant="ghost"
          // size="sm"
          className="gap-2 text-[11px] text-slate-600"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={14} />
          Volver
        </button>

        <div className="h-8 w-px bg-slate-200" />

        <div className="min-w-0">
          <input
            aria-label="Nombre del workflow"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            className="block w-full max-w-[260px] truncate bg-transparent text-[11px] font-semibold text-slate-900 outline-none focus:ring-0"
          />
          <p className="mt-0.5 text-[9px] text-slate-500">
            v1.0 — Borrador · grafo dirigido
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          // variant="ghost"
          // size="sm"
          disabled={!canUndo}
          onClick={onUndo}
          className="hidden h-8 gap-1.5 text-[10px] lg:flex"
        >
          <Undo2 size={13} />
          Deshacer
        </button>

        <button
          // variant="ghost"
          // size="sm"
          disabled={!canRedo}
          onClick={onRedo}
          className="hidden h-8 gap-1.5 text-[10px] lg:flex"
        >
          <Redo2 size={13} />
          Rehacer
        </button>

        <button
          // variant="outline"
          // size="sm"
          onClick={onSimulate}
          className="h-9 gap-1.5 text-[10px]"
        >
          <Play size={13} />
          Simular
        </button>

        <button
          // variant="outline"
          // size="sm"
          onClick={onSave}
          className="h-9 gap-1.5 text-[10px]"
        >
          <Save size={13} />
          Guardar
        </button>

        <button
          // variant="outline"
          // size="sm"
          onClick={onValidate}
          className="h-9 gap-1.5 text-[10px]"
        >
          <ShieldCheck size={13} />
          Validar
        </button>

        <button
          // size="sm"
          // onClick={onPublish}
          className="h-9 gap-1.5 bg-[#0B398F] text-[10px] hover:bg-[#082D70]"
        >
          <Upload size={13} />
          Publicar
        </button>
      </div>
    </div>
  );
}
