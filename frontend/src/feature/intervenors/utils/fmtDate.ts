import { MONTHS } from "../data/months";

export const fmtDate = (iso: string) => { 
    const d = new Date(iso); 
    
    return `${String(d.getDate()).padStart(2,"0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; 
};
