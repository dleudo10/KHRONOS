import Icon from "../../../../components/ui/Icon";
import type { IntervenorMember } from "../../types/member.types";

type MemberActionsMenuProps = {
    member: IntervenorMember;
    top: number;
    right: number;
    onClose: () => void;
    onToggleLeader: () => void;
    onRemove: () => void;
};

export function MemberActionsMenu({ member, top, right, onClose, onToggleLeader, onRemove }: MemberActionsMenuProps) {
    // Un usuario no disponible no puede ser líder (sí se le puede quitar el liderazgo).
    const cannotLead = !member.is_leader && !member.user.is_active;

    return (
        <>
            <div className="ivr-menu-back" onClick={onClose} />
            <div className="ivr-menu" role="menu" style={{ top, right }}>
                <button
                    type="button"
                    role="menuitem"
                    disabled={cannotLead}
                    title={cannotLead ? "Un usuario no disponible no puede ser líder" : undefined}
                    onClick={onToggleLeader}
                >
                    <Icon name="spark" size={15} />
                    {member.is_leader ? "Quitar liderazgo" : "Nombrar líder"}
                </button>

                <div className="ivr-menu-sep" />

                <button type="button" role="menuitem" className="danger" onClick={onRemove}>
                    <Icon name="logout" size={15} />
                    Quitar del equipo
                </button>
            </div>
        </>
    );
}
