const ROOT = "v1/workflows";

/**
 * Única fuente de verdad de las URLs del módulo.
 */
export const ENDPOINTS = {
    // ── Existentes ───────────────────────────────
    list: `${ROOT}/`,
    // summary: `${ROOT}/summary/`,
    update: (id: number) => `${ROOT}/${id}/`,
    details: (id: number) => `${ROOT}/${id}/details`,
    new_version: (id: number) => `${ROOT}/${id}/versions/`
} as const;
