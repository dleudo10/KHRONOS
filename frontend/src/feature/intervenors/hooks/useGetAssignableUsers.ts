import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAssignableUsers } from "../services/members.api";
import { intervenorKeys } from "./queryKeys";
import type { QueryProps } from "../../../types/services.types";

export const useGetAssignableUsers = (
    intervenorId: number,
    { page, pageSize, search, isActive }: QueryProps,
) =>
    useQuery({
        queryKey: intervenorKeys.assignable(intervenorId, {
            page,
            pageSize,
            search,
            isActive,
        }),

        queryFn: ({ signal }) =>
            getAssignableUsers({
                signal,
                params: {
                    page,
                    page_size: pageSize,
                    search: search || undefined,
                    is_active: isActive,
                },
            }),

        placeholderData: keepPreviousData,
        enabled: intervenorId > 0,
    });