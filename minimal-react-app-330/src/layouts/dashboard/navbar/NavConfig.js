import { useEffect, useState } from 'react';
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// import GroupIcon from '@mui/icons-material/Group';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
// import BusinessIcon from '@mui/icons-material/Business';
// import SellIcon from '@mui/icons-material/Sell';
// import CategoryIcon from '@mui/icons-material/Category';
// import StoreIcon from '@mui/icons-material/Store';
// import DeskIcon from '@mui/icons-material/Desk';
// import DescriptionIcon from '@mui/icons-material/Description';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// routes
import { PATH_ACCESO, PATH_DASHBOARD, PATH_OPTICA } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';


// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

// const getIcon2 = (name) => {
//   try {
//     const { default: IconComponent } = import(`@mui/icons-material/${name}`);
//     return <IconComponent />;
//   } catch (error) {
//     console.error(`Failed to load icon component: ${name}`);
//     return null; // Return a default value if the icon component fails to load
//   }
// };

const ICONS = {
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  dashboard: getIcon('ic_dashboard'),
};

//  menuAcceso = [];

const fetchPantallasData = async () => {
  try {
    console.log("entra");
    const response = await fetch(`http://opticapopular.somee.com/api/Pantallas/ListadoMenu?esAdmin=${JSON.parse(localStorage.getItem('usuario')).usua_EsAdmin}&role_Id=${JSON.parse(localStorage.getItem('usuario')).role_Id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);

    const menuAcceso = data.data.filter((item) => item.pant_Menu === 'acceso');
    console.log(menuAcceso);

    const extractedDataAcceso = menuAcceso.map((item) => {
      // Extract the specific data you need from each item
      // For example:
      return {
        title: item.pant_Nombre,
        path: item.pant_Url,
        icon: getIcon(item.pant_Icon),
      };
    });
    console.log(extractedDataAcceso);

    if (extractedDataAcceso.length > 0) {
      console.log("hay acceso");
      const accesoSectionIndex = navConfig.findIndex((section) => section.subheader === 'acceso');
      if (accesoSectionIndex !== -1) {
        navConfig[accesoSectionIndex].items = extractedDataAcceso;
      } else {
        navConfig.push({
          subheader: 'acceso',
          items: extractedDataAcceso,
        });
      }
    } else {
      // Remove the "acceso" section if extractedDataAcceso is empty
      const accesoSectionIndex = navConfig.findIndex((section) => section.subheader === 'acceso');
      if (accesoSectionIndex !== -1) {
        navConfig.splice(accesoSectionIndex, 1);
      }
    }

    const menuOptica = data.data.filter((item) => item.pant_Menu === 'óptica');
    console.log(menuOptica);

    const extractedDataOptica = menuOptica.map((item) => {
      // Extract the specific data you need from each item
      // For example:
      return {
        title: item.pant_Nombre,
        path: item.pant_Url,
        icon: getIcon(item.pant_Icon),
      };
    });

    if (extractedDataOptica.length > 0) {
      console.log("hay optica");
      const opticaSectionIndex = navConfig.findIndex((section) => section.subheader === 'óptica');
      if (opticaSectionIndex !== -1) {
        navConfig[opticaSectionIndex].items = extractedDataOptica;
      } else {
        navConfig.push({
          subheader: 'óptica',
          items: extractedDataOptica,
        });
      }
    } else {
      // Remove the "óptica" section if extractedDataOptica is empty
      const opticaSectionIndex = navConfig.findIndex((section) => section.subheader === 'óptica');
      if (opticaSectionIndex !== -1) {
        navConfig.splice(opticaSectionIndex, 1);
      }
    }

    console.log(navConfig);

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

fetchPantallasData();

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
  // {
  //   subheader: 'acceso',
  //   items: [
  //     { title: 'usuarios', path: PATH_ACCESO.usuarios, icon: <ManageAccountsIcon/> },
  //     { title: 'roles', path: PATH_ACCESO.roles, icon: ICONS.kanban },
  //   ],
  // },
  // OPTICA
  //----------------------------------------------------------------------
  // {
  //   subheader: 'óptica',
  //   items: [
  //     { title: 'empleados', path: PATH_OPTICA.empleados, icon: <PeopleAltIcon/> },
  //     { title: 'clientes', path: PATH_OPTICA.clientes, icon: <GroupIcon/> },
  //     { title: 'citas', path: PATH_OPTICA.citas, icon: <CalendarMonthIcon/> },
  //     { title: 'proveedores', path: PATH_OPTICA.proveedores, icon: <BusinessIcon/> },
  //     { title: 'ordenes', path: PATH_OPTICA.ordenes, icon: <ShoppingBasketIcon/> },
  //     { title: 'marcas', path: PATH_OPTICA.marcas, icon: <SellIcon/> },
  //     { title: 'categorias', path: PATH_OPTICA.categorias, icon: <CategoryIcon/> },
  //     { title: 'sucursales', path: PATH_OPTICA.sucursales, icon: <StoreIcon/> },
  //     { title: 'consultorios', path: PATH_OPTICA.consultorios, icon: <DeskIcon/> },
  //     { title: 'facturas', path: PATH_OPTICA.facturas, icon: <DescriptionIcon/> },
  //     { title: 'ventas', path: PATH_OPTICA.ventas, icon: <ShoppingCartIcon/> },
  //     { title: 'envios', path: PATH_OPTICA.envios, icon: <LocalShippingIcon/> },

  //   ],
  // },
];

export default navConfig;
