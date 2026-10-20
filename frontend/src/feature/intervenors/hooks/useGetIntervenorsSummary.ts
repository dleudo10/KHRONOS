import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../services/intervenors.api";
import { intervenorKeys } from "./queryKeys";

export const useGetIntervenorsSummary = () =>
    useQuery({
        queryKey: intervenorKeys.summary(),
        queryFn: ({ signal }) => getSummary({ signal }),
    });
