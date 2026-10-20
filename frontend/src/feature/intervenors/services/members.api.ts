import { http } from "../../../api/http";
import type { ApiResponse, ServiceProps } from "../../../types/services.types";
import type { Intervenor } from "../types/intervenor.types";
import type {
    AddMemberPayload,
    AssignableUsersResponse,
    IntervenorMember,
    MembersResponse,
    SetLeaderPayload,
} from "../types/member.types";
import { ENDPOINTS } from "./endpoints";

type MembersRequest = ServiceProps & { intervenorId: number };

// ── Lectura ───────────────────────────────────────────────

export const getMembers = async ({ intervenorId, params, signal }: MembersRequest): Promise<ApiResponse<MembersResponse>> => {
    const { data } = await http.get<ApiResponse<MembersResponse>>(ENDPOINTS.members(intervenorId), { params, signal });
    return data;
};

export const getAssignableUsers = async ({ intervenorId, params, signal }: MembersRequest): Promise<ApiResponse<AssignableUsersResponse>> => {
    const { data } = await http.get<ApiResponse<AssignableUsersResponse>>(ENDPOINTS.assignableUsers(intervenorId), { params, signal });
    return data;
};

// ── Escritura (los 3 endpoints nuevos) ───────────────────

/** 1. Agregar un miembro (opcionalmente como líder). */
export const addMember = async (intervenorId: number, payload: AddMemberPayload): Promise<ApiResponse<IntervenorMember>> => {
    const { data } = await http.post<ApiResponse<IntervenorMember>>(ENDPOINTS.members(intervenorId), payload);
    return data;
};

/** 2. Nombrar líder (`member_id`) o dejar el equipo sin líder (`null`). */
export const setLeader = async (intervenorId: number, payload: SetLeaderPayload): Promise<ApiResponse<Intervenor>> => {
    const { data } = await http.patch<ApiResponse<Intervenor>>(ENDPOINTS.leader(intervenorId), payload);
    return data;
};

/** 3. Quitar un miembro del interventor. */
export const removeMember = async (intervenorId: number, memberId: number): Promise<ApiResponse<null>> => {
    const { data } = await http.delete<ApiResponse<null>>(ENDPOINTS.member(intervenorId, memberId));
    return data;
};
