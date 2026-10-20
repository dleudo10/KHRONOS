import { useState, type FormEvent } from "react";
import type { DirectoryUser, Intervener } from "../intervenors.types";
import { stripAccents } from "../../../utils/stripAccents";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import { initials } from "../../../utils/initials";
import { Switch } from "./Switch";

type MemberDrawerProps = {
    team: Intervener; 
    candidates: DirectoryUser[]; 
    currentLeader: string | null; 
    onClose: () => void; 
    onAdd: (
        userId: number, 
        isLeader: boolean, 
        isActive: boolean
    ) => void;
}

export function MemberDrawer({ team, candidates, currentLeader, onClose, onAdd }: MemberDrawerProps) {
    const [q, setQ] = useState("");
    const [picked, setPicked] = useState<number | null>(null);
    const [isLeader, setIsLeader] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    const term = stripAccents(q).toLowerCase();

    const list = candidates.filter(u => !term || stripAccents(`${u.name} ${u.email} ${u.role}`).toLowerCase().includes(term));
    const submit = (e: FormEvent) => { 
        e.preventDefault(); 
        setSubmitted(true); 
        
        if (picked === null) return; 
        
        onAdd(picked, isLeader && isActive, isActive); 
    };

    return (
        <>
            <div className="drawer-backdrop" onClick={onClose} />
            <aside className="drawer ivr-drawer" role="dialog" aria-modal="true">
                <div className="drawer-head">
                    <div>
                        <span>ASOCIAR USUARIO · {team.code}</span>
                        <h2>{team.name}</h2>
                    </div>
                    
                    <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar">
                        <Icon name="close"/>
                    </button>
                </div>

                <form className="ivr-form" onSubmit={submit} noValidate>
                    <div className="ivr-form-body">
                        <p className="ivr-form-lead">
                            Selecciona el usuario que formará parte de este interventor. Solo se muestran usuarios que aún no pertenecen al equipo.
                        </p>

                        <div className="ivr-field">
                            <span className="ivr-label">Usuario *</span>
                            <div className="search small-search ivr-search">
                                <Icon name="search"/>
                                <input placeholder="Buscar por nombre, correo o rol..." 
                                    value={q} 
                                    onChange={e => setQ(e.target.value)}
                                />
                            </div>
                            
                            <div className={`ivr-picker ${submitted && picked === null ? "has-error" : ""}`} role="radiogroup">
                                {candidates.length === 0 && (
                                    <div className="ivr-picker-empty">
                                        <Icon name="check"/>
                                        <span>Todos los usuarios ya pertenecen a este equipo.</span>
                                    </div>
                                )}

                                {candidates.length > 0 && list.length === 0 && (
                                    <div className="ivr-picker-empty">
                                        <Icon name="search"/>
                                        <span>Ningún usuario coincide con “{q}”.</span>
                                    </div>
                                )}

                                {list.map(u => (
                                    <button 
                                        type="button" 
                                        role="radio" 
                                        aria-checked={picked === u.id} 
                                        key={u.id} 
                                        className={picked === u.id ? "selected" : ""} 
                                        onClick={() => setPicked(u.id)}
                                    >
                                        <span className="table-avatar">
                                            {initials(u.name)}
                                        </span>
                                        
                                        <div>
                                            <strong>{u.name}</strong>
                                            <small>{u.email} · {u.role} · {u.shift}</small>
                                        </div>
                                        
                                        <i className="ivr-radio">
                                            {picked === u.id && <Icon name="check" size={12}/>}
                                        </i>
                                    </button>
                                ))}
                            </div>

                            {submitted && picked === null && <em className="ivr-error">Selecciona un usuario para continuar.</em>}
                        </div>

                        <div className="setting-switch ivr-switch">
                            <div>
                                <strong>Asociación activa</strong>
                                <span>Si está inactiva, el usuario no recibe tareas de este equipo.</span>
                            </div>
                            
                            <Switch 
                                on={isActive} 
                                onChange={v => { setIsActive(v); if (!v) setIsLeader(false); }} 
                                label="Asociación activa"
                            />
                            
                        </div>

                        <div className="setting-switch ivr-switch">
                            <div>
                                <strong>Es líder del equipo</strong>
                                <span>
                                    {isLeader && currentLeader ? `Reemplazará a ${currentLeader} como líder.` : "Un equipo tiene un solo líder."}
                                </span>
                            </div>
                            
                            <Switch 
                                on={isLeader && isActive} 
                                onChange={v => setIsLeader(v)} 
                                label="Es líder del equipo"
                            />
                        </div>

                        {!isActive && <p className="ivr-hint">Un usuario inactivo no puede ser líder.</p>}
                    </div>

                    <div className="drawer-actions">
                        <Button onClick={onClose}>Cancelar</Button>
                        <button type="submit" className="btn btn-primary">
                            <Icon name="plus" size={16}/>
                            <span>Asociar usuario</span>
                        </button>
                    </div>
                </form>
            </aside>
        </>
    )
}