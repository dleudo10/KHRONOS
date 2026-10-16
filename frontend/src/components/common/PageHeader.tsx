import type { ReactNode } from "react"

type PageHeaderProps = {
    title: string;
    subtitle: string;
    actions?: ReactNode;
}
const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
    return (
        <div className="page-header">
            <div>
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>
            <div className="page-actions">
                {actions}
            </div>
        </div>
    )
}

export default PageHeader