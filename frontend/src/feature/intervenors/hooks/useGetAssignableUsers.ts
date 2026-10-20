import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAssignableUsers } from "../services/members.api";
import { intervenorKeys } from "./queryKeys";

/** Usuarios que todavía no pertenecen al interventor (candidatos a asociar). */
export const useGetAssignableUsers = (intervenorId: number, search: string) =>
    useQuery({
        queryKey: intervenorKeys.assignable(intervenorId, search),
        queryFn: ({ signal }) =>
            getAssignableUsers({
                intervenorId,
                signal,
                params: { search: search || undefined },
            }),
        placeholderData: keepPreviousData,
        enabled: intervenorId > 0,
    });
