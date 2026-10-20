import type { Tone } from "../../../components/ui/Badge";

export const slaTone = (sla: number | null): Tone => {
    if (sla === null) return "neutral";
    if (sla >= 92) return "success";
    if (sla >= 85) return "info";
    if (sla >= 75) return "warning";
    return "danger";
};
