// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_OPTICA = '/optica';
const ROOTS_ACCESO = '/acceso';
const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------
export const PATH_ACCESO = {
  root: ROOTS_ACCESO,
  usuarios: path(ROOTS_ACCESO, '/usuarios'),
  roles: path(ROOTS_ACCESO, '/roles'),
};

export const PATH_OPTICA = {
  root: ROOTS_OPTICA,
  empleados: path(ROOTS_OPTICA, '/empleados'),
  empleadosNew: path(ROOTS_OPTICA, '/empleados/nuevo'),
  clientes: path(ROOTS_OPTICA, '/clientes') ,
};

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: '/',
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
  // optica: {
  //   empleadosNew: path(ROOTS_DASHBOARD, '/empleados/nuevo'),
  // },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
