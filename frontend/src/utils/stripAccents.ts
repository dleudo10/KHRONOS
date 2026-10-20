export const stripAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
