// routes
import { PATH_ACCESO, PATH_DASHBOARD, PATH_OPTICA } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'inicio',
    items: [
      { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
    ],
  },
  // ACCESO
  //----------------------------------------------------------------------
  {
    subheader: 'acceso',
    items: [
      { title: 'usuarios', path: PATH_ACCESO.usuarios, icon: ICONS.user },
      { title: 'roles', path: PATH_ACCESO.roles, icon: ICONS.kanban },
    ],
  },
  // OPTICA
  //----------------------------------------------------------------------
  {
    subheader: 'óptica',
    items: [
      { title: 'empleados', path: PATH_OPTICA.empleados, icon: ICONS.analytics },
      { title: 'clientes', path: PATH_OPTICA.clientes, icon: ICONS.cart },
    ],
  },
];

export default navConfig;
