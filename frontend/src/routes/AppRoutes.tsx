import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import AppLayout from "../components/layout/AppLayout";
import { LayoutProvider } from "../context/LayoutContext";
import { BedsPage } from "../feature/beds";
import { TaskPage } from "../feature/tasks";
import { NotificationsPage } from "../feature/notifications";
import { IntervenorsPage } from "../feature/intervenors";
import { AnalyticsPages } from "../feature/analytics";
import { AuditPages } from "../feature/audit";
import { Workflows } from "../feature/workflows";
import ProtectedRoutes from "./ProtectedRoutes";

// function PlaceholderPage({ title }: { title: string }) {
// 	return (
// 		<div className="p-7">
// 			<h1 className="text-2xl font-medium text-[#102B50]">{title}</h1>
// 			<p className="mt-2 text-sm text-slate-500">Módulo en construcción.</p>
// 		</div>
// 	);
// }

export function AppRoutes() {

	return (
		<BrowserRouter basename="/khronos">
			<LayoutProvider>
				<Routes>
					<Route element={<ProtectedRoutes/>}>

						<Route element={<AppLayout />}>

							<Route path="/">
								<Route index element={<Navigate to="/dashboard" replace />} />
								<Route path="/dashboard" element={<DashboardPage />} />
							</Route>

							<Route path="/giro-camas" element={<BedsPage />} />
							<Route path="/mis-tareas" element={< TaskPage />} />
							<Route path="/notificaciones" element={<NotificationsPage />} />

							<Route path="/workflows" element={<Workflows />} />

							<Route path="/interventores" element={<IntervenorsPage />} />

							<Route path="/analytics" element={<AnalyticsPages />} />
							<Route path="/auditoria" element={<AuditPages />} />

						</Route>

						<Route path="*" element={<Navigate to="/dashboard" replace />} />
					</Route>
				</Routes>
			</LayoutProvider>
		</BrowserRouter>
	);
}