import type { Tone } from "../../../components/ui/Badge";

export const slaTone = (sla: number | null): Tone => 
    sla === null ? 
    "neutral" : sla >= 92 ? 
    "success" : sla >= 85 ? 
    "info" : sla >= 75 ? 
    "warning" : "danger";
