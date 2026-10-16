import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { onSessionExpired } from "../../lib/session";

export default function SessionGuard() {
    const { removeUser, events } = useAuth();

    useEffect(() => {
        const clear = () => void removeUser();

        const offApi = onSessionExpired(clear);                 // 401 de la API
        const offRenew = events.addSilentRenewError(clear);     // no se pudo renovar

        return () => {
            offApi();
            offRenew();
        };
    }, [removeUser, events]);

    return null;
}