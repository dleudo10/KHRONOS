import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import type { Dispatch, SetStateAction } from "react";
import type { DrawerState, Intervener, Membership, MemberStatus } from "../intervenors.types";

type EmptyTeamsProps = {
    team: Intervener;
    teamMembers: (id: number) => Membership[];
    setDrawer: Dispatch<SetStateAction<DrawerState>>;
    setMq: Dispatch<SetStateAction<string>>;
    setMStatus: Dispatch<SetStateAction<MemberStatus>>;
};

const EmptyTeams = ({
    team,
    teamMembers,
    setDrawer,
    setMq,
    setMStatus,
}: EmptyTeamsProps) => {
    const hasMembers = teamMembers(team.id).length > 0;

    return (
        <div className="ivr-empty ivr-empty-flat">
            <span>
                <Icon name="users" size={22} />
            </span>

            <h3>
                {!hasMembers
                    ? "Este interventor aún no tiene usuarios"
                    : "Ningún usuario coincide con el filtro"
                }
            </h3>

            <p>
                {!hasMembers
                    ? "Asocia usuarios para que puedan recibir y completar tareas de este equipo."
                    : "Ajusta la búsqueda o el estado seleccionado."
                }
            </p>

            {!hasMembers ? (
                <Button
                    variant="primary"
                    icon="plus"
                    onClick={() => setDrawer({ kind: "member" })}
                >
                    Asociar usuario
                </Button>
            ) : (
                <Button
                    onClick={() => {
                        setMq("");
                        setMStatus("all");
                    }}
                >
                    Limpiar filtros
                </Button>
            )}
        </div>
    );
};

export default EmptyTeams;