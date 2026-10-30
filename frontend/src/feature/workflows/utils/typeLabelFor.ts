export function typeLabelFor(type:"start"|"task"|"condition"|"split"|"join"|"end"){
    return {
        start:"INICIO",
        task:"TAREA",
        condition:"CONDICIÓN",
        split:"DIVISIÓN",
        join:"UNIÓN",
        end:"FIN"
    }[type];
}