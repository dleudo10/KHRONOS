import { http } from "../../../api/http";
import type { ApiResponse, ServiceProps } from "../../../types/services.types";
import type { Intervener, IntervenorPayload, IntervenerResponse, IntervenorsSummary, IntervenerMembershipsResponse } from "../intervenors.types";

export const getSummary = async ({params, signal}: ServiceProps): Promise<ApiResponse<IntervenorsSummary>> => {
    const { data } = await http.get<ApiResponse<IntervenorsSummary>>("v1/intervenors/summary/", { params, signal } );
    console.log("SUMMARY")
    console.log(data)
    return data;
};

export const getIntervenors = async ({params, signal}: ServiceProps): Promise<ApiResponse<IntervenerResponse>> => {
    const { data } = await http.get<ApiResponse<IntervenerResponse>>("v1/intervenors/", { params, signal });
    console.log("OBTENIENDO DATOS")
    console.log(data)
    return data;
}

export const createIntervenors = async (payload: IntervenorPayload): Promise<ApiResponse<Intervener>> => {
    const { data } = await http.post<ApiResponse<Intervener>>("v1/intervenors/", payload)
    console.log("CREANDO DATOS")
    console.log(data)
    return data
}  

export const updateIntervenors = async (id: number, payload: IntervenorPayload): Promise<ApiResponse<Intervener>> => {
    const { data } = await http.patch<ApiResponse<Intervener>>(`v1/intervenors/${id}/`, payload)
    console.log("EDITANDO DATOS")
    console.log(data)
    return data
}  

export const changeIntervenorStatus = async (id: number, isActive: boolean): Promise<ApiResponse<Intervener>> => {
    const { data } = await http.patch<ApiResponse<Intervener>>(`v1/intervenors/${id}/status/`, { is_active: isActive },);
    console.log("ESTADO DE LOS DATOS")
    console.log(data)
    return data;
};

type getIntervenorMembreshipsProps = {
    service: ServiceProps,
    id: number;
}

export const getIntervenorMembreships = async ({service, id}: getIntervenorMembreshipsProps): Promise<ApiResponse<IntervenerMembershipsResponse>> => {
    const { data } = await http.get<ApiResponse<IntervenerMembershipsResponse>>(`v1/intervenors/${id}/memberships/`, { 
        params: service.params, 
        signal: service.signal 
    });
    return data;
}