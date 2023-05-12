import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import BusinessIcon from '@mui/icons-material/Business';
import SellIcon from '@mui/icons-material/Sell';
import CategoryIcon from '@mui/icons-material/Category';
import StoreIcon from '@mui/icons-material/Store';
import DeskIcon from '@mui/icons-material/Desk';
import DescriptionIcon from '@mui/icons-material/Description';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// routes
import { PATH_ACCESO, PATH_DASHBOARD, PATH_OPTICA } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
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
      { title: 'usuarios', path: PATH_ACCESO.usuarios, icon: <ManageAccountsIcon/> },
      { title: 'roles', path: PATH_ACCESO.roles, icon: ICONS.kanban },
    ],
  },
  // OPTICA
  //----------------------------------------------------------------------
  {
    subheader: 'óptica',
    items: [
      { title: 'empleados', path: PATH_OPTICA.empleados, icon: <PeopleAltIcon/> },
      { title: 'clientes', path: PATH_OPTICA.clientes, icon: <GroupIcon/> },
      { title: 'citas', path: PATH_OPTICA.citas, icon: <CalendarMonthIcon/> },
      { title: 'proveedores', path: PATH_OPTICA.proveedores, icon: <BusinessIcon/> },
      { title: 'ordenes', path: PATH_OPTICA.ordenes, icon: <ShoppingBasketIcon/> },
      { title: 'marcas', path: PATH_OPTICA.marcas, icon: <SellIcon/> },
      { title: 'categorias', path: PATH_OPTICA.categorias, icon: <CategoryIcon/> },
      { title: 'sucursales', path: PATH_OPTICA.sucursales, icon: <StoreIcon/> },
      { title: 'consultorios', path: PATH_OPTICA.consultorios, icon: <DeskIcon/> },
      { title: 'facturas', path: PATH_OPTICA.facturas, icon: <DescriptionIcon/> },
      { title: 'ventas', path: PATH_OPTICA.ventas, icon: <ShoppingCartIcon/> },
    ],
  },
];

export default navConfig;
