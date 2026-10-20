import { stripAccents } from "./stripAccents";

export const suggestCode = (name: string) => {
    return stripAccents(name)
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean)
    .slice(0,2)
    .map(w => w.slice(0,3))
    .join("-")
};