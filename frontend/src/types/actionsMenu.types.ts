import type { ReactNode } from "react";

export interface ActionsMenuProps {
    top: number;
    right: number;
    onClose: () => void;
    children?: ReactNode
};