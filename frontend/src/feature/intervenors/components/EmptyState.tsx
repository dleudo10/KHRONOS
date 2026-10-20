import Icon from '../../../components/ui/Icon'
import Button from '../../../components/ui/Button'

type EmptyStateProps = {
    onAction: () => void;
};

const EmptyState = ({ onAction }: EmptyStateProps) => {
    return (
        <div className="ivr-empty panel">
			<span><Icon name="search" size={22}/></span>
			<h3>No hay interventores que coincidan</h3>
			<p>Prueba con otro término o limpia los filtros aplicados.</p>
			<Button onClick={onAction}>
				Limpiar filtros
			</Button>
		</div> 
    )
}

export default EmptyState