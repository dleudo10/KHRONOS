import { useQuery } from "@tanstack/react-query";
import { getIntervenorMembreships } from "../services/intervenors.api";

export const useGetIntervenorMemberships = (id: number) => {
    return useQuery({
        queryKey: ["intervenors", id, "memberships"],
        queryFn: ({ signal }) =>
            getIntervenorMembreships({id, service: { signal },}),
        enabled: id > 0,
    });
};