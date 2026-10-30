import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkflowKeys } from "./queryKeys";
import { addNewWorkflowVersion } from "../services/workflows.types";

type SaveArguments = {
    id: number;
};

export const useAddNewWorkflowVersion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: SaveArguments) =>
            addNewWorkflowVersion(id),

        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: WorkflowKeys.details(variables.id),
            });
        }
    });
};
