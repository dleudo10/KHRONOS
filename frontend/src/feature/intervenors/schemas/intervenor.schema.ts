import { z } from "zod"
import type { Intervener } from "../intervenors.types";

export const IntervenorSchema  = (
    teams: Pick<Intervener, "id" | "code">[],
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
        .regex(
            /^[A-Z0-9_-]+$/,
            "Usa solo letras, números, guion o guion bajo."
        ),

    description: z
        .string()
        .max(500, "Máximo 500 caracteres.")
        .transform(value => value.trim()),

    isActive: z.boolean(),
}).superRefine((values, ctx) => {
    const exists = teams.some(
        item =>
            item.id !== currentId &&
            item.code.trim().toUpperCase() === values.code,
    );

    if (exists) {
        ctx.addIssue({
            code: "custom",
            path: ["code"],
            message: "Ya existe un interventor con este código.",
        });
    }
})

export type IntervenorFormValues = z.infer<
    ReturnType<typeof IntervenorSchema>
>;