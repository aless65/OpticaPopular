/* eslint-disable camelcase */
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_OPTICA } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock'; 
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import SucursalNewEditForm from '../../sections/@dashboard/optica/SucursalNewEditForm';
import { useDispatch, useSelector } from '../../redux/store';
import { getSucursal } from '../../redux/slices/sucursal';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  // const { empe_Id = '' } = useParams();

  const dispatch = useDispatch();

  const sucursal = useSelector((state) => state.sucursal.sucursal);

  const isEdit = pathname.includes('editar');

  useEffect(() => {
    if(isEdit){
      dispatch(getSucursal(name));
    }
  }, [name]);

  // const currentEmpleado = _userList.find((user) => paramCase(user.name) === name);

  const currentSucursal = isEdit ? sucursal : null;

  return (
    <Page title="Sucursal: Crear nueva">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Crear nuevo sucursal' : 'Editar sucursal'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Sucursales', href: PATH_OPTICA.sucursales },
            { name: !isEdit ? 'Nueva sucursal' : 'Editar sucursal' },
          ]}
        />
        <SucursalNewEditForm isEdit={isEdit} currentEmpleado={currentSucursal} />
      </Container>
    </Page>
  );
}
