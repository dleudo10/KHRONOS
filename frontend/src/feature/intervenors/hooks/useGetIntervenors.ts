import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { QueryProps } from "../../../types/services.types";
import { getIntervenors } from "../services/intervenors.api";
import { intervenorKeys } from "./queryKeys";

export const useGetIntervenors = ({ page, pageSize, search, isActive }: QueryProps) =>
    useQuery({
        queryKey: intervenorKeys.list({ page, pageSize, search, isActive }),
        queryFn: ({ signal }) =>
            getIntervenors({
                params: { page, page_size: pageSize, search, is_active: isActive },
                signal,
            }),
        placeholderData: keepPreviousData,
    });
