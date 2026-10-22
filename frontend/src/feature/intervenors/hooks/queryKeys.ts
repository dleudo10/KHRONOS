/**
 * Claves de React Query. Todo cuelga de `all`, así que
 * `invalidateQueries({ queryKey: intervenorKeys.all })` refresca lista,
 * KPIs, miembros y candidatos de una sola vez.
 */
export const intervenorKeys = {
    all: ["intervenors"] as const,
    list: (filters: object) => [...intervenorKeys.all, "list", filters] as const,
    summary: () => [...intervenorKeys.all, "summary"] as const,
    members: (id: number, filters: object) => [...intervenorKeys.all, id, "members", filters] as const,
    assignable: ( id: number,
        filters: {
            page: number;
            pageSize: number;
            search?: string;
            isActive?: boolean;
        }, 
    ) => [...intervenorKeys.all, id, "assignable", filters] as const,
};
