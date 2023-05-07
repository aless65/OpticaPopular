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
          path: '/',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
          index: true
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <GuestGuard>
          <DashboardLayout />
        </GuestGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
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
        { path: 'usuarios', element: <AccesoUsuarios /> },
        { path: 'roles', element: <AccesoRoles /> },
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
        { path: 'empleados', element: <OpticaEmpleados /> },
        { path: 'empleados/nuevo', element: <OpticaEmpleadosCreate /> },
        { path: 'clientes', element: <OpticaClientes /> },
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
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
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
const OpticaClientes = Loadable(lazy(() => import('../pages/dashboard/OpticaClientes')));

// DASHBOARD

// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));

const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
