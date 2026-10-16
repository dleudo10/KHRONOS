import type { ReactNode } from "react";

const PanelTitle = ({ title, action }: { title: string; action?: ReactNode }) => {
    return (
        <div className="panel-title">
            <div>
                <h2>{title}</h2>
                <span className="live-dot">EN VIVO</span>
            </div>{action}
        </div>
    )
}

export default PanelTitle