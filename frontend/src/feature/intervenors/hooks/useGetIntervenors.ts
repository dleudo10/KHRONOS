import { useQuery } from "@tanstack/react-query"
import { getIntervenors } from "../services/intervenors.api"
import type { QueryProps } from "../../../types/services.types"

export const useGetIntervenors = ({page, pageSize, search, isActive}: QueryProps) => {
    return useQuery({
        queryKey: ["intervenors", page, pageSize, search, isActive],
        queryFn: ({ signal }) => getIntervenors({ 
            params: {
                page, 
                page_size: pageSize, 
                search: search,
                is_active: isActive,
            },
            signal
        }),
    })
}
