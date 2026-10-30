import type { ReactNode } from "react";

export type Tone = 
    "success" 
    | "info" 
    | "warning" 
    | "danger" 
    | "neutral"
;

type BadgeProps = {
    children: ReactNode;
    tone?: Tone;
    icon?: boolean;
    classname?: string;
}

const Badge = ({ children, tone = "neutral", icon = true, classname }: BadgeProps ) => {
    return (
        <span className={`badge badge-${tone} ${classname}`}>
            {icon && (
                <span className="badge-dot"/>
            )}
            {children}
        </span>
    )
}

export default Badge