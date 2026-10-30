import { useQuery } from "@tanstack/react-query";
import { detailsWorkflow } from "../services/workflows.types";
import { WorkflowKeys } from "./queryKeys";

export const useDetailsWorkflow = (id: number) =>
    useQuery({
        queryKey: WorkflowKeys.details(id),
        queryFn: () => detailsWorkflow(id),
    }
);
