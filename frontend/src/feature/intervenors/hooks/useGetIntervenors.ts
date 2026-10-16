import { useQuery } from "@tanstack/react-query"
import { getIntervenors } from "../services/intervenors.api"

export const useGetIntervenors = () => {
    return useQuery({
        queryKey: ["intervenors"],
        queryFn: () => getIntervenors()
    })
}
