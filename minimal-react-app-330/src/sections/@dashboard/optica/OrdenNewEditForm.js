
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton, DatePicker } from '@mui/lab';
import {
    Box,
    Card,
    Grid,
    Stack,
    Switch,
    Typography,
    TableCell,
    FormControlLabel,
    FormControl,
    Autocomplete,
    Table,
    TableBody,
    TableContainer,
    TextField,
    Radio,
    RadioGroup,
    FormLabel,
    styled,
    Button,
    TablePagination,
    IconButton,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD, PATH_OPTICA } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import {
    TableNoData,
    TableSkeleton,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedActions,
} from '../../../components/table';
import Label from '../../../components/Label';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFRadioGroup } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';
import { EmpleadoTableRow, TableToolbar } from './empleado-list';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
// import sucursal from 'src/redux/slices/sucursal';

// ----------------------------------------------------------------------
const IncrementerStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(0.5, 0.75),
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${theme.palette.grey[500_32]}`,
}));


// eslint-disable-next-line no-use-before-define
OrdenNewEditForm.propTypes = {
    isEdit: PropTypes.bool,
    currentUser: PropTypes.object,
    onDecreaseQuantity: PropTypes.func,
    onIncreaseQuantity: PropTypes.func,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));



export default function OrdenNewEditForm({ isEdit, currentOrden, onIncreaseQuantity, onDecreaseQuantity, quantity, available }) {
    const navigate = useNavigate();

    const [tableData, setTableData] = useState([]);

    const [filterName, setFilterName] = useState('');


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
        defaultOrderBy: 'empe_NombreCompleto',
    });

    // eslint-disable-next-line no-use-before-define
    const dataFiltered = applySortFilter({
        tableData,
        comparator: getComparator(order, orderBy),
        filterName,
    });


    const { enqueueSnackbar } = useSnackbar();

    const { empleados, isLoading } = useSelector((state) => state.empleado);

    const [optionsClientes, setOptionsClientes] = useState([]);

    const [optionsAros, setOptionsAros] = useState([]);

    const [optionsSucursales, setOptionsSucursales] = useState([]);

    const [encabezadoInserted, setEncabezadoInserted] = useState(false);

    const [ordeId, setOrdeId] = useState(currentOrden?.orde_Id || '');


    quantity = 1;

    // const [estadoCivilTemporal, setEstadoCivilTemporal] = useState(currentEmpleado?.estacivi_Id || '');

    const FirstFormSchema = Yup.object().shape({
        cliente: Yup.string().required('Cliente requerido'),
        fecha: Yup.string().required('Fecha requerida'),
        fechaEntrega: Yup.string().required('Fecha requerida').nullable(),
        sucursal: Yup.string().required('Sucursal requerida').nullable(),
        // avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
    });

    const SecondFormSchema = Yup.object().shape({
        aros: Yup.string().required('Aros requeridos'),
        precio: Yup.string().required('Precio requerido'),
        graduacionLeft: Yup.string().required('Graduación requerida'),
        graduacionRight: Yup.string().required('Graduación requerida'),
        cantidad: Yup.string().required('Cantidad requerida'),
        // avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
    });

    const defaultValues = useMemo(
        () => ({
            cliente: currentOrden?.clie_Id || '',
            fecha: currentOrden?.orde_Fecha || new Date(),
            fechaEntrega: currentOrden?.orde_FechaEntrega || '',
            sucursal: currentOrden?.sucu_Id || '',
            aros: '',
            precio: '',
            graduacionLeft: '',
            graduacionRight: '',
            cantidad: ''
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentOrden]
    );

    const methods = useForm({
        resolver: yupResolver(FirstFormSchema, SecondFormSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (isEdit && currentOrden) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentOrden]);

    const onSubmit = async (data) => {
        try {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // add 1 to month to get 1-based month number
            const day = date.getDate();
            const formattedFecha = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            const dateEntrega = new Date(data.fechaEntrega);
            const yearEntrega = date.getFullYear();
            const monthEntrega = date.getMonth() + 1; // add 1 to month to get 1-based month number
            const dayEntrega = date.getDate();
            const formattedFechaEntrega = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            const jsonData = {
                orde_Id: currentOrden?.orde_Id,
                clie_Id: data.cliente,
                orde_Fecha: formattedFecha,
                orde_FechaEntrega: formattedFechaEntrega,
                sucu_Id: data.sucursal,
                usua_IdCreacion: 1,
            };

            console.log(jsonData);

            if (isEdit) {
                fetch("http://opticapopular.somee.com/api/Ordenes/Editar", {
                    method: "PUT",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(jsonData),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        if (data.message === "El empleado ha sido editado con éxito") {
                            navigate(PATH_OPTICA.empleados);
                            enqueueSnackbar(data.message);
                        } else if (data.message === 'Ya existe un empleado con este número de identidad') {
                            enqueueSnackbar(data.message, { variant: 'warning' });
                        } else {
                            enqueueSnackbar(data.message, { variant: 'error' });
                        }
                    })
                    .catch((error) => console.error(error));
            } else {
                fetch("http://opticapopular.somee.com/api/Ordenes/Insertar", {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(jsonData),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        if (data.message === "Ha ocurrido un error") {
                            enqueueSnackbar(data.message, { variant: 'error' });
                        } else {
                            enqueueSnackbar(data.message);
                            setOrdeId(data.message);
                            setEncabezadoInserted(true);
                        }
                    })
                    .catch((error) => console.error(error));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmitDetalle = async (data) => {
        try {
            const dateStr = data.fechaNacimiento;
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // add 1 to month to get 1-based month number
            const day = date.getDate();
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;


            const jsonData = {
                empe_Id: currentOrden?.empe_Id,
                empe_Nombres: data.nombres,
                empe_Apellidos: data.apellidos,
                empe_Identidad: data.identidad,
                empe_FechaNacimiento: formattedDate,
                empe_Sexo: data.sexo,
                estacivi_Id: data.estadoCivil,
                empe_Telefono: data.telefono,
                empe_CorreoElectronico: data.email,
                dire_DireccionExacta: data.direccion,
                muni_Id: data.municipio,
                carg_Id: data.cargo,
                sucu_Id: data.sucursal,
                empe_UsuCreacion: 1,
                empe_UsuModificacion: 1,
            };

            fetch("http://opticapopular.somee.com/api/Empleados/Insertar", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    if (data.message === "El empleado ha sido ingresado con éxito") {
                        navigate(PATH_OPTICA.empleados);
                        enqueueSnackbar(data.message);
                    } else if (data.message === 'Ya existe un empleado con este número de identidad') {
                        enqueueSnackbar(data.message, { variant: 'warning' });
                    } else {
                        enqueueSnackbar(data.message, { variant: 'error' });
                    }
                })
                .catch((error) => console.error(error));
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {

        fetch('http://opticapopular.somee.com/api/Clientes/Listado')
            .then(response => response.json())
            .then(data => {
                const optionsData = data.data.map(item => ({
                    label: item.clie_NombreCompleto, // replace 'name' with the property name that contains the label
                    id: item.clie_Id // replace 'id' with the property name that contains the ID
                }));
                setOptionsClientes(optionsData);
            })
            .catch(error => console.error(error));

        fetch('http://opticapopular.somee.com/api/Sucursales/Listado')
            .then(response => response.json())
            .then(data => {
                const optionsData = data.data.map(item => ({
                    label: item.sucu_Descripcion, // replace 'name' with the property name that contains the label
                    id: item.sucu_Id // replace 'id' with the property name that contains the ID
                }));
                setOptionsSucursales(optionsData);
            })
            .catch(error => console.error(error));

    }, [currentOrden]);

    useEffect(() => {
        fetch(`http://opticapopular.somee.com/api/Aros/ListadoXSucursal?id=${defaultValues.sucursal}`)
            .then(response => response.json())
            .then(data => {
                const optionsData = data.data.map(item => ({
                    label: item.aros_Descripcion, // replace 'name' with the property name that contains the label
                    id: item.aros_Id // replace 'id' with the property name that contains the ID
                }));
                setOptionsAros(optionsData);
            })
            .catch(error => console.error(error));
    }, [defaultValues.sucursal]);

    const denseHeight = dense ? 60 : 80;

    const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

    return (
        
<>
        <Box sx={{ display: 'flex', gap: '16px', height: '100%' }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Card sx={{ flex: 1, p: 3, pl: 4, pr: 4 }}>
                    <Box
                        sx={{
                            display: 'grid',
                            columnGap: 2,
                            rowGap: 3,
                            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                        }}
                    >
                        <Autocomplete
                            disablePortal
                            name="cliente"
                            options={optionsClientes}
                            error={!!errors.cliente}
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Cliente"
                                    error={!!errors.cliente}
                                    helperText={errors.cliente?.message}
                                />
                            )}
                            onChange={(event, value) => {
                                if (value != null) {
                                    methods.setValue('cliente', value.id);
                                    // setEstadoCivilTemporal(value.id);
                                    defaultValues.cliente = value.id;
                                    // console.log(defaultValues.estadoCivil);
                                } else {
                                    methods.setValue('cliente', '');
                                    defaultValues.cliente = '';
                                }
                            }}
                            disabled={encabezadoInserted}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            value={optionsClientes.find(option => option.id === defaultValues.cliente) ?? null}
                        />

                        <Controller
                            name="fecha"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <DatePicker
                                    label="Fecha"
                                    value={field.value || new Date()}
                                    minDate={new Date()}
                                    onChange={(newValue) => {
                                        field.onChange(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                                    )}
                                    disabled
                                />
                            )}
                        />

                        <Controller
                            name="fechaEntrega"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <DatePicker
                                    label="Fecha de Entrega"
                                    value={field.value || null}
                                    onChange={(newValue) => {
                                        field.onChange(newValue);
                                        if (newValue < new Date()) {
                                            enqueueSnackbar("La fecha de entrega debe ser posterior a la fecha actual", { variant: 'warning' });
                                            field.onChange(null);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                                    )}
                                    disabled={encabezadoInserted}
                                />
                            )}
                        />

                        <Autocomplete
                            disablePortal
                            name="sucursal"
                            options={optionsSucursales}
                            error={!!errors.sucursal}
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Sucursal"
                                    error={!!errors.sucursal}
                                    helperText={errors.sucursal?.message}
                                />
                            )}
                            onChange={(event, value) => {
                                if (value != null) {
                                    methods.setValue('sucursal', value.id);
                                    // setEstadoCivilTemporal(value.id);
                                    defaultValues.sucursal = value.id;
                                    // console.log(defaultValues.estadoCivil);
                                } else {
                                    methods.setValue('sucursal', '');
                                    defaultValues.sucursal = '';
                                }
                            }}
                            disabled={encabezadoInserted}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            value={optionsSucursales.find(option => option.id === defaultValues.sucursal) ?? null}
                        />

                    </Box>

                    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                        {/* <Button to={PATH_DASHBOARD.optica.empleados}>Cancelar</Button> */}
                        <LoadingButton type="submit" variant="contained" disabled={encabezadoInserted} loading={isSubmitting}>
                            Siguiente
                        </LoadingButton>
                    </Stack>
                </Card>
            </FormProvider>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitDetalle)}>
                <Card sx={{ flex: 1, p: 3, pl: 4, pr: 4 }}>
                    <Box
                        sx={{
                            display: 'grid',
                            columnGap: 2,
                            rowGap: 3,
                            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                        }}
                    >
                        <Autocomplete
                            disablePortal
                            name="aros"
                            options={optionsAros}
                            error={!!errors.aros}
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Aros"
                                    error={!!errors.aros}
                                    helperText={errors.aros?.message}
                                />
                            )}
                            onChange={(event, value) => {
                                if (value != null) {
                                    methods.setValue('aros', value.id);
                                    defaultValues.aros = value.id;
                                } else {
                                    methods.setValue('aros', '');
                                    defaultValues.aros = '';
                                }
                            }}
                            disabled={!encabezadoInserted}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            value={optionsAros.find(option => option.id === defaultValues.aros) ?? null}
                        />

                        <RHFTextField name="precio" disabled label="Precio" />
                        <RHFTextField name="graduacionLeft" disabled={!encabezadoInserted} label="Graduación izquierdo" />
                        <RHFTextField name="graduacionRight" disabled={!encabezadoInserted} label="Graduación derecho" />
                        <TableCell align="left">
                            <Incrementer
                                quantity={quantity}
                                available={available}
                                onDecrease={() => onDecreaseQuantity()}
                                onIncrease={() => onIncreaseQuantity()}
                            />
                        </TableCell>
                    </Box>
                </Card>

            </FormProvider>
        </Box>
    <br/>
<Card>
    <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
            <Table size={dense ? 'small' : 'medium'}>

                <TableBody>
                    {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) =>
                            row ? (
                                <EmpleadoTableRow
                                    key={row.empe_Id}
                                    row={row}
                                    selected={selected.includes(row.empe_Id)}
                                // onSelectRow={() => onSelectRow(row.empe_Id)}
                                // onDeleteRow={() => handleDeleteRow(row.empe_Id)}
                                // onEditRow={() => handleEditRow(row.empe_Id)}
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
</>
    );
}

// ----------------------------------------------------------------------
// eslint-disable-next-line no-use-before-define
Incrementer.propTypes = {
    available: PropTypes.number,
    quantity: PropTypes.number,
    onIncrease: PropTypes.func,
    onDecrease: PropTypes.func,
};

function Incrementer({ available, quantity, onIncrease, onDecrease }) {
    return (
        <Box sx={{ width: 96, textAlign: 'right' }}>
            <IncrementerStyle>
                <IconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
                    <Iconify icon={'eva:minus-fill'} width={16} height={16} />
                </IconButton>
                {quantity}
                <IconButton size="small" color="inherit" onClick={onIncrease} disabled={quantity >= available}>
                    <Iconify icon={'eva:plus-fill'} width={16} height={16} />
                </IconButton>
            </IncrementerStyle>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                available: {available}
            </Typography>
        </Box>
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
            item.empe_NombreCompleto.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            item.empe_SucursalNombre.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            item.empe_Sexo.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        );
    }


    return tableData;
}
