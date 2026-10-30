/**
 * Claves de React Query. Todo cuelga de `all`, así que
 * `invalidateQueries({ queryKey: intervenorKeys.all })` refresca lista,
 * KPIs, miembros y candidatos de una sola vez.
 */
export const WorkflowKeys = {
    all: ["workflows"] as const,
    list: (filters: object) => [...WorkflowKeys.all, "list", filters] as const,
    details: (id: number) => [...WorkflowKeys.all, id, "details"] as const
};
