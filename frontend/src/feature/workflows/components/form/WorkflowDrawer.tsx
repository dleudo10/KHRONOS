import { useMemo, useState } from 'react'
import type { Workflow } from '../../types/workflow.types';
import { WorkflowSchema, type WorkflowFormValues } from '../../schemas/workflow.schema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Icon from '../../../../components/ui/Icon';
import { suggestCode } from '../../../../utils/suggestCode';
import { fmtDate } from '../../../../utils/fmtDate';
import Button from '../../../../components/ui/Button';

type WorkflowDrawerProps = {
    /** `null` = crear; con valor = editar. */
    workflow: Workflow | null;
    /** workflows ya cargados, para validar código único en el cliente. */
    existing: Workflow[];
    onClose: () => void;
    onSave: (
        values: WorkflowFormValues,
        configure?: boolean
    ) => Promise<void>;
};

const WorkflowDrawer = ({ workflow, existing, onClose, onSave }: WorkflowDrawerProps) => {
    const editing = workflow !== null;
    const [codeTouched, setCodeTouched] = useState(editing);
    const schema = useMemo(() => WorkflowSchema(existing, workflow?.id), [existing, workflow?.id]);
    
    const {
        register, handleSubmit, setValue, watch, setError, control,
        formState: { errors, isSubmitting },
    } = useForm<WorkflowFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: workflow?.name ?? "",
            code: workflow?.code ?? "",
            description: workflow?.description ?? "",
            isActive: workflow?.is_active ?? true,
        },
        mode: "onSubmit",
        reValidateMode: "onChange",
    });
    
    const onSubmit = async (values: WorkflowFormValues, configure = false) => {
        try {
            await onSave(values, configure);
        } catch {
            setError("root.server", {
                type: "server",
                message: "No se pudo guardar el workflow. Inténtalo de nuevo.",
            });
        }
    };

    return (
        <> 
            <div className="drawer-backdrop" onClick={onClose} />
            <form className="drawer workflow-create" onSubmit={handleSubmit((values) => onSubmit(values, false))} noValidate>
                <div className="drawer-head">
                    <div>
                        <span>{editing ? "ACTUALIZAR DEFINICIÓN" : "NUEVA DEFINICIÓN"}</span>
                        <h2>{editing ? workflow.name : "Crear workflow"}</h2>
                    </div>
                            
                    <button className="icon-button" onClick={onClose} >
                        <Icon name="close"/>
                    </button>
                </div>
                        
                <div className="drawer-form">
                    <p>
                        {editing
                            ? "Actualiza la información general del workflow. Los cambios en su definición no modifican las tareas ni las conexiones configuradas en el Builder."
                            : "Define la identidad y los parámetros iniciales del workflow. Después podrás configurar sus tareas, conexiones y reglas de ejecución en el Builder."
                        }
                    </p>
                    <label className={`ivr-field ${errors.name ? "has-error" : ""}`}>
                        Nombre del workflow *
                        <input 
                            {...register("name", {
                                onChange: e => {
                                    if (!codeTouched) {
                                        setValue("code", suggestCode(e.target.value), { shouldValidate: true });
                                    }
                                },
                            })}
                            maxLength={200}
                            placeholder="Alta hospitalaria especializada"
                            autoFocus
                        />
                        {errors.name && <em>{errors.name.message}</em>}
                    </label>
                            
                    <label className={`ivr-field ${errors.code ? "has-error" : ""}`}>
                        Código único *
                        <input
                            {...register("code", { onChange: () => setCodeTouched(true) })}
                            maxLength={20}
                            placeholder="ALTA-ESP"
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
                            placeholder="Coordina el alta y la liberación de cama para servicios especializados."
                        />
                        <span className="ivr-counter">
                            <small>{errors.description?.message ?? "Opcional"}</small>
                            <small>{watch("description").length}/500</small>
                        </span>
                    </label>
                            
                    <label className="ivr-field">
                        Estado inicial

                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <select
                                    name={field.name}
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    value={field.value ? "true" : "false"}
                                    onChange={(e) => {
                                        field.onChange(e.target.value === "true");
                                    }}
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            )}
                        />
                    </label>

                    {errors.root?.server && (
                        <p role="alert" className="form-error">{errors.root.server.message}</p>
                    )}

                    {editing && (
                        <div className="ivr-meta">
                            <div>
                                <span>Creado</span>
                                <strong>{fmtDate(workflow.created_at)}</strong>
                            </div>
                            <div>
                                <span>Última actualización</span>
                                <strong>{fmtDate(workflow.updated_at)}</strong>
                            </div>
                        </div>
                    )}
                            
                </div>
                        
                <div className="drawer-actions">
                    <Button onClick={onClose}>Cancelar</Button>
                    {!editing && (
                        <Button variant="primary" icon="spark" disabled={isSubmitting} onClick={handleSubmit((values) => onSubmit(values, true))}>
                            
                            {isSubmitting ? "Guardando..." : "Crear y Configurar"}
                        </Button>
                    )}
                    <Button variant="primary" icon="plus" disabled={isSubmitting}> 
                        {isSubmitting ? "Guardando..." : editing ? "Guardar cambios" : "Crear workflow"}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default WorkflowDrawer 