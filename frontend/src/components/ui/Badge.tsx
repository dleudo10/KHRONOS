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
    tone?: Tone
}

const Badge = ({ children, tone = "neutral" }: BadgeProps ) => {
    return (
        <span className={`badge badge-${tone}`}>
            <span className="badge-dot"/>
            {children}
        </span>
    )
}

export default Badge