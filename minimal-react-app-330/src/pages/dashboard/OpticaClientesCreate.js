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
import ClienteNewEditForm from '../../sections/@dashboard/optica/ClienteNewEditForm';
import { useDispatch, useSelector } from '../../redux/store';
import { getCliente } from '../../redux/slices/cliente';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  // const { empe_Id = '' } = useParams();

  const dispatch = useDispatch();

  const cliente = useSelector((state) => state.cliente.cliente);

  const isEdit = pathname.includes('editar');

  useEffect(() => {
    if(isEdit){
      dispatch(getCliente(name));
    }
  }, [name]);

  // const currentEmpleado = _userList.find((user) => paramCase(user.name) === name);

  const currentUser = isEdit ? cliente : null;

  return (
    <Page title="Cliente: Crear nuevo">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Crear nuevo cliente' : 'Editar cliente'}
          links={[
            { name: 'Inicio', href: PATH_DASHBOARD.root },
            { name: 'Clientes', href: PATH_OPTICA.clientes },
            { name: !isEdit ? 'Nuevo cliente' : 'Editar cliente'  },
          ]}
        />
        <ClienteNewEditForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
