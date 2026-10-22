import type { PaginatedResponse } from "../../../types/services.types";

/** Usuario que puede pertenecer a un interventor. */
export type MemberUser = {
    id: number;
    full_name: string;
    email: string;
    external_id: string;
    is_active: boolean;
};

/** Asociación usuario ↔ interventor: `GET v1/intervenors/:id/memberships/`. */
export type IntervenorMember = {
    id: number;
    intervenor: number;
    user: MemberUser;
    is_leader: boolean;
    membership_active: boolean;
    created_at: string;
};

export type MembersResponse = PaginatedResponse<IntervenorMember>;
export type AssignableUsersResponse = PaginatedResponse<MemberUser>;

export type MemberStatusFilter = "all" | "active" | "inactive" | "leader";

/** POST memberships/: agrega un usuario (opcionalmente como líder). */
export type AddMemberPayload = {
    user: string;
    is_leader: boolean;
};

/** PATCH leader/: `member_id` = nuevo líder, `null` = dejar sin líder. */
export type HandleLeader = {
    membership_id: number | null;
    is_leader: boolean
};
