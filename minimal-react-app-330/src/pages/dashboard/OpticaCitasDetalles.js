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
import { getcita } from '../../redux/slices/citas';

// ----------------------------------------------------------------------

export default function DetallesCita() {
    const { themeStretch } = useSettings();

    const cita = useSelector((state) => state.cita.cita);

    const navigate = useNavigate();

    const { pathname } = useLocation();

    const { Id = '' } = useParams();

    useEffect(() => {
        if (Id) {
            dispatch(getcita(Id));
        }
    }, [Id, dispatch])

    return (
        <Page title="Citas">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={'Detalles cita'}
                    links={[
                        { name: 'Inicio', href: PATH_DASHBOARD.root },
                        { name: 'Citas', href: PATH_OPTICA.citas },
                        { name: 'Detalles cita' },
                    ]}
                />

                <Card sx={{ p: 3, pl: 4, pr: 4 }}>
                    <Grid container>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Id Cita
                            </Typography>
                            <Typography fontSize={15} variant="body2">{cita?.cita_Id}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Fecha cita
                            </Typography>
                            <Typography fontSize={15} variant="body2">{dayjs(cita?.cita_Fecha).format('DD/MM/YYYY')}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Id Cliente
                            </Typography>
                            <Typography fontSize={15} variant="body2">{cita?.clie_Id}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Nombre completo
                            </Typography>
                            <Typography fontSize={15} variant="body2">{`${cita?.clie_Nombres} ${cita?.clie_Apellidos}`}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Id Sucursal
                            </Typography>
                            <Typography fontSize={15} variant="body2">{cita?.sucu_Id}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Nombre
                            </Typography>
                            <Typography fontSize={15} variant="body2">{cita?.sucu_Descripcion}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Id Empleado
                            </Typography>
                            <Typography fontSize={15} variant="body2">{cita?.empe_Id}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Nombre completo
                            </Typography>
                            <Typography fontSize={15} variant="body2">{`${cita?.empe_Nombres} ${cita?.empe_Apellidos}`}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Id Consultorio
                            </Typography>
                            <Typography fontSize={15} variant="body2">{cita?.cons_Id}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Nombre
                            </Typography>
                            <Typography fontSize={15} variant="body2">{cita?.cons_Nombre}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Hora inicio
                            </Typography>
                            <Typography fontSize={15} variant="body2">{cita?.deci_HoraInicio}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Hora fin
                            </Typography>
                            <Typography fontSize={15} variant="body2">{cita?.deci_HoraFin}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={6} sm={6} sx={{ mb: 5 }}>
                            <Typography fontSize={15} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                                Precio de la cita
                            </Typography>
                            <Typography fontSize={15} variant="body2">{cita?.deci_Costo === 0 ? '' : cita?.deci_Costo}</Typography>
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
                                    <TableCell>{cita?.usua_NombreCreacion}</TableCell>
                                    <TableCell>{cita?.cita_FechaCreacion}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Modificación</TableCell>
                                    <TableCell>{cita?.usua_NombreModificacion}</TableCell>
                                    <TableCell>{cita?.cita_FechaModificacion}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Container>
        </Page>
    );
}
