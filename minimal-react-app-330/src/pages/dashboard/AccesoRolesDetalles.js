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
    Table,
    Checkbox
} from '@mui/material';

import dayjs from 'dayjs';
import { Control } from 'mapbox-gl';
import { FormProvider, RHFTextField } from '../../components/hook-form';
// routes
import { PATH_DASHBOARD, PATH_OPTICA, PATH_ACCESO } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { dispatch, useDispatch, useSelector } from '../../redux/store';
import { getRol } from '../../redux/slices/rol';

// ----------------------------------------------------------------------

export default function DetallesUsuario() {
    const { themeStretch } = useSettings();

    const rol = useSelector((state) => state.rol.rol);

    const navigate = useNavigate();

    const { pathname } = useLocation();

    const { Id = '' } = useParams();

    useEffect(() => {
        if (Id) {
            dispatch(getRol(Id));
        }
    }, [Id, dispatch])

    return (
        <Page title="Roles">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={'Detalles rol'}
                    links={[
                        { name: 'Inicio', href: PATH_DASHBOARD.root },
                        { name: 'Roles', href: PATH_ACCESO.roles },
                        { name: 'Detalles roles' },
                    ]}
                />

                <Card sx={{ p: 3, pl: 4, pr: 4 }}>
                    <Grid container>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Id Rol
                            </Typography>
                            <Typography fontSize={15} variant="body2">{rol?.role_Id}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Nombre de rol
                            </Typography>
                            <Typography fontSize={15} variant="body2">{rol?.role_Nombre}</Typography>
                        </Grid>
                    </Grid>
                </Card>
                <br />
                <Card sx={{ p: 3, pl: 4, pr: 4 }}>
                    <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                        Campos de auditoría
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow hover selected>
                                    <TableCell>Acción</TableCell>
                                    <TableCell>Usuario</TableCell>
                                    <TableCell>Fecha</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Creación</TableCell>
                                    <TableCell>{rol?.role_NombreUsuarioCreacion}</TableCell>
                                    <TableCell>{rol?.role_FechaCreacion}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Modificación</TableCell>
                                    <TableCell>{rol?.role_NombreUsuarioModificacion}</TableCell>
                                    <TableCell>{rol?.role_FechaModificacion}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Container>
        </Page>
    );
}
