import type { PaginatedResponse } from "../../../types/services.types";

/** Interventor (equipo) tal como lo devuelve `GET v1/intervenors/`. */
export type Intervenor = {
    id: number;
    name: string;
    code: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    leader: string | null;
    total_users: number;
    pending: number;
    average: string;
    sla: number | null;
    compliance: number | null;
};

export type IntervenorsResponse = PaginatedResponse<Intervenor>;

/** Cuerpo de POST / PATCH de un interventor. */
export type IntervenorPayload = {
    name: string;
    code: string;
    description: string;
    is_active?: boolean;
};

/** KPIs globales: `GET v1/intervenors/summary/`. */
export type IntervenorsSummary = {
    total_intervenors: number;
    active_intervenors: number;
    total_users: number;
    intervenors_without_leader: number;
};

export type IntervenorStatusFilter = "all" | "active" | "inactive";
export type IntervenorView = "cards" | "list";
