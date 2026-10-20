import Icon from '../../../components/ui/Icon'
import Button from '../../../components/ui/Button'

type EmptyMembershipsProps = {
    onAction: () => void;
};

const EmptyMemberships = ({ onAction }: EmptyMembershipsProps) => {
    return (
        <div className="ivr-empty panel">
			<span><Icon name="users" size={22}/></span>
			<h3>No hay interventores</h3>
			<p>Crea el primero para empezar a asociar usuarios.</p>
			<Button variant="primary" icon="plus" onClick={onAction}>
				Nuevo interventor
			</Button>
		</div> 
    )
}

export default EmptyMemberships
