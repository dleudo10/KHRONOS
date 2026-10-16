import type { IconName } from "../components/ui/Icon";

export type NavSectionId = "operacion" | "flujos" | "admin";

export interface NavItem {
    label: string;
    path: string;
    icon: IconName;
    section: NavSectionId;
}

export const NAV_SECTIONS: Record<NavSectionId, { crumb: string; label?: string }> = {
    operacion: { crumb: "Operación" },
    flujos: { crumb: "Gestión de flujos", label: "GESTIÓN DE FLUJOS" },
    admin: { crumb: "Administración", label: "ADMINISTRACIÓN" },
};

export const NAV_ITEMS: NavItem[] = [
    { label: "Dashboard", path: "/dashboard", icon: "grid", section: "operacion" },
    { label: "Giro de camas", path: "/giro-camas", icon: "bed", section: "operacion" },
    { label: "Mis tareas", path: "/mis-tareas", icon: "check", section: "operacion" },
    { label: "Notificaciones", path: "/notificaciones", icon: "bell", section: "operacion" },

    { label: "Workflows", path: "/workflows", icon: "flow", section: "flujos" },
    // { label: "Versiones", path: "/versiones", icon: "layers", section: "flujos" },
    // { label: "Workflow Builder", path: "/workflow-builder", icon: "spark", section: "flujos" },

    { label: "Interventores", path: "/interventores", icon: "users", section: "admin" },
    { label: "Analytics", path: "/analytics", icon: "chart", section: "admin" },
    { label: "Auditoría", path: "/auditoria", icon: "history", section: "admin" },
    // { label: "Configuración", path: "/configuracion", icon: "settings", section: "admin" },
    // { label: "Documentación", path: "/documentacion", icon: "layers", section: "admin" },
];

export const getNavItemsBySection = (section: NavSectionId) =>
    NAV_ITEMS.filter((item) => item.section === section);

export const findNavItemByPath = (pathname: string) =>
    NAV_ITEMS.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));