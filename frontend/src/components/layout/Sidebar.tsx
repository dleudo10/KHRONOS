import { NavLink } from "react-router-dom";
import Icon from "../ui/Icon";
import { NAV_SECTIONS, getNavItemsBySection, type NavSectionId } from "../../config/navigation";
import { useLayout } from "../../context/LayoutContext";
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";
import { useAuth } from "react-oidc-context";
import UserAvatar from "../common/UserAvatar";

const Sidebar = () => {
    const auth = useAuth();
    const { isMobile, sidebarOpen, closeSidebar } = useLayout();
    const unread = useUnreadNotifications();

    const isOpen = !isMobile || sidebarOpen;


    const section = (id: NavSectionId) =>
        getNavItemsBySection(id).map((item) => (
            <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            >
                <Icon name={item.icon} />
                <span>{item.label}</span>
                {item.path === "/notificaciones" && unread > 0 && <b>{unread}</b>}
            </NavLink>
        ));

    return (
        <aside className={`sidebar${isOpen ? " sidebar-open" : ""}`}>
            <div className="brand">
                <div className="brand-mark">
                    <Icon name="bed" size={22} />
                    <span />
                </div>

                <div>
                    <strong>Giro de Camas</strong>
                    <small>OPERACIONES</small>
                </div>

                <button className="mobile-close" onClick={closeSidebar} aria-label="Cerrar menú">
                    <Icon name="close" />
                </button>
            </div>

            <nav>
                {section("operacion")}
                <div className="nav-label">{NAV_SECTIONS.flujos.label}</div>
                {section("flujos")}
                <div className="nav-label">{NAV_SECTIONS.admin.label}</div>
                {section("admin")}
            </nav>

            <div className="user-card">
                <div className="user-line">
                    <UserAvatar name={auth.user?.profile.name || auth.user?.profile.preferred_username || "?"} />

                    <div>
                        <strong>{auth.user?.profile.name || auth.user?.profile.preferred_username || 'Sin nombre registrado'}</strong>
                        <small>{auth.user?.profile.rol}</small>
                    </div>
                    {/* <Icon name="more" /> */}
                </div>
                <div className="clinic">
                    <Icon name="building" size={15} />
                    <span>Clinica Antioquia</span>
                    <Icon name="chevron" size={13} />
                </div>

                {/* <button className="profile-button">
                    Mi perfil <Icon name="arrow" size={14} />
                </button> */}
            </div>
        </aside>
    );
};

export default Sidebar;