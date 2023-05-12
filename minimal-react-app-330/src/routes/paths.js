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
  empleadosNew: path(ROOTS_OPTICA, '/empleados/nuevo'),
  empleadosEdit: (name) => path(ROOTS_OPTICA, `/empleados/${name}/editar`),
  clientes: path(ROOTS_OPTICA, '/clientes') ,
  clientesNew: path(ROOTS_OPTICA, '/clientes/nuevo'),
  clientesEdit: (name) => path(ROOTS_OPTICA, `/clientes/${name}/editar`),
  citas: path(ROOTS_OPTICA, '/citas'),
  detallesCita: (Id) => path(ROOTS_OPTICA, `/citas/Detalles/${Id}`),
  ordenes: path(ROOTS_OPTICA, '/ordenes'),
  ordenesNew: path(ROOTS_OPTICA, '/ordenes/nuevo'),
  proveedores: path(ROOTS_OPTICA, '/proveedores') ,
  marcas: path(ROOTS_OPTICA, '/marcas') ,
  categorias: path(ROOTS_OPTICA, '/categorias') ,
  sucursales: path(ROOTS_OPTICA, '/sucursales') ,
  consultorios: path(ROOTS_OPTICA, '/consultorios'),
  facturas: path(ROOTS_OPTICA, '/facturas'),
  ventas: path(ROOTS_OPTICA, '/ventas'),
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
  optica: {
    empleados: path(ROOTS_DASHBOARD, '/empleados'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
