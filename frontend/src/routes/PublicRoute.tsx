import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute = () => {
    /*
     * Ya tiene sesión, pero entró al login directamente.
     */
    if (isAuthenticated) {
        return <Navigate to="/applications" replace />;
    }

    /*
     * Autenticado.
     */
    return <Outlet />
}

export default PublicRoute