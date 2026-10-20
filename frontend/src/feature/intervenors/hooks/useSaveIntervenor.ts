import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IntervenorPayload } from "../intervenors.types";
import { createIntervenors, updateIntervenors } from "../services/intervenors.api";

type SaveArguments = {
    id?: number;
    payload: IntervenorPayload;
};

export const useSaveIntervenor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: SaveArguments) => {
            if (id !== undefined) {
                return updateIntervenors(id, payload);
            }

            return createIntervenors(payload);
        },

        onSuccess: response => {
            if (response?.success) {
                return queryClient.invalidateQueries({
                    queryKey: ["intervenors"],
                });
            }
        },
    });
};
