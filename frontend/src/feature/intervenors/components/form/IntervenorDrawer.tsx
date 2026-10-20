import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/ui/Icon";
import { suggestCode } from "../../../../utils/suggestCode";
import { IntervenorSchema, type IntervenorFormValues } from "../../schemas/intervenor.schema";
import type { Intervenor } from "../../types/intervenor.types";
import { fmtDate } from "../../utils/fmtDate";
import { IntervenorStatusAction } from "./IntervenorStatusAction";

type IntervenorDrawerProps = {
    /** `null` = crear; con valor = editar. */
    intervenor: Intervenor | null;
    /** Interventores ya cargados, para validar código único en el cliente. */
    existing: Intervenor[];
    onClose: () => void;
    onSave: (values: IntervenorFormValues) => Promise<void>;
    onChangeStatus?: () => Promise<void>;
    statusLoading?: boolean;
};

export function IntervenorDrawer({ intervenor, existing, onClose, onSave, onChangeStatus, statusLoading }: IntervenorDrawerProps) {
    const editing = intervenor !== null;
    const [codeTouched, setCodeTouched] = useState(editing);

    const schema = useMemo(() => IntervenorSchema(existing, intervenor?.id), [existing, intervenor?.id]);

    const {
        register, handleSubmit, setValue, watch, setError,
        formState: { errors, isSubmitting },
    } = useForm<IntervenorFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: intervenor?.name ?? "",
            code: intervenor?.code ?? "",
            description: intervenor?.description ?? "",
            isActive: intervenor?.is_active ?? true,
        },
        mode: "onSubmit",
        reValidateMode: "onChange",
    });

    const onSubmit = async (values: IntervenorFormValues) => {
        try {
            await onSave(values);
        } catch {
            setError("root.server", {
                type: "server",
                message: "No se pudo guardar el interventor. Inténtalo de nuevo.",
            });
        }
    };

    const handleStatus = async () => {
        try {
            await onChangeStatus?.();
        } catch {
            setError("root.server", {
                type: "server",
                message: "No se pudo cambiar el estado del interventor. Inténtalo de nuevo.",
            });
        }
    };

    return (
        <>
            <div className="drawer-backdrop" onClick={onClose} />
            <aside className="drawer ivr-drawer" role="dialog" aria-modal="true">
                <div className="drawer-head">
                    <div>
                        <span>{editing ? "EDITAR EQUIPO" : "NUEVA DEFINICIÓN"}</span>
                        <h2>{editing ? intervenor.name : "Nuevo interventor"}</h2>
                    </div>

                    <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar">
                        <Icon name="close" />
                    </button>
                </div>

                <form className="ivr-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="ivr-form-body">
                        <p className="ivr-form-lead">
                            {editing
                                ? "Actualiza la identidad del equipo. Los usuarios asociados no se modifican."
                                : "Un interventor es el equipo responsable de una etapa del proceso. Después podrás asociarle usuarios."}
                        </p>

                        <label className={`ivr-field ${errors.name ? "has-error" : ""}`}>
                            Nombre del interventor *
                            <input
                                {...register("name", {
                                    onChange: e => {
                                        if (!codeTouched) {
                                            setValue("code", suggestCode(e.target.value), { shouldValidate: true });
                                        }
                                    },
                                })}
                                maxLength={200}
                                placeholder="Ej. Enfermería"
                                autoFocus
                            />
                            {errors.name && <em>{errors.name.message}</em>}
                        </label>

                        <label className={`ivr-field ${errors.code ? "has-error" : ""}`}>
                            Código único *
                            <input
                                {...register("code", { onChange: () => setCodeTouched(true) })}
                                maxLength={20}
                                placeholder="Ej. ENF"
                                onBlur={e => setValue("code", e.target.value.toUpperCase().trim(), { shouldValidate: true })}
                            />
                            {errors.code
                                ? <em>{errors.code.message}</em>
                                : <small>Identificador corto y único. Se guarda en mayúsculas.</small>}
                        </label>

                        <label className={`ivr-field ${errors.description ? "has-error" : ""}`}>
                            Descripción
                            <textarea
                                {...register("description")}
                                rows={4}
                                maxLength={500}
                                placeholder="Responsabilidad del equipo dentro del proceso (opcional)"
                            />
                            <span className="ivr-counter">
                                <small>{errors.description?.message ?? "Opcional"}</small>
                                <small>{watch("description").length}/500</small>
                            </span>
                        </label>

                        {errors.root?.server && (
                            <p role="alert" className="form-error">{errors.root.server.message}</p>
                        )}

                        {editing && (
                            <div className="ivr-meta">
                                <div>
                                    <span>Creado</span>
                                    <strong>{fmtDate(intervenor.created_at)}</strong>
                                </div>
                                <div>
                                    <span>Última actualización</span>
                                    <strong>{fmtDate(intervenor.updated_at)}</strong>
                                </div>
                            </div>
                        )}

                        {editing && onChangeStatus && (
                            <IntervenorStatusAction
                                isActive={intervenor.is_active}
                                loading={statusLoading}
                                onClick={handleStatus}
                            />
                        )}
                    </div>

                    <div className="drawer-actions">
                        <Button onClick={onClose}>Cancelar</Button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            <Icon name={editing ? "check" : "plus"} size={16} />
                            <span>
                                {isSubmitting ? "Guardando..." : editing ? "Guardar cambios" : "Crear interventor"}
                            </span>
                        </button>
                    </div>
                </form>
            </aside>
        </>
    );
}
