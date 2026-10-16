Para construir una vista como la de tu imagen en React + TypeScript, te recomiendo usar una librería especializada en grafos de nodos, complementarla con una librería de componentes visuales y conectar el estado del flujo con tu backend mediante una API REST.

La pantalla que muestras es un Workflow Builder visual para procesos hospitalarios. No es solamente un diagrama: permite crear tareas, conectar dependencias, configurar responsables, establecer SLA, simular procesos y guardar o publicar versiones.

1. Stack tecnológico recomendado
Visual Flow | React Flow Ready to Use templates | React Flow Examples | VisualFlow
1. React Flow (@xyflow/react)

Esencial
Es la pieza principal. Permite crear nodos personalizados, conexiones entre tareas, puntos de entrada y salida, zoom, desplazamiento, selección de nodos y minimapa.

Ideal para: canvas central, conexiones curvas, nodos de tareas, condiciones, uniones y finales.

Documentación oficial  · 
Ejemplos 

Shadcn, Tutoriel video React | Grafikart
2. Tailwind CSS + shadcn/ui

Para construir la barra lateral, cabecera, botones, panel de configuración, selectores, formularios, menús y ventanas modales con un estilo similar a la imagen.

Alternativa: Mantine o Ant Design si prefieres una biblioteca de componentes más integrada.

shadcn/ui  · 
Tailwind CSS 

TanStack Query DevTools – Get this Extension for 🦊 Firefox (en-US)
3. TanStack Query

Gestiona la comunicación con el backend: consultar workflows, guardar cambios, publicar versiones, manejar estados de carga y reintentar solicitudes cuando corresponda.

Documentación oficial 

⚡️ Tip: Use Zod with React Hook Form!

Make your React Native forms even better with TypeScript schema validation.

It's super easy to integrate - have you tried the combination in your app? | Simon Grimm | 34 comments
4. React Hook Form + Zod

Para el formulario de la derecha: nombre, descripción, interventor, SLA, advertencia, prioridad y dependencias. Valida los datos antes de enviarlos y presenta errores comprensibles.

React Hook Form  · 
Zod 

2. Librerías según cada funcionalidad de la pantalla
Esta sería mi selección para implementar cada zona de tu diseño:

Funcionalidad

Herramienta recomendada

Canvas con nodos y conexiones

@xyflow/react

Nodos personalizados de tarea, condición y unión

React Flow + componentes React

Posicionamiento automático de nodos

@dagrejs/dagre o elkjs

Panel lateral y formularios

shadcn/ui + React Hook Form

Validación de formularios

Zod

Estado del grafo y selección de nodos

Zustand

Consultas y mutaciones al backend

TanStack Query

Peticiones HTTP

fetch o Axios

Simulación visual del workflow

Estado propio + motor de ejecución del backend

Pruebas de componentes y flujos

Vitest + React Testing Library + Playwright

Enlaces para las herramientas más importantes:

React Flow 

Zustand 

Axios 

React Hook Form 

Ejemplo de layout automático con Dagre 

Mi recomendación: empieza con React Flow, Zustand, shadcn/ui, React Hook Form, Zod y TanStack Query. No necesitas instalar diez librerías para construir la primera versión.

3. Arquitectura recomendada: frontend y backend
Frontend — React + TypeScript

Canvas · Nodos · Panel de configuración · Validaciones

API REST — JSON + HTTP

GET · POST · PUT/PATCH · Validación · Autorización

Backend — NestJS o tu backend actual

Reglas de negocio · Dependencias · Versiones · Simulación

Base de datos — PostgreSQL

Workflows · Nodos · Conexiones · Versiones · Ejecuciones

El frontend debe encargarse de la interacción visual. El backend debe validar las reglas del workflow, verificar permisos y guardar los datos persistentes.

Si estás empezando el backend desde cero, una opción sólida es NestJS + Prisma + PostgreSQL. Si ya tienes un backend desarrollado en .NET, Java, Django, Laravel u otra tecnología, puedes conservarlo: React Flow no exige un backend específico.

4. Cómo representar los nodos y las conexiones
React Flow ya trabaja con una estructura de nodos y aristas (edges). Puedes extenderla con propiedades de negocio.

Por ejemplo, un nodo de tarea como “Retiro de dispositivos” podría tener esta estructura:

ts
export type WorkflowNodeData = {
  name: string;
  description?: string;
  type: "start" | "task" | "condition" | "split" | "join" | "end";
  assignee?: string;
  slaMinutes?: number;
  warningPercent?: number;
  priority?: "low" | "normal" | "high" | "critical";
  dependencyIds?: string[];
};

export type WorkflowDefinition = {
  id: string;
  name: string;
  version: number;
  status: "draft" | "published";
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

import type { Node, Edge } from "@xyflow/react";

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;
Así puedes representar tareas como “Plan de egreso”, “Facturación”, “Gestión de copago” y “Retiro de dispositivos”, cada una con su propia configuración.

Las conexiones se almacenan como aristas:

ts
const edges: WorkflowEdge[] = [
  {
    id: "e-facturacion-retiro",
    source: "facturacion",
    target: "retiro-dispositivos",
    type: "smoothstep",
    animated: false,
  },
];
El atributo source indica el nodo de origen y target el nodo de destino. Es importante que los IDs sean estables y que el backend valide que los nodos referenciados existan.

5. Cómo enviar los datos al backend
Puedes organizar las operaciones del frontend en un servicio dedicado, separado de los componentes visuales.

Por ejemplo, con Axios:

bash
npm install axios @tanstack/react-query zustand
npm install @xyflow/react
npm install react-hook-form zod @hookform/resolvers
Crea un cliente HTTP:

ts
// src/services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
Define las operaciones del workflow:

ts
// src/services/workflows.ts
import { api } from "./api";
import type { WorkflowDefinition } from "../types/workflow";

export async function getWorkflow(id: string) {
  const { data } = await api.get<WorkflowDefinition>(
    `/workflows/${id}`
  );

  return data;
}

export async function saveWorkflow(
  workflow: WorkflowDefinition
) {
  const { data } = await api.put<WorkflowDefinition>(
    `/workflows/${workflow.id}`,
    workflow
  );

  return data;
}

export async function publishWorkflow(id: string) {
  const { data } = await api.post(
    `/workflows/${id}/publish`
  );

  return data;
}
Configura la URL en tu archivo .env:

env
VITE_API_URL=http://localhost:3000/api
En producción, utiliza la URL correspondiente a tu API y configura la autenticación, CORS y permisos de acceso.

Guardar desde un botón
Con TanStack Query, puedes gestionar el guardado y los errores de la petición:

tsx
import { useMutation } from "@tanstack/react-query";
import { saveWorkflow } from "./services/workflows";

function SaveButton({ workflow }: {
  workflow: WorkflowDefinition;
}) {
  const mutation = useMutation({
    mutationFn: () => saveWorkflow(workflow),
    onSuccess: () => {
      // Mostrar notificación de guardado exitoso
    },
    onError: () => {
      // Mostrar error y permitir reintentar
    },
  });

  return (
    <button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {mutation.isPending ? "Guardando..." : "Guardar"}
    </button>
  );
}
En la aplicación real, workflow debe provenir del estado actual del editor, incluidos los nodos, sus posiciones, las conexiones y la configuración modificada. También conviene bloquear la publicación mientras existan errores de validación.

6. Qué endpoints debería tener tu backend
Para replicar las acciones de la parte superior de tu pantalla, puedes diseñar una API con este contrato:

Método

Endpoint

Función

GET

/api/workflows/:id

Cargar el workflow

PUT

/api/workflows/:id

Guardar el borrador completo

POST

/api/workflows

Crear un workflow

POST

/api/workflows/:id/validate

Validar nodos y dependencias

POST

/api/workflows/:id/simulate

Ejecutar una simulación

POST

/api/workflows/:id/publish

Publicar una versión

GET

/api/workflows/:id/versions

Consultar el historial

POST

/api/workflows/:id/versions/:version/restore

Restaurar una versión

Estos endpoints son una propuesta de diseño, no servicios que ya existan.

Un detalle importante para tu caso: guardar, validar, simular y publicar deben ser operaciones diferentes. Guardar no debería publicar automáticamente un workflow, y publicar debería crear una versión identificable y validada.

7. Cómo implementaría la interacción del editor
Seleccionar un nodo

El usuario selecciona una tarea en el canvas. Zustand guarda el ID del nodo seleccionado y el panel derecho muestra su configuración.

Editar una tarea

El formulario modifica el nombre, responsable, SLA, prioridad y dependencias. Los cambios se reflejan en el nodo y marcan el borrador como modificado.

Conectar nodos

React Flow permite crear conexiones arrastrando desde un puerto hasta otro. Debes comprobar que no haya referencias inválidas, ciclos prohibidos o dependencias incompatibles con tus reglas de negocio.

Validar y publicar

El frontend puede mostrar errores inmediatos, pero el backend debe volver a validar el workflow antes de publicar la versión.

Para procesos hospitalarios, también recomiendo registrar quién modificó o publicó cada versión, mantener un historial auditable y verificar en el servidor los permisos de cada usuario.

8. Estructura de carpetas sugerida
text
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   ├── workflow/
│   │   ├── WorkflowCanvas.tsx
│   │   ├── WorkflowToolbar.tsx
│   │   ├── WorkflowNode.tsx
│   │   ├── NodePalette.tsx
│   │   └── TaskConfigPanel.tsx
│   └── ui/
├── hooks/
│   ├── useWorkflow.ts
│   └── useSaveWorkflow.ts
├── services/
│   ├── api.ts
│   └── workflows.ts
├── stores/
│   └── workflowStore.ts
├── schemas/
│   └── workflowSchema.ts
├── types/
│   └── workflow.ts
└── pages/
    └── WorkflowBuilderPage.tsx
Mi elección final
Para construir una interfaz muy parecida a la imagen, con capacidad real de edición y persistencia, utilizaría:

React Flow: editor visual.

Tailwind CSS + shadcn/ui: diseño de la interfaz.

Zustand: estado de edición del grafo.

React Hook Form + Zod: configuración y validaciones.

TanStack Query + Axios: comunicación con la API.

NestJS + Prisma + PostgreSQL: si necesitas desarrollar el backend desde cero.

Hay una última decisión importante para definir la arquitectura: ¿ya tienes un backend desarrollado o también necesitas construirlo?


Dijiste:
Creame un comando para instalar todas las herramientas en react y ts menos tailwind css

ChatGPT dijo:
Si ya tienes tu proyecto en React + TypeScript con Vite, ejecuta este comando para instalar todas las herramientas recomendadas, excepto Tailwind CSS:

Escritura


npm install @xyflow/react zustand @tanstack/react-query axios react-hook-form zod @hookform/resolvers lucide-react @dagrejs/dagre

Incluye:

@xyflow/react: canvas de nodos y conexiones del workflow.

zustand: estado global del editor.

@tanstack/react-query: consultas y mutaciones al backend.

axios: peticiones HTTP.

react-hook-form: formularios de configuración.

zod: validación de datos.

@hookform/resolvers: integración de Zod con React Hook Form.

lucide-react: iconos de la interfaz.

@dagrejs/dagre: distribución automática de nodos.

Instala también las herramientas de desarrollo
Escritura


npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom playwright @playwright/test

Esto te proporciona herramientas para pruebas unitarias, pruebas de componentes y pruebas automatizadas del navegador.

Configuración inicial de React Query
Envuelve tu aplicación con QueryClientProvider en src/main.tsx:

tsx
import React from "react";
import ReactDOM from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import App from "./App";
import "@xyflow/react/dist/style.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
Importante: este comando no instala shadcn/ui, porque requiere una inicialización adicional. Cuando quieras configurar los componentes visuales, ejecuta:

bash
npx shadcn@latest init
Con esto tendrás la base para comenzar a construir tu Workflow Builder y conectarlo a tu backend.


Dijiste:
Ahora dame un ejemplo de uso de cada una de las herramientas

ChatGPT dijo:
Vamos a usar un mismo ejemplo basado en tu pantalla de Workflow Builder para alta hospitalaria, con React + TypeScript y sin Tailwind CSS.

La idea es que veas cómo se utiliza cada librería dentro de una aplicación real: crear nodos, conectarlos, seleccionar una tarea, editar sus propiedades, validar los datos y enviarlos al backend.

1. React Flow — el editor visual de workflows
Es la herramienta principal. Se encarga de dibujar las tareas y permitir que el usuario las conecte.

Crea src/components/workflow/WorkflowCanvas.tsx:

tsx
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "inicio",
    position: { x: 50, y: 100 },
    data: { label: "Alta médica" },
    type: "input",
  },
  {
    id: "facturacion",
    position: { x: 300, y: 100 },
    data: { label: "Facturación" },
  },
  {
    id: "retiro",
    position: { x: 550, y: 100 },
    data: { label: "Retiro de dispositivos" },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1",
    source: "inicio",
    target: "facturacion",
  },
  {
    id: "e2",
    source: "facturacion",
    target: "retiro",
  },
];

export default function WorkflowCanvas() {
  return (
    <div style={{ width: "100%", height: 500 }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
Con esto tienes un canvas con tres nodos, conexiones, zoom y minimapa. Para permitir editar nodos y crear conexiones nuevas, después conectarás useNodesState, useEdgesState y onConnect.

Documentación: 
React Flow .

2. Zustand — estado global del editor
Permite compartir el workflow y el nodo seleccionado entre el canvas y el panel de configuración, sin pasar demasiadas propiedades entre componentes.

Crea src/stores/workflowStore.ts:

tsx
import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";

type WorkflowState = {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectNode: (id: string | null) => void;
  setGraph: (nodes: Node[], edges: Edge[]) => void;
};

export const useWorkflowStore = create<WorkflowState>(
  (set) => ({
    nodes: [],
    edges: [],
    selectedNodeId: null,

    selectNode: (id) => set({ selectedNodeId: id }),

    setGraph: (nodes, edges) =>
      set({ nodes, edges }),
  })
);
Uso desde cualquier componente:

tsx
const selectedNodeId = useWorkflowStore(
  (state) => state.selectedNodeId
);

const selectNode = useWorkflowStore(
  (state) => state.selectNode
);

selectNode("retiro");
Cuando el usuario selecciona un nodo en React Flow, actualizas selectedNodeId. El panel derecho puede utilizar ese ID para mostrar la configuración correcta.

Documentación: 
Zustand .

3. Axios — comunicarse con el backend
Axios envía peticiones HTTP a tu API para cargar, guardar o publicar el workflow.

Crea src/services/api.ts:

tsx
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
En .env:

env
VITE_API_URL=http://localhost:3000/api
Crea src/services/workflows.ts:

tsx
import { api } from "./api";

export async function getWorkflow(id: string) {
  const response = await api.get(`/workflows/${id}`);
  return response.data;
}

export async function saveWorkflow(
  id: string,
  workflow: unknown
) {
  const response = await api.put(
    `/workflows/${id}`,
    workflow
  );

  return response.data;
}
Por ejemplo, saveWorkflow envía los nodos, conexiones y configuraciones al endpoint de tu backend.

Importante: unknown sirve aquí para simplificar el ejemplo. En tu proyecto, reemplázalo por un tipo WorkflowDefinition para verificar los datos en TypeScript.

Documentación: 
Axios .

4. TanStack Query — cargar y guardar datos
Axios hace la petición; TanStack Query administra la carga, el resultado, los errores y las mutaciones.

Crea src/hooks/useWorkflow.ts:

tsx
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getWorkflow,
  saveWorkflow,
} from "../services/workflows";

export function useWorkflow(id: string) {
  return useQuery({
    queryKey: ["workflow", id],
    queryFn: () => getWorkflow(id),
  });
}

export function useSaveWorkflow(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workflow: unknown) =>
      saveWorkflow(id, workflow),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workflow", id],
      });
    },
  });
}
Uso dentro de una página:

tsx
const { data, isPending, error } =
  useWorkflow("alta-hospitalaria");

const saveMutation = useSaveWorkflow(
  "alta-hospitalaria"
);

if (isPending) return <p>Cargando workflow...</p>;
if (error) return <p>Error al cargar el workflow</p>;

return (
  <button
    disabled={saveMutation.isPending}
    onClick={() => saveMutation.mutate(data)}
  >
    {saveMutation.isPending ? "Guardando..." : "Guardar"}
  </button>
);
Este ejemplo vuelve a guardar los datos cargados; cuando conectes el editor, debes enviar el estado actualizado de Zustand, no solamente data.

Documentación: 
TanStack Query .

5. React Hook Form — formulario de configuración de tareas
Lo utilizarás para el panel derecho de tu imagen, donde se editan nombre, descripción, responsable y SLA.

tsx
import { useForm } from "react-hook-form";

type TaskForm = {
  name: string;
  description: string;
  assignee: string;
  slaMinutes: number;
};

export function TaskFormPanel() {
  const { register, handleSubmit } = useForm<TaskForm>({
    defaultValues: {
      name: "Retiro de dispositivos",
      description: "Retiro de dispositivos y curaciones",
      assignee: "Enfermería",
      slaMinutes: 20,
    },
  });

  const onSubmit = (values: TaskForm) => {
    console.log("Configuración actualizada:", values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Nombre</label>
      <input {...register("name")} />

      <label>Descripción</label>
      <textarea {...register("description")} />

      <label>Interventor</label>
      <select {...register("assignee")}>
        <option value="Enfermería">Enfermería</option>
        <option value="Facturación">Facturación</option>
      </select>

      <label>SLA (minutos)</label>
      <input
        type="number"
        {...register("slaMinutes", {
          valueAsNumber: true,
        })}
      />

      <button type="submit">Guardar tarea</button>
    </form>
  );
}
Este formulario recopila los datos, pero todavía no los envía al backend. Puedes combinar handleSubmit con la mutación de TanStack Query o actualizar el estado del nodo seleccionado.

Documentación: 
React Hook Form .

6. Zod — validar los datos antes de guardarlos
No quieres permitir que una tarea se guarde con un nombre vacío o un SLA negativo.

Crea src/schemas/taskSchema.ts:

tsx
import { z } from "zod";

export const taskSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string(),
  assignee: z.string().min(1, "Selecciona un responsable"),
  slaMinutes: z.number()
    .int("Debe ser un número entero")
    .positive("El SLA debe ser mayor que cero"),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
Uso directo:

tsx
const result = taskSchema.safeParse({
  name: "Retiro de dispositivos",
  description: "Retiro y curaciones",
  assignee: "Enfermería",
  slaMinutes: 20,
});

if (result.success) {
  console.log("Datos válidos:", result.data);
} else {
  console.error("Errores:", result.error.issues);
}
safeParse permite validar sin lanzar una excepción. Recuerda que el backend también debe validar los datos: las validaciones del navegador se pueden eludir.

Documentación: 
Zod .

7. @hookform/resolvers — conectar Zod con el formulario
En vez de validar manualmente cada campo, el resolver integra Zod con React Hook Form.

tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  taskSchema,
  type TaskFormValues,
} from "../schemas/taskSchema";

export function ValidatedTaskForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      description: "",
      assignee: "",
      slaMinutes: 20,
    },
  });

  const onSubmit = (values: TaskFormValues) => {
    console.log("Formulario válido:", values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Nombre</label>
      <input {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}

      <label>Responsable</label>
      <input {...register("assignee")} />
      {errors.assignee && (
        <p>{errors.assignee.message}</p>
      )}

      <label>SLA</label>
      <input
        type="number"
        {...register("slaMinutes", {
          valueAsNumber: true,
        })}
      />
      {errors.slaMinutes && (
        <p>{errors.slaMinutes.message}</p>
      )}

      <label>Descripción</label>
      <textarea {...register("description")} />

      <button type="submit">Guardar</button>
    </form>
  );
}
Ahora el formulario impide el envío si los datos no pasan el esquema de Zod y muestra los mensajes de error correspondientes.

Documentación: 
Resolvers .

8. Lucide React — iconos de la interfaz
Esta librería te ayuda a reproducir los iconos de la barra lateral y las acciones de tu Workflow Builder.

tsx
import {
  Save,
  Play,
  CheckCircle,
  GitBranch,
  Bell,
  Settings,
} from "lucide-react";

export function WorkflowToolbar() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <button>
        <Play size={16} /> Simular
      </button>

      <button>
        <Save size={16} /> Guardar
      </button>

      <button>
        <CheckCircle size={16} /> Validar
      </button>

      <button>
        <GitBranch size={16} /> Dependencias
      </button>

      <button aria-label="Notificaciones">
        <Bell size={18} />
      </button>

      <button aria-label="Configuración">
        <Settings size={18} />
      </button>
    </div>
  );
}
Los botones son solo visuales hasta que les asignes funciones onClick.

Documentación: 
Lucide React .

9. Dagre — organizar automáticamente los nodos
Cuando tengas muchas tareas, posicionarlas manualmente se vuelve complicado. Dagre calcula una distribución de nodos y conexiones en forma de grafo dirigido.

Crea src/utils/layoutWorkflow.ts:

tsx
import dagre from "@dagrejs/dagre";
import type { Node, Edge } from "@xyflow/react";

const NODE_WIDTH = 180;
const NODE_HEIGHT = 90;

export function layoutWorkflow(
  nodes: Node[],
  edges: Edge[]
) {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "LR",
    nodesep: 40,
    ranksep: 70,
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const position = graph.node(node.id);

    return {
      ...node,
      position: {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}
Uso:

tsx
const layouted = layoutWorkflow(nodes, edges);

setNodes(layouted.nodes);
setEdges(layouted.edges);
Aquí setNodes y setEdges deben provenir del estado real del editor, por ejemplo de useNodesState y useEdgesState. En el ejemplo, LR significa que el flujo avanza de izquierda a derecha.

Documentación: 
Dagre .

10. Vitest — pruebas unitarias
Vitest permite verificar que las funciones de tu aplicación se comporten correctamente.

Por ejemplo, crea src/utils/taskSchema.test.ts:

tsx
import { describe, it, expect } from "vitest";
import { taskSchema } from "../schemas/taskSchema";

describe("taskSchema", () => {
  it("acepta una tarea válida", () => {
    const result = taskSchema.safeParse({
      name: "Facturación",
      description: "Cerrar cuenta hospitalaria",
      assignee: "Facturación",
      slaMinutes: 20,
    });

    expect(result.success).toBe(true);
  });

  it("rechaza un SLA negativo", () => {
    const result = taskSchema.safeParse({
      name: "Facturación",
      description: "",
      assignee: "Facturación",
      slaMinutes: -5,
    });

    expect(result.success).toBe(false);
  });
});
En vite.config.ts, agrega la configuración de pruebas:

tsx
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
En package.json, agrega:

json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
Ejecuta las pruebas con:

bash
npm run test:run
Documentación: 
Vitest .

11. Testing Library — probar componentes React
@testing-library/react permite probar la interfaz como la usaría una persona.

Crea src/test/setup.ts:

tsx
import "@testing-library/jest-dom/vitest";
Crea src/components/workflow/TaskFormPanel.test.tsx:

tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TaskFormPanel } from "./TaskFormPanel";

describe("TaskFormPanel", () => {
  it("muestra el campo de nombre", () => {
    render(<TaskFormPanel />);

    expect(
      screen.getByLabelText("Nombre")
    ).toBeInTheDocument();
  });
});
Para que esta prueba funcione, el input debe estar asociado correctamente a su etiqueta, por ejemplo, mediante htmlFor e id.

Documentación: 
React Testing Library .

12. jest-dom — comprobar elementos de la interfaz
Aunque el paquete se llama jest-dom, también funciona con Vitest si utilizas la importación adecuada.

Ya lo hemos configurado en src/test/setup.ts:

tsx
import "@testing-library/jest-dom/vitest";
Esto permite utilizar comprobaciones como:

tsx
expect(button).toBeInTheDocument();
expect(button).toBeDisabled();
expect(input).toHaveValue("Facturación");
expect(message).toHaveTextContent("El nombre es obligatorio");
Son útiles para comprobar errores de validación, botones deshabilitados mientras se guarda y mensajes de confirmación.

Documentación: 
jest-dom .

13. user-event — simular interacciones de usuario
Esta librería permite probar cómo una persona escribe, selecciona opciones y pulsa botones.

Por ejemplo, para probar el formulario de una tarea:

tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { TaskFormPanel } from "./TaskFormPanel";

it("permite modificar el nombre de una tarea", async () => {
  const user = userEvent.setup();

  render(<TaskFormPanel />);

  const input = screen.getByLabelText("Nombre");

  await user.clear(input);
  await user.type(input, "Validar copago");

  expect(input).toHaveValue("Validar copago");
});
Este ejemplo verifica el comportamiento del formulario en el navegador simulado, sin necesidad de levantar un backend real.

Documentación: 
user-event .

14. jsdom — simular el navegador para las pruebas
jsdom crea un entorno de navegador simulado para ejecutar pruebas de componentes React con Vitest.

Ya lo utilizamos aquí:

tsx
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
});
Así puedes probar formularios, eventos, elementos HTML y componentes sin abrir Chrome.

Ten presente que jsdom no reproduce todas las funciones de un navegador real. Para comprobar el arrastre de nodos, el zoom y las conexiones visuales de React Flow, conviene complementar estas pruebas con Playwright.

Documentación: 
jsdom .

15. Playwright — pruebas de extremo a extremo
Playwright abre un navegador real y permite comprobar que todo el flujo funcione, desde que el usuario abre la pantalla hasta que guarda una tarea.

Crea tests/workflow.spec.ts:

tsx
import { test, expect } from "@playwright/test";

test("muestra el editor de workflows", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await expect(
    page.getByText("Workflow Builder")
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: /guardar/i })
  ).toBeVisible();
});
En package.json, añade:

json
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
Instala los navegadores necesarios:

bash
npx playwright install
Y ejecuta:

bash
npm run test:e2e
Este ejemplo comprueba que la pantalla y el botón estén visibles. Para probar un guardado real, puedes iniciar el backend de pruebas y comprobar la respuesta de la API.

Documentación: 
Playwright .

16. @playwright/test — organizar y ejecutar pruebas del navegador
Este paquete es el ejecutor de pruebas que utiliza el ejemplo anterior. Incluye test, expect, fixtures del navegador y herramientas para ejecutar las pruebas en distintos navegadores.

Crea playwright.config.ts en la raíz:

tsx
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:5173",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
  },
});
Ahora puedes simplificar el test:

tsx
import { test, expect } from "@playwright/test";

test("abre el Workflow Builder", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getBy