const ROOT = "v1/intervenors";

/**
 * Única fuente de verdad de las URLs del módulo.
 */
export const ENDPOINTS = {
    // ── Existentes ───────────────────────────────
    list: `${ROOT}/`,
    summary: `${ROOT}/summary/`,
    detail: (id: number) => `${ROOT}/${id}/`,
    status: (id: number) => `${ROOT}/${id}/status/`,
    members: (id: number) => `${ROOT}/${id}/memberships/`,

    // ── Pendientes de backend ────────────────────
    /** DELETE: quita un miembro del interventor. */
    member: (id: number, memberId: number) => `${ROOT}/${id}/memberships/${memberId}/`,
    /** PATCH: nombra o quita al líder. */
    leader: (id: number) => `${ROOT}/${id}/leader/`,
    /** GET: usuarios que aún no pertenecen al interventor (para el selector). */
    assignableUsers: (id: number) => `${ROOT}/${id}/assignable-users/`,
} as const;
