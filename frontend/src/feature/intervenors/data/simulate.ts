import { stripAccents } from "../../../utils/stripAccents";
import type { DirectoryUser, TeamMetrics } from "../intervenors.types";

export const DIRECTORY: DirectoryUser[] = ([
  [1,"María López","Coordinador","Mañana"],[2,"Laura Mejía","Auxiliar","Tarde"],[3,"Andrés Restrepo","Auxiliar","Noche"],
  [4,"Carolina Vélez","Coordinador","Mañana"],[5,"Juliana Ospina","Auxiliar","Mañana"],[6,"Sebastián Cano","Operador","Tarde"],
  [7,"Valentina Ríos","Auxiliar","Noche"],[8,"Camilo Zapata","Operador","Mañana"],[9,"Daniela Cárdenas","Auxiliar","Tarde"],
  [10,"Mateo Arango","Operador","Noche"],[11,"Paula Herrera","Auxiliar","Mañana"],[12,"Santiago Giraldo","Operador","Tarde"],
  [13,"Natalia Duque","Auxiliar","Noche"],[14,"Felipe Mora","Coordinador","Mañana"],[15,"Ana Velásquez","Coordinador","Mañana"],
  [16,"Luis Builes","Operador","Tarde"],[17,"Marcela Soto","Auxiliar","Mañana"],[18,"Jhon Quintero","Operador","Noche"],
  [19,"Yesenia Agudelo","Auxiliar","Tarde"],[20,"Ricardo Pineda","Analista","Mañana"],[21,"Esteban Rojas","Operador","Mañana"],
  [22,"Kevin Torres","Operador","Tarde"],[23,"Stiven Marín","Operador","Noche"],[24,"Carlos Páez","Coordinador","Mañana"],
  [25,"Isabela Muñoz","Analista","Mañana"],[26,"Tomás Echeverri","Auxiliar","Tarde"],
] as [number,string,string,string][]).map(([id,name,role,shift]) => {
    const parts = stripAccents(name).toLowerCase().split(" ");
    return { id, name, role, shift, email: `${parts[0]}.${parts[1]}@clinica.co` };
});

export const SEED_METRICS: Record<number, TeamMetrics> = {
  1:{pending:0,average:"—",sla:null}, 
  2:{pending:0,average:"—",sla:null}, 
  3:{pending:0,average:"—",sla:null},
  4:{pending:0,average:"—",sla:null}, 
  5:{pending:0,average:"—",sla:null}, 
  6:{pending:0,average:"—",sla:null},
  7:{pending:0,average:"—",sla:null}, 
  8:{pending:0,average:"—",sla:null}, 
  9:{pending:0,average:"—",sla:null},
};