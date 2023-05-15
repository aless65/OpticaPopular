/* eslint-disable camelcase */
import axios from 'axios';
import * as React from 'react';
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
    Stepper,
    Step,
    StepLabel,
    CardHeader,
    CardContent,
    Chip,
    FormHelperText,
    Tooltip,
    IconButton,
    TablePagination
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import dayjs from 'dayjs';
import { Control } from 'mapbox-gl';
import { useSnackbar } from 'notistack';
import { CheckoutBillingAddress, CheckoutPayment, CheckoutSummary } from '../../sections/@dashboard/e-commerce/checkout';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions, TableSkeleton } from '../../components/table';
import Scrollbar from '../../components/Scrollbar';
import { FormProvider, RHFTextField } from '../../components/hook-form';
// routes
import { PATH_DASHBOARD, PATH_OPTICA } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// sections
import { dispatch, useDispatch, useSelector } from '../../redux/store';
// sections
import { OrdenesTableRow, OrdenesTableToolbar } from '../../sections/@dashboard/optica/Ordenes-list-venta-step1';
import { OrderCompleteIllustration } from '../../assets';

// ----------------------------------------------------------------------

const TABLE_HEAD_ORDENES_STEP1 = [
    { id: '' },
    { id: '' },
    { id: 'orde_Id', label: 'Id', align: 'center' },
    { id: 'orde_Fecha', label: 'Fecha', align: 'center' },
    { id: 'orde_FechaEntrega', label: 'Fecha entrega', align: 'center' },
];

// ----------------------------------------------------------------------
const steps = ['Seleccionar cliente y/o cita', 'Datos de envío', 'Finalizar venta'];

export default function Ventas() {
    const { themeStretch } = useSettings();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [optionsCitas, setOptionsCitas] = useState([]);

    const [optionsClientes, setOptionsClientes] = useState([]);

    const [isLoading, setisloading] = useState(true);

    const [isCita, setIsCita] = useState(false);

    const [cita_Id, setCita_Id] = useState('');

    const [clie_Id, setClie_Id] = useState('');

    const [clieId, setClieId] = useState('');

    const [direccion, setDireccion] = useState([]);

    const [recargarListas, setrecargarListas] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
    const [mostrarContenedor, setMostrarContenedor] = useState(false);
    const [mostrarContenedorCitas, setMostrarContenedorCitas] = useState(true);
    const [mostrarContenedorClientes, setMostrarContenedorClientes] = useState(true);
    const [mostrarContenedorOBien, setMostrarContenedorOBien] = useState(true);
    const [mostrarErrorStep1, setMostrarErrorStep1] = useState(false);

    const [activeStep, setActiveStep] = React.useState(0);

    const [skipped, setSkipped] = React.useState(new Set());

    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable({
        defaultOrderBy: 'orde_Id',
    });

    const [tableData, setTableData] = useState([]);

    const [filterName, setFilterName] = useState('');

    const handleFilterName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };

    const dataFiltered = applySortFilter({
        tableData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const denseHeight = dense ? 60 : 80;

    const isNotFound = (!dataFiltered.length);

    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleDireccion = (value) => {
        if (isCita) {
            axios.get('Ordenes/Listado')
                .then(response => {
                    if (response.data.code === 200) {
                        const data = response.data.data.
                            filter(item => item.cita_Id === cita_Id)
                            .map(item => ({
                                clie_Id: item.clie_Id
                            }));

                        if (data.length === 0) {
                            enqueueSnackbar(`No puede seleccionar una direccion de envio ya que no posee ordenes en la cita`, { variant: 'warning' });
                        } else {
                            setDireccion(value);
                        }
                    }
                })
        }

        if (!isCita) {
            axios.get('Ordenes/Listado')
                .then(response => {
                    if (response.data.code === 200) {
                        const data = response.data.data.
                            filter(item => item.clie_Id === clieId)
                            .map(item => ({
                                clie_Id: item.clie_Id
                        }));

                        if (data.length === 0) {
                            enqueueSnackbar(`No puede seleccionar una direccion de envio ya que no posee ordenes`, { variant: 'warning' });
                        } else {
                            setDireccion(value);
                        }
                    }
                })
        }
    }

    const handleNext = () => {
        if (mostrarContenedorCitas && mostrarContenedorClientes) {
            setMostrarErrorStep1(true);
        } else if (mostrarContenedorClientes && selected.length === 0) {
            enqueueSnackbar(`Debe seleccionar al menos una orden para continuar`, { variant: 'warning' });
        } else if (selected.length > 0 && tableData.length === 0) {
            enqueueSnackbar(`Debe seleccionar al menos una orden para continuar`, { variant: 'warning' });
        } else {
            setMostrarErrorStep1(false);
            let newSkipped = skipped;
            if (isStepSkipped(activeStep)) {
                newSkipped = new Set(newSkipped.values());
                newSkipped.delete(activeStep);
            }

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("No puedes saltar este paso por que no es opcional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
        setClieId(0);
        setClie_Id([]);
        setTableData([]);
        setCita_Id(0);
        setSelected([]);
        setDireccion([]);
        setMostrarContenedor(false);
        setMostrarContenedorCitas(true);
        setMostrarContenedorClientes(true);
        setMostrarContenedorOBien(true);
        setrecargarListas(true);
    };
   
    useEffect(() => {
        // Agregar esta condicion al filter para la hora => && dayjs(new Date().setHours(data.deci_HoraInicio.substring(0, 2))).format('HH:mm:ss').substring(0, 2) < dayjs().format('HH:mm:ss').substring(0, 2)
        axios.get(`Citas/ListadoParaVentas`)
            .then((response) => {
                const optionsData = response.data.data.filter(data =>
                    data.deci_Id !== 0 &&
                    dayjs(data.cita_Fecha).format('DD/MM/YYYY') === dayjs(new Date()).format('DD/MM/YYYY')
                ).map(item => ({
                    label: `${item.clie_Nombres + [' '] + item.clie_Apellidos + [' - '] + item.cons_Nombre + [' - '] + item.deci_HoraInicio + ['-'] + item.deci_HoraFin + [' - '] + dayjs(item.cita_Fecha).format('DD/MM/YYYY')}`,
                    id: item.cita_Id
                }));

                setOptionsCitas(optionsData);
            })
            .catch(error => console.error(error));

        axios.get('Clientes/Listado')
            .then((response) => {
                const optionsData = response.data.data.map(item => ({
                    id: item.clie_Id,
                    label: `${item.clie_Nombres + [' '] + item.clie_Apellidos}`
                }));

                setOptionsClientes(optionsData);
            })
            .catch(error => console.error(error));
    }, [recargarListas]);

    useEffect(() => {
        setTableData([]);
        axios.get(`Ordenes/ListadoOrdenesVentaCliente`)
            .then((response) => {
                if (response.data.code === 200) {
                    if (response.data.data.length > 0) {
                        const data = response.data.data.filter(item =>
                            item.clie_Id === clie_Id &&
                            item.cita_Id === 0 &&
                            dayjs(item.orde_Fecha).format('DD/MM/YYYY') === dayjs().format('DD/MM/YYYY')
                        ).map(item => ({
                            clie_Id: item.clie_Id,
                            orde_Id: item.orde_Id,
                            orde_Fecha: item.orde_Fecha,
                            orde_FechaEntrega: item.orde_FechaEntrega
                        }));
                        setIsCita(false);
                        setTableData(data);
                        setisloading(false);
                    }
                }
            })
            .catch(error => console.error(error));

        if (clie_Id !== null) {
            setClieId(clie_Id);
        }
    }, [clie_Id]);

    useEffect(() => {
        setTableData([]);
        axios.get(`Citas/BuscarCitaPorId/${cita_Id}`)
            .then((respuesta) => {
                setClieId(respuesta.data.data.clie_Id);
                if (respuesta.data.code === 200) {
                    axios.get(`Ordenes/ListadoXSucursales?id=${JSON.parse(localStorage.getItem('usuario')).usua_EsAdmin === true ? 0 : localStorage.getItem('sucu_Id')}`)
                        .then((response1) => {
                            if (response1.data.code === 200) {
                                if (response1.data.data.length > 0) {
                                    const data = response1.data.data.filter(item =>
                                        item.cita_Id === cita_Id &&
                                        dayjs(item.orde_Fecha).format('DD/MM/YYYY') === dayjs().format('DD/MM/YYYY')
                                    ).map(item => ({
                                        clie_Id: item.clie_Id,
                                        orde_Id: item.orde_Id,
                                        orde_Fecha: item.orde_Fecha,
                                        orde_FechaEntrega: item.orde_FechaEntrega
                                    }));
                                    setIsCita(true);
                                    setTableData(data);
                                    setisloading(false);
                                }
                            }
                        })
                        .catch(error => console.error(error));
                }
            });
    }, [cita_Id])

    return (
        <Page title="Ventas">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={'Ventas'}
                    links={[
                        { name: 'Inicio', href: PATH_DASHBOARD.root },
                        { name: 'Ventas', href: PATH_OPTICA.citas },
                    ]}
                />

                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep} alternativeLabel  >
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            if (isStepOptional(index)) {
                                labelProps.optional = (
                                    <Typography variant="caption">Opcional</Typography>
                                );
                            }
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleReset}>Regresar</Button>
                            </Box>
                            <Box sx={{ p: 4, maxWidth: 480, margin: 'auto' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" paragraph>
                                        Gracias por su compra!
                                    </Typography>

                                    <OrderCompleteIllustration sx={{ height: 260, my: 10 }} />
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Atras
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                {isStepOptional(activeStep) && (
                                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                        Omitir
                                    </Button>
                                )}
                                <Button onClick={handleNext} style={{ display: activeStep === 2 ? 'none' : '' }}>
                                    {activeStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
                                </Button>
                            </Box>
                            <br />
                            <Container style={{ display: activeStep === 0 ? '' : 'none' }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12}>
                                        <Card sx={{ p: 3, pl: 4, pr: 4 }} >
                                            <CardContent>
                                                <Container>
                                                    <div style={{ display: mostrarContenedorCitas ? '' : 'none' }}>
                                                        <Typography variant="h6" style={{ textAlign: 'center' }}>
                                                            Seleccione una cita
                                                        </Typography>
                                                        <br />
                                                        <Autocomplete
                                                            id="cita_Id"
                                                            options={optionsCitas}
                                                            renderInput={(params) => <TextField {...params} label="Citas" />}
                                                            onChange={(event, value) => {
                                                                if (value !== null) {
                                                                    setCita_Id(value.id);
                                                                    setClie_Id('');
                                                                    setMostrarContenedor(true);
                                                                    setMostrarContenedorOBien(false);
                                                                    setMostrarContenedorClientes(false);
                                                                    setMostrarErrorStep1(false);
                                                                } else {
                                                                    setCita_Id('');
                                                                    setMostrarContenedor(false);
                                                                    setMostrarContenedorOBien(true);
                                                                    setMostrarContenedorClientes(true);
                                                                }
                                                                setDireccion([]);
                                                            }}
                                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                                        />
                                                    </div>
                                                    <div style={{ display: mostrarContenedorOBien ? '' : 'none' }}>
                                                        <br />
                                                        <Divider orientation='horizontal' >
                                                            <Chip label='O bien' />
                                                        </Divider>
                                                        <br />
                                                    </div>
                                                    <div style={{ display: mostrarContenedorClientes ? '' : 'none' }}>
                                                        <Typography variant="h6" style={{ textAlign: 'center' }}>
                                                            Seleccione un cliente
                                                        </Typography>
                                                        <br />
                                                        <Autocomplete
                                                            id="clie_Id"
                                                            options={optionsClientes}
                                                            renderInput={(params) => <TextField {...params} label="Cliente" />}
                                                            onChange={(event, value) => {
                                                                if (value !== null) {
                                                                    setClie_Id(value.id);
                                                                    setCita_Id('');
                                                                    setMostrarContenedorCitas(false);
                                                                    setMostrarContenedorOBien(false);
                                                                    setMostrarErrorStep1(false);
                                                                    setMostrarContenedor(true);
                                                                } else {
                                                                    setClieId('');
                                                                    setMostrarContenedor(false);
                                                                    setMostrarContenedorCitas(true);
                                                                    setMostrarContenedorOBien(true);
                                                                }
                                                                setSelected([]);
                                                                setDireccion([]);
                                                            }}
                                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                                        />
                                                    </div>
                                                    {mostrarErrorStep1 && (
                                                        <FormHelperText error sx={{ pt: 1, px: 1 }}>
                                                            Debe seleccionar un cliente o una cita para continuar
                                                        </FormHelperText>
                                                    )}
                                                </Container>
                                            </CardContent>
                                        </Card>
                                        <div style={{ display: mostrarContenedor ? '' : 'none' }}>
                                            <br />
                                            <br />
                                            <Divider />
                                            <br />
                                            <Container>
                                                <Typography style={{ textAlign: 'center' }}>
                                                    <Chip label='Seleccione una o varias ordenes' style={{ fontSize: 'large', display: isCita ? 'none' : '' }} />
                                                </Typography>
                                            </Container>
                                            <br />
                                            <Card>
                                                <OrdenesTableToolbar filterName={filterName} onFilterName={handleFilterName} />
                                                <Scrollbar>
                                                    <TableContainer sx={{ minWidth: 800 }}>
                                                        {selected.length > 0 && tableData.length > 0 && !isCita && (
                                                            <TableSelectedActions
                                                                dense={dense}
                                                                numSelected={selected.length}
                                                                rowCount={tableData.length}
                                                                onSelectAllRows={(checked) =>
                                                                    onSelectAllRows(
                                                                        checked,
                                                                        tableData.map((row) => row.orde_Id)
                                                                    )
                                                                }
                                                            />
                                                        )}

                                                        <Table size={dense ? 'small' : 'medium'}>
                                                            <TableHeadCustom
                                                                order={order}
                                                                orderBy={orderBy}
                                                                headLabel={TABLE_HEAD_ORDENES_STEP1}
                                                                rowCount={tableData.length}
                                                                numSelected={selected.length}
                                                                onSort={onSort}
                                                                onSelectAllRows={(checked) =>
                                                                    onSelectAllRows(
                                                                        checked,
                                                                        tableData.map((row) => row.orde_Id)
                                                                    )
                                                                }
                                                            />

                                                            <TableBody>
                                                                {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                    .map((row, index) =>
                                                                        row ? (
                                                                            <OrdenesTableRow
                                                                                key={row.orde_Id}
                                                                                row={row}
                                                                                selected={selected.includes(row.orde_Id)}
                                                                                onSelectRow={() => onSelectRow(row.orde_Id)}
                                                                                isCita={isCita}
                                                                            />
                                                                        ) : (
                                                                            !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                                                                        )
                                                                    )}

                                                                <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                                                                <TableNoData isNotFound={isNotFound} />
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Scrollbar>
                                                <Box sx={{ position: 'relative' }}>
                                                    <TablePagination
                                                        rowsPerPageOptions={[5, 10, 25]}
                                                        component="div"
                                                        count={dataFiltered.length}
                                                        rowsPerPage={rowsPerPage}
                                                        page={page}
                                                        onPageChange={onChangePage}
                                                        onRowsPerPageChange={onChangeRowsPerPage}
                                                    />
                                                    <FormControlLabel
                                                        control={<Switch checked={dense} onChange={onChangeDense} />}
                                                        label="Denso"
                                                        sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
                                                    />
                                                </Box>
                                            </Card>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Container>
                            <Container style={{ display: activeStep === 1 ? '' : 'none' }}>
                                <CheckoutBillingAddress clie_Id={clieId} cita_Id={cita_Id} ordenes={selected} nextStep={handleNext} direccion={handleDireccion} />
                            </Container>
                            <Container style={{ display: activeStep === 2 ? '' : 'none' }}>
                                <CheckoutPayment onBackStep={handleBack} direccion={direccion} clie_Id={clieId} cita_Id={cita_Id} ordenes={selected} stepActive={activeStep} nextStep={handleNext} />
                            </Container>
                            <Box sx={{ display: activeStep === 0 ? 'flex' : 'none', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Atras
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                {isStepOptional(activeStep) && (
                                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                        Omitir
                                    </Button>
                                )}
                                <Button onClick={handleNext} style={{ display: activeStep === 2 ? 'none' : '' }}>
                                    {activeStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Container>
        </Page>
    );
}

function applySortFilter({ tableData, comparator, filterName }) {
    const stabilizedThis = tableData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    tableData = stabilizedThis.map((el) => el[0]);

    if (filterName) {
        tableData = tableData.filter((item) =>
            item.orde_Id.toString().indexOf(filterName.toLowerCase()) !== -1 ||
            item.orde_Fecha.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            item.orde_FechaEntrega.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        );
    }
    return tableData;
}
