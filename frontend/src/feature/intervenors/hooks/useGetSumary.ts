import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../services/intervenors.api";

export const useGetSummary = () => {
    return useQuery({
        queryKey: ["intervenors", "summary"],
        queryFn: ({ signal }) => getSummary({ signal }),
    });
};