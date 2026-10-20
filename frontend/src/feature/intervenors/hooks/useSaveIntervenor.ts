import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IntervenorPayload } from "../types/intervenor.types";
import { createIntervenor, updateIntervenor } from "../services/intervenors.api";
import { assertSuccess } from "../utils/assertSuccess";
import { intervenorKeys } from "./queryKeys";

type SaveArguments = {
    /** Sin `id` crea; con `id` edita. */
    id?: number;
    payload: IntervenorPayload;
};

export const useSaveIntervenor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: SaveArguments) =>
            assertSuccess(
                id !== undefined
                    ? await updateIntervenor(id, payload)
                    : await createIntervenor(payload),
            ),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: intervenorKeys.all }),
    });
};
