// import { useEffect, useState } from 'react';
// // utils
// import axios from '../../../utils/axios';
// import SvgIconStyle from '../../../components/SvgIconStyle';

// const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

// export const fetchPantallasData = async (navConfig, setNavConfig) => {
//   try {
//     const response = await axios.get(`https://localhost:44362/api/Pantallas/ListadoMenu?esAdmin=${JSON.parse(localStorage.getItem('usuario')).usua_EsAdmin}&role_Id=${JSON.parse(localStorage.getItem('usuario')).role_Id}`);
//     const pantallasData = response.data;

//     console.log(pantallasData);
//     // Process the pantallasData and update the navConfig
//     // Example:
//     const updatedNavConfig = navConfig.map((section) => {
//       if (section.subheader === 'óptica') {
//         const updatedItems = section.items.map((item) => {
//           const pantallaData = pantallasData.find((pantalla) => pantalla.pant_Nombre === item.title);
//           if (pantallaData) {
//             return {
//               ...item,
//               path: pantallaData.pant_Url,
//               icon: getIcon(pantallaData.pant_Icon),
//             };
//           }
//           return item;
//         });

//         return {
//           ...section,
//           items: updatedItems,
//         };
//       }

//       return section;
//     });

//     // Set the updated navConfig state
//     setNavConfig(updatedNavConfig);
//   } catch (error) {
//     console.error(error);
//   }
// };

// import React from "react";
// import CIcon from "@coreui/icons-react";

// //import de los iconos a usar en la navbar
// import {
//   cilBell,
//   cilCalculator,
//   cilChartPie,
//   cilCursor,
//   cilDescription,
//   cilDrop,
//   cilHome,
//   cilNotes,
//   cilPencil,
//   cilPuzzle,
//   cilSpeedometer,
//   cilStar,
//   cilUser,
//   cilContact,
//   cilTags,
//   cilSettings,
//   cilMap,
//   cilStorage,
//   cilCamera,
//   cilPeople,
//   cilBuilding,
//   cilMoney,
//   cilLibrary,
//   cilMinus,
//   cilBank,
//   cilBadge,
//   cilPaintBucket,
//   cilCarAlt,
//   cilRestaurant,
//   cilGlobeAlt,
//   cilAlignCenter,
//   cilCasino,
//   cilPaperclip,
// } from "@coreui/icons";
// import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";



// const arregloJSONGET = sessionStorage.getItem("miArreglo");
// const miArreglo = JSON.parse(arregloJSONGET);
// console.log(miArreglo);


// const Vera_Items = [];
// const Mant_Items = [];
// const Acce_Items = [];
// const Fact_Items = [];

// const Menu  = [];

// const user_Crea = parseInt(parseInt(sessionStorage.getItem('user_Id')));

// if (user_Crea==null ||  isNaN(user_Crea)) {
//   window.location.href = '/';
// }
// if (miArreglo==null){
//   console.log("a")
// }
// else{
// miArreglo.forEach((element) => {
//   if(element.identificador == "acce"){
//     Acce_Items.push({
//     component: CNavItem,
//     name: element.name,
//     to: element.to,
//     })
//   }
//   if(element.identificador == "mant"){
//     Mant_Items.push({
//     component: CNavItem,
//     name: element.name,
//     to: element.to,
//     })
//   }
//   if(element.identificador == "vera"){
//     Vera_Items.push({
//     component: CNavItem,
//     name: element.name,
//     to: element.to,
//     })
//   }
//   if(element.identificador == "fact"){
//     Fact_Items.push({
//     component: CNavItem,
//     name: element.name,
//     to: element.to,
//     })
//   }
// });
// }


// if(Acce_Items.length!=0){
  
//   Menu.push (
//   {
//     component: CNavTitle,
//     name: 'Esquema de Seguridad',
//   },
//   {
//   component: CNavGroup,
//   name: 'Seguridad',
//   to: '/base',
//   icon: <CIcon icon={cilCasino} customClassName="nav-icon" />,
//   items: [...Acce_Items]
// })

// }
// if(Mant_Items.length!=0){

//   Menu.push (
//     {
//       component: CNavTitle,
//       name: 'Esquema Mantenimiento',
//     },
//     {
//     component: CNavGroup,
//     name: 'Mantenimiento',
//     to: '/base',
//     icon: <CIcon icon={cilGlobeAlt} customClassName="nav-icon" />,
//     items: [...Mant_Items]
//   })

// }
// if(Vera_Items.length!=0){
//   Menu.push (
//     {
//       component: CNavTitle,
//       name: 'Esquema Tienda',
//     },
//     {
//     component: CNavGroup,
//     name: 'Tienda',
//     to: '/base',
//     icon: <CIcon icon={cilCasino} customClassName="nav-icon" />,
//     items: [...Vera_Items]
//   })
// }
// if(Fact_Items.length!=0){
//   Menu.push (
//     {
//       component: CNavTitle,
//       name: 'Esquema de Facturación',
//     },
//     {
//     component: CNavGroup,
//     name: 'Facturación',
//     to: '/base',
//     icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
//     items: [...Fact_Items]
//   })
// }




// const pantalla = [
//   {
//     component: CNavItem,
//     name: "Inicio",
//     to: "/home",
//     icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
//   },
//   ...Menu
// ];




// const _nav = pantalla;

// export default _nav;

