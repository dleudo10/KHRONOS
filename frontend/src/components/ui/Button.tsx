import type { ReactNode } from "react"
import type { IconName } from "./Icon";
import Icon from "./Icon";

export type ButtonVariant = "primary"|"secondary"|"ghost"|"danger"

type ButtonProps = {
    children: ReactNode;
    variant? : ButtonVariant;
    icon?: IconName;
    onClick?: () => void;
    disabled?: boolean;
}

const Button = ({ children, variant = "secondary", icon, onClick, disabled = false }: ButtonProps) => {
    return (
        <button className={`btn btn-${variant}`} onClick={onClick} disabled={disabled}>
            {icon && <Icon name={icon} size={16}/>}
            <span>{children}</span>
        </button>
    )
}

export default Button