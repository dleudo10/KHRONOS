import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeIntervenorStatus } from "../services/intervenors.api";

type ChangeStatusArguments = {
    id: number;
    isActive: boolean;
};

export const useChangeIntervenorStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isActive }: ChangeStatusArguments) =>
            changeIntervenorStatus(id, isActive),

        onSuccess: response => {
            if (response?.success) {
                return queryClient.invalidateQueries({
                    queryKey: ["intervenors"],
                });
            }
        },
    });
};