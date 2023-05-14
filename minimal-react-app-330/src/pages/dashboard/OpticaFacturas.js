/* eslint-disable camelcase */
import { paramCase, capitalCase } from 'change-case';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import {
    Container,
    Box,
    Card,
    Grid,
    Stack,
    Switch,
    Typography,
    FormControlLabel,
    FormControl,
    Autocomplete,
    TextField,
    Radio,
    RadioGroup,
    FormLabel,
    styled,
    Button,
    Divider,
    TableRow,
    TableCell,
    TableContainer,
    TableBody,
    Table
} from '@mui/material';

import dayjs from 'dayjs';
import { Control } from 'mapbox-gl';
import { FormProvider, RHFTextField } from '../../components/hook-form';
// routes
import { PATH_DASHBOARD, PATH_OPTICA } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { dispatch, useDispatch, useSelector } from '../../redux/store';

// ----------------------------------------------------------------------

export default function Facturas() {
    const { themeStretch } = useSettings();

    const navigate = useNavigate();

    const [isLoadingPage, setIsLoadingPage] = useState(true);


    // ----------------------------------------------------------------------

    useEffect(() => {
        fetch(`http://opticapopular.somee.com/api/Pantallas/PantallasAccesos?role_Id=${JSON.parse(localStorage.getItem('usuario')).role_Id}&esAdmin=${JSON.parse(localStorage.getItem('usuario')).usua_EsAdmin}&pant_Nombre=facturas`)
            .then(response => response.json())
            .then(data => {
                if (data === 0) {
                    navigate(PATH_DASHBOARD.general.app);
                } else {
                    setIsLoadingPage(false);
                }
            })
            .catch(error => console.error(error));

    }, [])

    if (isLoadingPage) {
        return null;
    }

    return (
        <Page title="Facturas">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={'Listado de facturas'}
                    links={[
                        { name: 'Inicio', href: PATH_DASHBOARD.root },
                        { name: 'Facturas', href: PATH_OPTICA.facturas },
                    ]}
                />


            </Container>
        </Page>
    );
}
