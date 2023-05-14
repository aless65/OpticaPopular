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
import { getUsuario } from '../../redux/slices/usuario';

// ----------------------------------------------------------------------

export default function DetallesUsuario() {
    const { themeStretch } = useSettings();

    const usuario = useSelector((state) => state.usuario.usuario);

    const navigate = useNavigate();

    const { pathname } = useLocation();

    const { Id = '' } = useParams();

    useEffect(() => {
        if (Id) {
            dispatch(getUsuario(Id));
        }
    }, [Id, dispatch])

    return (
        <Page title="Usuarios">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={'Detalles usuario'}
                    links={[
                        { name: 'Inicio', href: PATH_DASHBOARD.root },
                        { name: 'Usuarios', href: PATH_ACCESO.usuarios },
                        { name: 'Detalles usuario' },
                    ]}
                />

                <Card sx={{ p: 3, pl: 4, pr: 4 }}>
                    <Grid container>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Id Usuario
                            </Typography>
                            <Typography fontSize={15} variant="body2">{usuario?.usua_Id}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Nombre de usuario
                            </Typography>
                            <Typography fontSize={15} variant="body2">{usuario?.usua_NombreUsuario}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Id Empleado
                            </Typography>
                            <Typography fontSize={15} variant="body2">{usuario?.empe_Id}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Nombre completo
                            </Typography>
                            <Typography fontSize={15} variant="body2">{usuario?.empe_NombreCompleto}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Id Rol
                            </Typography>
                            <Typography fontSize={15} variant="body2">{usuario?.role_Id}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Nombre
                            </Typography>
                            <Typography fontSize={15} variant="body2">{usuario?.role_Nombre}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Es admin
                            </Typography>
                            <Checkbox checked={usuario?.usua_EsAdmin} disabled={!usuario?.usua_EsAdmin} />
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
                                    <TableCell>{usuario?.usua_UsuCreacion_Nombre}</TableCell>
                                    <TableCell>{usuario?.usua_FechaCreacion}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Modificación</TableCell>
                                    <TableCell>{usuario?.usua_UsuModificacion_Nombre}</TableCell>
                                    <TableCell>{usuario?.usua_FechaModificacion}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Container>
        </Page>
    );
}
