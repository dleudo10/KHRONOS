import { http } from "../../../api/http";
import { olimpoHttp } from "../../../api/olimpoHttp";
import type { ApiResponse, ServiceProps } from "../../../types/services.types";
import type {
    AddMemberPayload,
    AssignableUsersResponse,
    IntervenorMember,
    MembersResponse,
    HandleLeader,
} from "../types/member.types";
import { ENDPOINTS } from "./endpoints";

type MembersRequest = ServiceProps & { intervenorId: number };

// ── OK ───────────────────
export const getAssignableUsers = async ({ params, signal }: ServiceProps): Promise<ApiResponse<AssignableUsersResponse>> => {
    const { data } = await olimpoHttp.get<ApiResponse<AssignableUsersResponse>>(ENDPOINTS.assignableUsers(), { params, signal });
    return data;
};

export const getMembers = async ({ intervenorId, params, signal }: MembersRequest): Promise<ApiResponse<MembersResponse>> => {
    const { data } = await http.get<ApiResponse<MembersResponse>>(ENDPOINTS.members(intervenorId), { params, signal });
    return data;
};

export const addMember = async (intervenorId: number, payload: AddMemberPayload): Promise<ApiResponse<IntervenorMember>> => {
    const { data } = await http.post<ApiResponse<IntervenorMember>>(ENDPOINTS.add_member(intervenorId), payload);
    return data;
};

export const setLeader = async (intervenorId: number, payload: HandleLeader): Promise<ApiResponse<HandleLeader>> => {
    const { data } = await http.post<ApiResponse<HandleLeader>>(ENDPOINTS.leader(intervenorId), payload);
    return data;
};


/** 3. Quitar un miembro del interventor. */
export const removeMember = async (intervenorId: number, membership_id: number): Promise<ApiResponse<null>> => {
    const { data } = await http.post<ApiResponse<null>>(ENDPOINTS.remove_member(intervenorId), {
        membership_id: membership_id
    });
    return data;
};
