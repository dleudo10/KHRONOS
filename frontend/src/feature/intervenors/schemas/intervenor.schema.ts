import { z } from "zod";
import type { Intervenor, IntervenorPayload } from "../types/intervenor.types";

export const IntervenorSchema = (
    existing: Pick<Intervenor, "id" | "code">[],
    currentId?: number,
) => z.object({
    name: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio.")
        .max(200, "Máximo 200 caracteres."),
    code: z
        .string()
        .trim()
        .toUpperCase()
        .min(1, "El código es obligatorio.")
        .min(2, "El código debe tener al menos 2 caracteres.")
        .max(20, "Máximo 20 caracteres.")
        .regex(/^[A-Z0-9_-]+$/, "Usa solo letras, números, guion o guion bajo."),
    description: z
        .string()
        .max(500, "Máximo 500 caracteres.")
        .transform(value => value.trim()),
    isActive: z.boolean(),
}).superRefine((values, ctx) => {
    const exists = existing.some(
        item => item.id !== currentId && item.code.trim().toUpperCase() === values.code,
    );

    if (exists) {
        ctx.addIssue({
            code: "custom",
            path: ["code"],
            message: "Ya existe un interventor con este código.",
        });
    }
});

export type IntervenorFormValues = z.infer<ReturnType<typeof IntervenorSchema>>;

/** Formulario (camelCase) → payload de la API (snake_case). */
export const toIntervenorPayload = (values: IntervenorFormValues): IntervenorPayload => ({
    name: values.name,
    code: values.code,
    description: values.description,
    is_active: values.isActive,
});
