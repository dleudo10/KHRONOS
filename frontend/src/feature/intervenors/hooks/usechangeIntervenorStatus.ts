import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeIntervenorStatus } from "../services/intervenors.api";
import { assertSuccess } from "../utils/assertSuccess";
import { intervenorKeys } from "./queryKeys";

type ChangeStatusArguments = {
    id: number;
    isActive: boolean;
};

export const useChangeIntervenorStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, isActive }: ChangeStatusArguments) =>
            assertSuccess(await changeIntervenorStatus(id, isActive)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: intervenorKeys.all }),
    });
};
