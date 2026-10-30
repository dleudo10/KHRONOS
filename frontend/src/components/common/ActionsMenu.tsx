import type { ActionsMenuProps } from "../../types/actionsMenu.types";

export const ActionsMenu = ({ top, right, onClose, children }: ActionsMenuProps) => {
    return (
        <>
            <div className="ivr-menu-back" onClick={onClose} />
            <div className="ivr-menu" role="menu" style={{ top, right }}>
                {children}                
            </div>
        </>
    )
}