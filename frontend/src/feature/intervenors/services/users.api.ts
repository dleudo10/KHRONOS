import { olimpoHttp } from "../../../api/olimpoHttp";
import type { ApiResponse, ServiceProps } from "../../../types/services.types";
import type { MemberUser } from "../types/member.types";


export const getOlimpoUsers = async ({ params, signal }: ServiceProps): Promise<ApiResponse<MemberUser>> => {
    const { data } = await olimpoHttp.get<ApiResponse<MemberUser>>("v1/application-users/", { params, signal });
    return data;
};

