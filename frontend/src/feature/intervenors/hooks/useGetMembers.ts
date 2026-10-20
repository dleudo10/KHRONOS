import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMembers } from "../services/members.api";
import type { MemberStatusFilter } from "../types/member.types";
import { intervenorKeys } from "./queryKeys";

export type MembersFilters = {
    page: number;
    pageSize: number;
    search: string;
    status: MemberStatusFilter;
};

/** Traduce el filtro de la UI a los query params del backend. */
const statusParams = (status: MemberStatusFilter) => {
    switch (status) {
        case "active":   return { is_active: true };
        case "inactive": return { is_active: false };
        case "leader":   return { is_leader: true };
        default:         return {};
    }
};

export const useGetMembers = (intervenorId: number, filters: MembersFilters) =>
    useQuery({
        queryKey: intervenorKeys.members(intervenorId, filters),
        queryFn: ({ signal }) =>
            getMembers({
                intervenorId,
                signal,
                params: {
                    page: filters.page,
                    page_size: filters.pageSize,
                    search: filters.search || undefined,
                    ...statusParams(filters.status),
                },
            }),
        placeholderData: keepPreviousData,
        enabled: intervenorId > 0,
    });
