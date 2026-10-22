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
    assignableUsers: () => `v1/application-users/`,

    members: (id: number) => `${ROOT}/${id}/memberships/`,
    add_member: (id: number) => `${ROOT}/${id}/add_member/`,

    member: (id: number, memberId: number) => `${ROOT}/${id}/memberships/${memberId}/`,
    leader: (id: number) => `${ROOT}/${id}/handle_leader/`,
    remove_member: (id: number) => `${ROOT}/${id}/remove_member/`,
} as const;
