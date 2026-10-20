import { useState, type FormEvent } from "react";
import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/ui/Icon";
import { initials } from "../../../../utils/initials";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useGetAssignableUsers } from "../../hooks/useGetAssignableUsers";
import type { Intervenor } from "../../types/intervenor.types";
import type { AddMemberPayload } from "../../types/member.types";
import { Switch } from "../shared/Switch";

type MemberDrawerProps = {
    intervenor: Intervenor;
    onClose: () => void;
    onSubmit: (payload: AddMemberPayload) => Promise<void>;
};

export function MemberDrawer({ intervenor, onClose, onSubmit }: MemberDrawerProps) {
    const [search, setSearch] = useState("");
    const [pickedId, setPickedId] = useState<number | null>(null);
    const [isLeader, setIsLeader] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const term = useDebouncedValue(search.trim());
    const { data, isLoading, isError } = useGetAssignableUsers(intervenor.id, term);
    const candidates = data?.data?.results ?? [];

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setServerError(null);

        if (pickedId === null) return;

        setSubmitting(true);
        try {
            await onSubmit({ user_id: pickedId, is_leader: isLeader });
        } catch {
            setServerError("No se pudo asociar el usuario. Inténtalo de nuevo.");
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="drawer-backdrop" onClick={onClose} />
            <aside className="drawer ivr-drawer" role="dialog" aria-modal="true">
                <div className="drawer-head">
                    <div>
                        <span>ASOCIAR USUARIO · {intervenor.code}</span>
                        <h2>{intervenor.name}</h2>
                    </div>

                    <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar">
                        <Icon name="close" />
                    </button>
                </div>

                <form className="ivr-form" onSubmit={handleSubmit} noValidate>
                    <div className="ivr-form-body">
                        <p className="ivr-form-lead">
                            Selecciona el usuario que formará parte de este interventor. Solo se muestran usuarios que aún no pertenecen al equipo.
                        </p>

                        <div className="ivr-field">
                            <span className="ivr-label">Usuario *</span>
                            <div className="search small-search ivr-search">
                                <Icon name="search" />
                                <input
                                    placeholder="Buscar por nombre, correo o rol..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>

                            <div className={`ivr-picker ${submitted && pickedId === null ? "has-error" : ""}`} role="radiogroup">
                                {isLoading && (
                                    <div className="ivr-picker-empty"><span>Cargando usuarios...</span></div>
                                )}

                                {isError && (
                                    <div className="ivr-picker-empty" role="alert">
                                        <Icon name="alert" />
                                        <span>No se pudieron cargar los usuarios.</span>
                                    </div>
                                )}

                                {!isLoading && !isError && candidates.length === 0 && (
                                    <div className="ivr-picker-empty">
                                        <Icon name={term ? "search" : "check"} />
                                        <span>
                                            {term
                                                ? `Ningún usuario coincide con “${term}”.`
                                                : "Todos los usuarios ya pertenecen a este equipo."}
                                        </span>
                                    </div>
                                )}

                                {candidates.map(user => (
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={pickedId === user.id}
                                        key={user.id}
                                        className={pickedId === user.id ? "selected" : ""}
                                        onClick={() => setPickedId(user.id)}
                                    >
                                        <span className="table-avatar">{initials(user.name)}</span>

                                        <div>
                                            <strong>{user.name}</strong>
                                            <small>{user.email} · {user.role} · {user.shift}</small>
                                        </div>

                                        <i className="ivr-radio">
                                            {pickedId === user.id && <Icon name="check" size={12} />}
                                        </i>
                                    </button>
                                ))}
                            </div>

                            {submitted && pickedId === null && (
                                <em className="ivr-error">Selecciona un usuario para continuar.</em>
                            )}
                        </div>

                        <div className="setting-switch ivr-switch">
                            <div>
                                <strong>Es líder del equipo</strong>
                                <span>
                                    {isLeader && intervenor.leader
                                        ? `Reemplazará a ${intervenor.leader} como líder.`
                                        : "Un equipo tiene un solo líder."}
                                </span>
                            </div>

                            <Switch on={isLeader} onChange={setIsLeader} label="Es líder del equipo" />
                        </div>

                        {serverError && <p role="alert" className="form-error">{serverError}</p>}
                    </div>

                    <div className="drawer-actions">
                        <Button onClick={onClose}>Cancelar</Button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            <Icon name="plus" size={16} />
                            <span>{submitting ? "Asociando..." : "Asociar usuario"}</span>
                        </button>
                    </div>
                </form>
            </aside>
        </>
    );
}
