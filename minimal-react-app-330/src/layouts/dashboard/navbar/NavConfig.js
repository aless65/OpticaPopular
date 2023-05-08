import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

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
    ],
  },
];

export default navConfig;
