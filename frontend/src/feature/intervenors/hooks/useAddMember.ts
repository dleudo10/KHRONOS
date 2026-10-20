import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMember } from "../services/members.api";
import type { AddMemberPayload } from "../types/member.types";
import { assertSuccess } from "../utils/assertSuccess";
import { intervenorKeys } from "./queryKeys";

export const useAddMember = (intervenorId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: AddMemberPayload) =>
            assertSuccess(await addMember(intervenorId, payload)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: intervenorKeys.all }),
    });
};
