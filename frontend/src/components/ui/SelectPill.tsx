import type { ReactNode } from "react";
import Icon from "./Icon";

const SelectPill = ({ children }: { children: ReactNode }) => {
    return (
        <button className="select-pill">
            <span>{children}</span>
            <Icon name="chevron" size={14}/>
        </button>
    )
}

export default SelectPill