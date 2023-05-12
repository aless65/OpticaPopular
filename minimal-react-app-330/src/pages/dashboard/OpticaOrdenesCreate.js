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
import OrdenNewEditForm from '../../sections/@dashboard/optica/OrdenNewEditForm';
import { useDispatch, useSelector } from '../../redux/store';
import { getOrden } from '../../redux/slices/orden';

// ----------------------------------------------------------------------

export default function OrdenCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  // const { empe_Id = '' } = useParams();

  const dispatch = useDispatch();

  const orden = useSelector((state) => state.orden.orden);

  const isEdit = pathname.includes('editar');

  useEffect(() => {
    if(isEdit){
      dispatch(getOrden(name));
    }
  }, [name]);

  // const currentEmpleado = _userList.find((user) => paramCase(user.name) === name);

  const currentOrden = isEdit ? orden : null;

  return (
    <Page title="Orden: Crear nueva">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Crear orden' : 'Editar orden'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Órdenes', href: PATH_OPTICA.ordenes },
            { name: !isEdit ? 'Nueva orden' : 'Editar orden' },
          ]}
        />
        <OrdenNewEditForm isEdit={isEdit} currentOrden={currentOrden} />
      </Container>
    </Page>
  );
}
