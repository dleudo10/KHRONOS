import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setLeader } from "../services/members.api";
import { assertSuccess } from "../utils/assertSuccess";
import { intervenorKeys } from "./queryKeys";
import type { HandleLeader } from "../types/member.types";

/** `mutateAsync(memberId)` nombra líder · `mutateAsync(null)` lo quita. */
export const useSetLeader = (intervenorId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: HandleLeader) =>
            assertSuccess(await setLeader(intervenorId, payload)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: intervenorKeys.all }),
    });
};
