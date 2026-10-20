import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setLeader } from "../services/members.api";
import { assertSuccess } from "../utils/assertSuccess";
import { intervenorKeys } from "./queryKeys";

/** `mutateAsync(memberId)` nombra líder · `mutateAsync(null)` lo quita. */
export const useSetLeader = (intervenorId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (memberId: number | null) =>
            assertSuccess(await setLeader(intervenorId, { member_id: memberId })),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: intervenorKeys.all }),
    });
};
