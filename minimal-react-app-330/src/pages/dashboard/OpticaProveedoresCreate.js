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
import ProveedorNewEditForm from '../../sections/@dashboard/optica/ProveedorNewEditForm';
import { useDispatch, useSelector } from '../../redux/store';
import { getProveedor } from '../../redux/slices/proveedor'; 

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings(); 

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  // const { empe_Id = '' } = useParams();

  const dispatch = useDispatch();

  const proveedor = useSelector((state) => state.proveedor.proveedor);

  const isEdit = pathname.includes('editar');

  useEffect(() => {
    if(isEdit){
      dispatch(getProveedor(name));
    }
  }, [name]);

  // const currentEmpleado = _userList.find((user) => paramCase(user.name) === name);

  const currentProveedor = isEdit ? proveedor : null;

  return (
    <Page title="Proveedor: Crear nuevo">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Crear nuevo proveeedor' : 'Editar proveedor'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Proveeedores', href: PATH_OPTICA.proveedores },
            { name: !isEdit ? 'Nuevo proveeedor' : 'Editar proveedor'  },
          ]}
        />
        <ProveedorNewEditForm isEdit={isEdit} currentProveedor={currentProveedor} />
      </Container>
    </Page>
  );
}
