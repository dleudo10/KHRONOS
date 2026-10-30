import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { QueryProps } from "../../../types/services.types";
import { getWorkflows } from "../services/workflows.types";
import { WorkflowKeys } from "./queryKeys";

export const useGetWorkflows = ({ page, pageSize, search, isActive }: QueryProps) =>
    useQuery({
        queryKey: WorkflowKeys.list({ page, pageSize, search, isActive }),
        queryFn: ({ signal }) =>
            getWorkflows({
                params: { page, page_size: pageSize, search, is_active: isActive },
                signal,
            }),
        placeholderData: keepPreviousData,
    }
);
