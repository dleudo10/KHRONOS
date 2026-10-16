import type { Tone } from "../../components/ui/Badge";
type TaskStatus =
    | "Pendiente"
    | "En proceso"
    | "Completada"
    | "Bloqueada"
    | "Vencida"
;

export type Task = {
    bed: string;
    room: string;
    patient: string;
    task: string;
    state: TaskStatus;
    tone: Tone;
    time: string;
    sla: string;
};