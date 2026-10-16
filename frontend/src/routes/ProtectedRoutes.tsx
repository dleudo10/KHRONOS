import { useEffect, useRef } from "react";
import { hasAuthParams, useAuth } from "react-oidc-context";
import { Outlet } from "react-router";


const ProtectedRoutes = () => {
    const auth = useAuth();
    const tried = useRef(false);

    useEffect(() => {
        if (
            !hasAuthParams() &&
            !auth.isAuthenticated &&
            !auth.isLoading &&
            !auth.activeNavigator &&
            !auth.error &&
            !tried.current
        ) {
            tried.current = true;
            void auth.signinRedirect();
        }
    }, [auth]);

    useEffect(() => {
        if (auth.isAuthenticated) tried.current = false;
    }, [auth.isAuthenticated]);

    if (auth.isLoading) {

        return (
            <main className="page">
                <p>Verificando sesión con OLIMPO...</p>
            </main>
        );
    }

    if (auth.error) {
        return (
            <main className="page">
                <h1>No se pudo completar el inicio de sesión</h1>
                <p>{auth.error.message}</p>
                <button onClick={() => void auth.signinRedirect()}>
                    Volver a intentar
                </button>
            </main>
        );
    }

    /*
     * No autenticado.
     */
    if (!auth.isAuthenticated) {

        return (
            <main>
                <section>
                    <p>OLIMPO · APLICACIÓN INTEGRADA</p>
                    <h1>TaskFlow</h1>
                    <p>
                        Administra tus tareas desde una aplicación
                        conectada al sistema de identidad de OLIMPO.
                    </p>

                    <button
                        className=""
                        onClick={() => void auth.signinRedirect()}
                    >
                        Iniciar sesión con OLIMPO
                    </button>
                </section>
            </main>
        );
    }
    
    /*
     * Autenticado.
     */
    return <Outlet />;
}

export default ProtectedRoutes