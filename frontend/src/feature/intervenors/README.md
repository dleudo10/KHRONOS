# Módulo Interventores

Gestión de interventores (equipos) y de los usuarios asociados a cada uno.

## Estructura

```
intervenors/
├── index.ts                    # exporta IntervenorsPage
├── constants.ts                # objetivo de tiempo promedio, tamaños de página
├── pages/
│   └── IntervenorsPage.tsx     # orquesta: KPIs + filtros + lista + detalle + drawer de edición
├── types/
│   ├── intervenor.types.ts     # contrato de la API de interventores
│   └── member.types.ts         # contrato de la API de miembros
├── services/                   # solo HTTP, sin React
│   ├── endpoints.ts            # ÚNICO lugar con las URLs
│   ├── intervenors.api.ts
│   └── members.api.ts
├── hooks/
│   ├── queryKeys.ts
│   ├── useGetIntervenors · useGetIntervenorsSummary · useSaveIntervenor · useChangeIntervenorStatus
│   ├── useGetMembers · useGetAssignableUsers · useAddMember · useSetLeader · useRemoveMember
│   └── useDebouncedValue · useEscapeKey · useAnchoredMenu      # utilidades de UI
├── schemas/intervenor.schema.ts
├── utils/                      # fmtDate, slaTone, assertSuccess
└── components/
    ├── summary/   IntervenorKPIs
    ├── list/      IntervenorsToolbar, IntervenorCards, IntervenorList, EmptyIntervenors
    ├── form/      IntervenorDrawer, IntervenorStatusAction
    ├── detail/    IntervenorDetail, MembersPanel, MembersTable, MemberActionsMenu, MemberDrawer, EmptyMembers
    └── shared/    Pagination, Switch
```

Regla de nombres: **Intervenor** = el equipo; **Member** = la asociación usuario ↔ interventor.
La página es dueña de la lista; `MembersPanel` es dueño de todo lo relacionado con miembros.

## Contrato de endpoints

Existentes: `GET v1/intervenors/`, `GET …/summary/`, `POST …/`, `PATCH …/:id/`, `PATCH …/:id/status/`, `GET …/:id/memberships/`.

Todas las respuestas usan el envelope `ApiResponse` (`success`, `message`, `data`). **El DELETE no debe responder 204 vacío**: debe devolver el envelope con `success: true`.

### Los 3 endpoints nuevos

| # | Acción | Método y ruta | Body |
|---|--------|---------------|------|
| 1 | Agregar miembro (opcional: como líder) | `POST v1/intervenors/:id/memberships/` | `{ user_id, is_leader }` |
| 2 | Nombrar líder / quitar líder | `PATCH v1/intervenors/:id/leader/` | `{ member_id }` — `null` deja el equipo sin líder |
| 3 | Quitar miembro | `DELETE v1/intervenors/:id/memberships/:memberId/` | — |

Reglas que debe aplicar el backend: un solo líder por equipo (al nombrar uno nuevo, el anterior deja de serlo en la misma transacción); un miembro no disponible no puede ser líder; quitar al líder deja el equipo sin líder.

### Endpoint adicional necesario

`GET v1/intervenors/:id/assignable-users/?search=` → `PaginatedResponse<MemberUser>` con los usuarios que **aún no** pertenecen al interventor. Lo usa el selector del drawer "Asociar usuario" (antes salía de `DIRECTORY`, una lista simulada).

### Forma que espera el front para `GET …/:id/memberships/`

```json
{ "id": 1, "intervenor": 3, "is_leader": true, "is_active": true, "created_at": "2025-04-02T08:00:00",
  "user": { "id": 7, "name": "María López", "email": "maria.lopez@clinica.co", "role": "Coordinador", "shift": "Mañana" } }
```

Query params: `page`, `page_size`, `search`, `is_active`, `is_leader`.

## Para activar los endpoints

1. Ajustar las rutas en `services/endpoints.ts` si difieren.
2. Nada más: servicios, hooks y UI ya están conectados.
