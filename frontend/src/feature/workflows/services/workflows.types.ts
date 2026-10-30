import { http } from "../../../api/http";
import type { ApiResponse, ServiceProps } from "../../../types/services.types";
import type { Workflow, WorkflowDetails, WorkflowPayload, WorkflowsResponse } from "../types/workflow.types";
import { ENDPOINTS } from "./endpoints";

export const getWorkflows = async ({ params, signal }: ServiceProps): Promise<ApiResponse<WorkflowsResponse>> => {
    const { data } = await http.get<ApiResponse<WorkflowsResponse>>(ENDPOINTS.list, { params, signal });
    return data;
};

export const createWorkflow = async (payload: WorkflowPayload): Promise<ApiResponse<Workflow>> => {
    const { data } = await http.post<ApiResponse<Workflow>>(ENDPOINTS.list, payload);
    console.log(data)
    return data;
};

export const updateWorkflow = async (id: number, payload: WorkflowPayload): Promise<ApiResponse<Workflow>> => {
    const { data } = await http.patch<ApiResponse<Workflow>>(ENDPOINTS.update(id), payload);
    return data;
};

export const detailsWorkflow = async (id: number): Promise<ApiResponse<WorkflowDetails>> => {
    const { data } = await http.get<ApiResponse<WorkflowDetails>>(ENDPOINTS.details(id));
    return data;
};

type addNewVersion = {
    version_number: number;
    status: string;
}

export const addNewWorkflowVersion = async (id: number): Promise<ApiResponse<addNewVersion>> => {
    const { data } = await http.post<ApiResponse<addNewVersion>>(ENDPOINTS.new_version(id));
    return data;
};