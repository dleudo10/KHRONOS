import React from 'react'
import Icon from '../../../../components/ui/Icon'
import Button from '../../../../components/ui/Button'
import type { Versions } from '../../types/workflow.types'
import type { Tone } from '../../../../components/ui/Badge'

type PublishConfirmDialogProps = {
    selectedVersion: Versions
    setPublishConfirm: React.Dispatch<React.SetStateAction<boolean>>;
    saving: boolean;
    notify: (message: string, tone?: Tone) => void;
    setSaving: React.Dispatch<React.SetStateAction<boolean>>;
    persistGraph: () => Promise<boolean>
    setLocalPublished: React.Dispatch<React.SetStateAction<boolean>>;
    setDirty: React.Dispatch<React.SetStateAction<boolean>>;
}

const PublishConfirmDialog = ({ 
    selectedVersion, 
    setPublishConfirm, 
    saving,  
    notify, 
    setSaving, 
    persistGraph,
    setLocalPublished,
    setDirty
} : PublishConfirmDialogProps) => {
    
    const publishRequest = async (): Promise<boolean> => true;

    const confirmPublish = async () => {
        setSaving(true);
        try {
            if ((await persistGraph()) && (await publishRequest())) {
                setPublishConfirm(false);
                setLocalPublished(true);
                setDirty(false);
                notify(`Versión v${selectedVersion?.version_number} publicada correctamente`, "success");
            }
        } catch {
            notify("No se pudo publicar la versión", "danger");
        } finally {
            setSaving(false);
        }
    };
    
    return (
        <>
            <div className="builder-overlay" onClick={() => setPublishConfirm(false)} />
            <div className="confirm-dialog">
                <span className="confirm-icon"><Icon name="layers" /></span>
                <h2>Publicar versión v{selectedVersion.version_number}</h2>
                <p>
                    Esta acción hará inmutable la versión. Las ejecuciones activas continuarán con su
                    versión actual y solo las nuevas usarán v{selectedVersion.version_number}.
                </p>
                <div>
                    <Button onClick={() => setPublishConfirm(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={confirmPublish}>
                        {saving ? "Publicando…" : "Confirmar publicación"}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default PublishConfirmDialog