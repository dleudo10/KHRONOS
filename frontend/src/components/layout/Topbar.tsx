import { useLocation } from "react-router-dom";
import Icon from "../ui/Icon";
import GlobalSearch from "./GlobalSearch";
import { NAV_SECTIONS, findNavItemByPath } from "../../config/navigation";
import { useLayout } from "../../context/LayoutContext";
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";
import { useAuth } from "react-oidc-context";
import UserAvatar from "../common/UserAvatar";

const Topbar = () => {
    const { pathname } = useLocation();
    const auth = useAuth();
    const { toggleSidebar } = useLayout();
    const unread = useUnreadNotifications();

    const current = findNavItemByPath(pathname);
    const sectionName = current ? NAV_SECTIONS[current.section].crumb : "Operación";
    const pageName = current?.label ?? "Página";

    return (
        <header className="topbar">
            <div className="crumb">
                <button className="menu-button" onClick={toggleSidebar} aria-label="Abrir menú">
                    <Icon name="menu" />
                </button>

                <span>{sectionName}</span>
                <Icon name="chevron" size={13} />
                <strong>{pageName}</strong>
            </div>

            <GlobalSearch />

            <div className="top-actions">
                <button className="icon-button notification" aria-label="Notificaciones">
                    <Icon name="bell" />
                    {unread > 0 && <span>{unread}</span>}
                </button>

                <button 
                    className="icon-button" 
                    aria-label="Cerrar sesion"
                    onClick={() => void auth.signoutRedirect()}
                >
                    <Icon name="logout" />
                </button>

                <UserAvatar name={auth.user?.profile.name || auth.user?.profile.preferred_username || "?"} />
            </div>
        </header>
    );
};

export default Topbar;