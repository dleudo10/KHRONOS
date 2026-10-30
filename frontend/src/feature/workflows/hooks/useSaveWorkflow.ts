import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkflowKeys } from "./queryKeys";
import { assertSuccess } from "../../../utils/assertSuccess";
import type { WorkflowPayload } from "../types/workflow.types";
import { createWorkflow, updateWorkflow } from "../services/workflows.types";

type SaveArguments = {
    /** Sin `id` crea; con `id` edita. */
    id?: number;
    payload: WorkflowPayload;
};

export const useSaveWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: SaveArguments) =>
            assertSuccess(
                id !== undefined
                    ? await updateWorkflow(id, payload)
                    : await createWorkflow(payload),
            ),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: WorkflowKeys.all }),
    });
};
