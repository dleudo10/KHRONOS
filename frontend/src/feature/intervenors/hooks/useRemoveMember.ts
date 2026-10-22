import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMember } from "../services/members.api";
import { assertSuccess } from "../utils/assertSuccess";
import { intervenorKeys } from "./queryKeys";

export const useRemoveMember = (intervenorId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (membership_id: number) =>
            assertSuccess(await removeMember(intervenorId = intervenorId, membership_id = membership_id)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: intervenorKeys.all }),
    });
};
