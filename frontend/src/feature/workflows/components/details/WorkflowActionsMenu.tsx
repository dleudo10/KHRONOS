import { useNavigate } from "react-router-dom";
import { ActionsMenu } from "../../../../components/common/ActionsMenu"
import Icon from "../../../../components/ui/Icon"
import type { ActionsMenuProps } from "../../../../types/actionsMenu.types"
import type { Workflow } from "../../types/workflow.types"

interface WorkflowActionsMenuProps extends ActionsMenuProps {
    menuMember: Workflow,
    onEdit: () => void;
    onSelect: (id: number) => void;
}

const WorkflowActionsMenu = ({ top, right, onClose, menuMember, onEdit, onSelect }: WorkflowActionsMenuProps) => {
    const navigate = useNavigate();
    
    return (
        <ActionsMenu 
            top={top}
            right={right}
            onClose={onClose}
        >
            <button
                type="button"
                role="menuitem"
                onClick={() => navigate(`${menuMember.id}/details`)}
            >
                <Icon name="arrow" size={15} />
                Ver detalle
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() => {
                    onSelect(menuMember.id);
                    onEdit();
                    onClose();
                }}
            >
                <Icon name="edit" size={15} />
                Editar
            </button>
        </ActionsMenu>
    )
}

export default WorkflowActionsMenu