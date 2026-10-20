import Button from "../ui/Button";
import Icon from "../ui/Icon";

type ConfirmDialog = {
    title: string; 
    text: string; 
    confirmLabel: string; 
    onCancel: () => void; 
    onConfirm: () => void
}

export function ConfirmDialog({ title, text, confirmLabel, onCancel, onConfirm }: ConfirmDialog) {
    return (
        <div className="ivr-confirm-back" onClick={onCancel}>
            <div className="ivr-confirm" role="alertdialog" aria-modal="true" onClick={e => e.stopPropagation()}>
                <span className="ivr-confirm-icon">
                    <Icon name="alert"/>
                </span>
                
                <h2>{title}</h2>
                
                <p>{text}</p>

                <div>
                    <Button onClick={onCancel}>
                        Cancelar
                    </Button>

                    <Button variant="danger" onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    )
}