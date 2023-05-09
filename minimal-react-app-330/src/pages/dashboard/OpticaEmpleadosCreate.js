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
import EmpleadoNewEditForm from '../../sections/@dashboard/optica/EmpleadoNewEditForm';
import { useDispatch, useSelector } from '../../redux/store';
import { getEmpleado } from '../../redux/slices/empleado';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  // const { empe_Id = '' } = useParams();

  const dispatch = useDispatch();

  const empleado = useSelector((state) => state.empleado.empleado);

  const isEdit = pathname.includes('editar');

  useEffect(() => {
    if(isEdit){
      dispatch(getEmpleado(name));
    }
  }, [name]);

  // const currentEmpleado = _userList.find((user) => paramCase(user.name) === name);

  const currentEmpleado = isEdit ? empleado : null;

  return (
    <Page title="Empleado: Crear nuevo">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Crear nuevo empleado' : 'Editar empleado'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Empleados', href: PATH_OPTICA.empleados },
            { name: !isEdit ? 'Nuevo empleado' : 'Editar empleado'  },
          ]}
        />
        <EmpleadoNewEditForm isEdit={isEdit} currentEmpleado={currentEmpleado} />
      </Container>
    </Page>
  );
}
