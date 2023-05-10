import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';


// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { pathname } = useLocation();

    return (
        <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
            <Component {...props} />
        </Suspense>
    );
};

export default function Router() {
    return useRoutes([
        {
            path: '/',
            children: [
                {
                    element: <Login />,
                    index: true
                },
                {
                    path: 'register',
                    element: <Register />,
                },
                { path: 'login-unprotected', element: <Login /> },
                { path: 'register-unprotected', element: <Register /> },
                { path: 'reset-password', element: <ResetPassword /> },
                { path: 'verify', element: <VerifyCode /> },
            ],
        },

        // Dashboard Routes
        {
            path: 'inicio',
            element: (
                <GuestGuard>
                    <DashboardLayout />
                </GuestGuard>
            ),
            children: [
                { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
                { path: 'app', element: <GuestGuard> <GeneralApp /> </GuestGuard>  },
            ],
        },
        {
            path: 'acceso',
            element: (
                <GuestGuard>
                    <DashboardLayout />
                </GuestGuard>
            ),
            children: [
                { path: 'usuarios', element: <GuestGuard> <AccesoUsuarios /> </GuestGuard>  },
                { path: 'roles', element: <GuestGuard> <AccesoRoles /> </GuestGuard>  },
            ],
        },
        {
            path: 'optica',
            element: (
                <GuestGuard>
                    <DashboardLayout />
                </GuestGuard>
            ),
            children: [
                { path: 'empleados', element: <GuestGuard> <OpticaEmpleados /> </GuestGuard>  },
                { path: 'empleados/nuevo', element: <GuestGuard> <OpticaEmpleadosCreate /> </GuestGuard>  },
                { path: 'empleados/:name/editar', element: <GuestGuard>  <OpticaEmpleadosCreate /> </GuestGuard> },
                { path: 'clientes', element: <GuestGuard> <OpticaClientes /> </GuestGuard>  },
                {
                    path: 'citas',
                    element:
                        <GuestGuard>
                            <OpticaCitas />
                        </GuestGuard>
                },
                { path: 'proveedores', element: <GuestGuard> <OpticaProveedores /> </GuestGuard>  },
                { path: 'ordenes', element: <GuestGuard> <OpticaOrdenes /> </GuestGuard>  },
            ],
        },
        // Main Routes
        {
            path: '*',
            element: <LogoOnlyLayout />,
            children: [
                { path: '500', element: <Page500 /> },
                { path: '404', element: <NotFound /> },
                { path: '*', element: <Navigate to="/404" replace /> },
            ]
        }
    ])
}


// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));


// ACCESO
const AccesoUsuarios = Loadable(lazy(() => import('../pages/dashboard/AccesoUsuarios')));
const AccesoRoles = Loadable(lazy(() => import('../pages/dashboard/AccesoRoles')));

// OPTICA

// EMPLEADOS
const OpticaEmpleados = Loadable(lazy(() => import('../pages/dashboard/OpticaEmpleados')));
const OpticaEmpleadosCreate = Loadable(lazy(() => import('../pages/dashboard/OpticaEmpleadosCreate')));

// CLIENTES
const OpticaClientes = Loadable(lazy(() => import('../pages/dashboard/OpticaClientes')));
const OpticaCitas = Loadable(lazy(() => import('../pages/dashboard/OpticaCitas')));
const OpticaProveedores = Loadable(lazy(() => import('../pages/dashboard/OpticaProveedores')));

// ORDENES
const OpticaOrdenes = Loadable(lazy(() => import('../pages/dashboard/OpticaOrdenes')));

// DASHBOARD

// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));

const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
