import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Topbar from "./Topbar";
import { useLayout } from "../../context/LayoutContext";

const AppLayout = () => {
    const { isMobile, sidebarOpen, closeSidebar } = useLayout();
    const { pathname } = useLocation();
    const isBuilder = pathname.startsWith("/workflow-builder");

    return (
        <div className="app-shell">
            <Sidebar />

            {isMobile && sidebarOpen && (
                <div className="backdrop" onClick={closeSidebar} aria-hidden="true" />
            )}

            <div className="app-main">
                <Topbar />
                <main className={`content${isBuilder ? " builder-content" : ""}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;