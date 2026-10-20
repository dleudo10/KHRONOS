import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMember } from "../services/members.api";
import { assertSuccess } from "../utils/assertSuccess";
import { intervenorKeys } from "./queryKeys";

export const useRemoveMember = (intervenorId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (memberId: number) =>
            assertSuccess(await removeMember(intervenorId, memberId)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: intervenorKeys.all }),
    });
};
