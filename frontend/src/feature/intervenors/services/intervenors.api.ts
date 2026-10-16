import { http } from "../../../api/http";

export const getIntervenors = async () => {
    const { data } = await http.get("v1/intervenors/");
    return data;
}