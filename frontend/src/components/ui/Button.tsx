import type { ReactNode } from "react"
import type { IconName } from "./Icon";
import Icon from "./Icon";

export type ButtonVariant = "primary"|"secondary"|"ghost"|"danger"

type ButtonProps = {
    children: ReactNode;
    variant? : ButtonVariant;
    icon?: IconName;
    onClick?: () => void;
}

const Button = ({ children, variant = "secondary", icon, onClick }: ButtonProps) => {
    return (
        <button className={`btn btn-${variant}`} onClick={onClick}>
            {icon && <Icon name={icon} size={16}/>}
            <span>{children}</span>
        </button>
    )
}

export default Button