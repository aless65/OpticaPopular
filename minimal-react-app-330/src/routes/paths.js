// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_OPTICA = '/optica';
const ROOTS_ACCESO = '/acceso';
const ROOTS_DASHBOARD = '/Inicio';

// ----------------------------------------------------------------------
export const PATH_ACCESO = {
  root: ROOTS_ACCESO,
  usuarios: path(ROOTS_ACCESO, '/usuarios'),
  roles: path(ROOTS_ACCESO, '/roles'),
};

export const PATH_OPTICA = {
  root: ROOTS_OPTICA,
  empleados: path(ROOTS_OPTICA, '/empleados'),
  clientes: path(ROOTS_OPTICA, '/clientes') ,
  citas: path(ROOTS_OPTICA, '/citas'),
};

export const PATH_AUTH = {
  login: '/',
  register: '/register',
  loginUnprotected: '/login-unprotected',
  registerUnprotected: '/register-unprotected',
  verify: '/verify',
  resetPassword: '/reset-password',
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
