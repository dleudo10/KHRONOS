import { http } from "../../../api/http";
import type { ApiResponse, ServiceProps } from "../../../types/services.types";
import type {
    Intervenor,
    IntervenorPayload,
    IntervenorsResponse,
    IntervenorsSummary,
} from "../types/intervenor.types";
import { ENDPOINTS } from "./endpoints";

export const getSummary = async ({ params, signal }: ServiceProps): Promise<ApiResponse<IntervenorsSummary>> => {
    const { data } = await http.get<ApiResponse<IntervenorsSummary>>(ENDPOINTS.summary, { params, signal });
    return data;
};

export const getIntervenors = async ({ params, signal }: ServiceProps): Promise<ApiResponse<IntervenorsResponse>> => {
    const { data } = await http.get<ApiResponse<IntervenorsResponse>>(ENDPOINTS.list, { params, signal });
    return data;
};

export const createIntervenor = async (payload: IntervenorPayload): Promise<ApiResponse<Intervenor>> => {
    const { data } = await http.post<ApiResponse<Intervenor>>(ENDPOINTS.list, payload);
    return data;
};

export const updateIntervenor = async (id: number, payload: IntervenorPayload): Promise<ApiResponse<Intervenor>> => {
    const { data } = await http.patch<ApiResponse<Intervenor>>(ENDPOINTS.detail(id), payload);
    return data;
};

export const changeIntervenorStatus = async (id: number, isActive: boolean): Promise<ApiResponse<Intervenor>> => {
    const { data } = await http.patch<ApiResponse<Intervenor>>(ENDPOINTS.status(id), { is_active: isActive });
    return data;
};
