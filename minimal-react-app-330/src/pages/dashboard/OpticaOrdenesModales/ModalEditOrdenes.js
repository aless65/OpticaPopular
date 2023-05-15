import axios from 'axios';
import * as React from 'react';
import * as Yup from 'yup';
import {
    Stack,
    Button,
    Dialog,
    TextField,
    DialogTitle,
    DialogActions,
    Alert,
    Autocomplete,
    Grid,
    DialogContent,
    Divider
} from '@mui/material';
import { LoadingButton, DatePicker } from '@mui/lab';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../../../redux/store';
import { getOrdenes, getOrden } from '../../../redux/slices/orden';
import { FormProvider } from '../../../components/hook-form';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { detallesOrden } from '../../../sections/@dashboard/optica/orden-list/OrdenTableRow';

export default function ModalEditarOrden({ open, onClose, ordenes, setTableData, orden }) {

    const dispatch = useDispatch();

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const [insertSuccess, setInsertSuccess] = useState(false);

    const [optionsClientes, setOptionsClientes] = useState([]);

    const [optionsSucursales, setOptionsSucursales] = useState([]);

    const [fechaTemp, setFechaTemp] = useState('');

    const [clienteTemporal, setClienteTemporal] = useState('');

    const [sucursalTemporal, setSucursalTemporal] = useState('');

    const [fechaEntregaTemporal, setFechaEntregaTemporal] = useState('');

    const [fechaEntregaRealTemporal, setFechaEntregaRealTemporal] = useState('');

    const [canInsert, setCanInsert] = useState(true);

    // const [hasDetalles, setHasDetalles] = useState(false);

    const defaultValues = {
        clie_Id: clienteTemporal || '',
        sucu_Id: sucursalTemporal || '',
        orde_Fecha: orden?.orde_Fecha,
        orde_FechaEntrega: dayjs(fechaEntregaTemporal || ''),
        orde_FechaEntregaReal: dayjs(fechaEntregaRealTemporal || ''),
    };

    const InsertSchema = Yup.object().shape({
        // clie_Id: Yup.string().required('El cliente es requerido'),
        // sucu_Id: Yup.string().required('La sucursal es requerida'),
        orde_FechaEntrega: Yup.string().required('La fecha de entrega es requerida').nullable(),
    });

    useEffect(() => {
        console.log("cambia");
        if (orden) {
            setFechaTemp(orden.orde_FechaEntrega);
            setClienteTemporal(orden.clie_Id);
            setSucursalTemporal(orden.sucu_Id);
            setFechaEntregaTemporal(dayjs(orden.orde_FechaEntrega));
            setFechaEntregaRealTemporal(dayjs(orden.orde_FechaEntregaReal));
        }

        // fetch(`http://opticapopular.somee.com/api/Ordenes/ListadoDetalles?id=${orden.orde_Id}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         if(data.data){
        //             setHasDetalles(true);
        //         }
        //     })
        //     .catch(error => console.error(error));

    }, [orden]);

    const methods = useForm({
        resolver: yupResolver(InsertSchema),
        defaultValues,
    });

    useEffect(() => {
        methods.setValue('clie_Id', defaultValues.clie_Id);
        methods.setValue('sucu_Id', defaultValues.sucu_Id);
        methods.setValue('orde_Fecha', defaultValues.orde_Fecha);
        methods.setValue('orde_FechaEntrega', defaultValues.orde_FechaEntrega);
        methods.setValue('orde_FechaEntregaReal', defaultValues.orde_FechaEntregaReal);
    }, [defaultValues]);

    const {
        reset,
        setError,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = methods;

    useEffect(() => {
        axios.get('Clientes/Listado')
            .then((response) => {
                const optionsData = response.data.data.map(item => ({
                    label: `${item.clie_Nombres + [' '] + item.clie_Apellidos}`,
                    id: item.clie_Id
                }));

                setOptionsClientes(optionsData);
            })
            .catch(error => console.error(error));

        // axios.get('Sucursales/Listado')
        //     .then((response) => {
        //         const optionsData = response.data.data.map(item => ({
        //             label: item.sucu_Descripcion,
        //             id: item.sucu_Id
        //         }));

        //         setOptionsSucursales(optionsData);
        //     })
        //     .catch(error => console.error(error));
        // if(orden){
        //     setFechaTemp(orden.orde_Fecha);
        // }
    }, [orden, methods]);


    const onSubmit = async (data) => {

        if (canInsert) {
            const formattedDate = dayjs(data.orde_FechaEntrega).toISOString();

            console.log(formattedDate);

            try {
                const dateFechaReal = new Date(data.orde_FechaEntregaReal);
                const formattedDateReal = dateFechaReal.toISOString();
                data.orde_FechaEntregaReal = formattedDateReal;
            }
            catch
            {
                data.orde_FechaEntregaReal = '';
            }


            axios.put('Ordenes/Editar', {
                orde_Id: orden.orde_Id,
                orde_Fecha: data.orde_Fecha,
                orde_FechaEntrega: formattedDate,
                orde_FechaEntregaReal: data.orde_FechaEntregaReal || null,
                usua_IdModificacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    console.log(response.data);
                    if (response.data.code === 200) {
                        setInsertSuccess(true);
                        enqueueSnackbar('La orden ha sido editada', { variant: 'success' });
                    } else {
                        enqueueSnackbar('Ha ocurrido un error', { variant: 'error' });
                    }
                    handleDialogClose();
                })
                .catch((error) => {
                    enqueueSnackbar(`Ha ocurrido un error`, { variant: 'error' });
                    console.log(error);
                });
        } else if(orden?.fact_Id){
            enqueueSnackbar("La fecha no puede ser anterior a la fecha de entrega", { variant: 'warning' });
        } else{
            enqueueSnackbar("La orden aún no ha sido pagada", { variant: 'warning' });
        }
    };

    const submitHandler = handleSubmit(onSubmit);

    const handleDialogClose = () => {
        console.log("qq");
        setFechaEntregaRealTemporal('');
        reset();
        onClose();
    };

    useEffect(() => {
        if (insertSuccess === true) {
            dispatch(getOrdenes());

            setTableData(ordenes);

            setInsertSuccess(false);
        }

    }, [insertSuccess]);

    return (
        <div>
            <FormProvider methods={methods}>
                <Dialog
                    open={open}
                    fullWidth
                    maxWidth="sm"
                    onClose={handleDialogClose}
                    aria-labelledby="alert-dialog-title"
                >
                    <DialogTitle component="h2" id="alert-dialog-title">
                        Editar orden
                    </DialogTitle>
                    <br />
                    <Divider />
                    {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
                    <DialogContent >
                        <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
                            <Grid container>
                                <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                    <Autocomplete
                                        name="clie_Id"
                                        options={optionsClientes}
                                        error={errors.clie_Id?.message !== undefined}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Cliente"
                                                error={errors.clie_Id?.message !== undefined}
                                                helperText={errors.clie_Id?.message}
                                            />)}
                                        onChange={(event, value) => {
                                            if (value != null) {
                                                methods.setValue('clie_Id', value.id);
                                                defaultValues.clie_Id = value.id;
                                                setClienteTemporal(value.id);
                                            }
                                        }}
                                        disabled
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        value={optionsClientes.find(option => option.id === clienteTemporal) ?? null}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                    <Controller
                                        name="orde_Fecha"
                                        render={({ field, fieldState: { error } }) => (
                                            <DatePicker
                                                label="Fecha"
                                                value={field.value || fechaTemp}
                                                minDate={new Date()}
                                                error={errors.orde_Fecha?.message !== undefined}
                                                onChange={(newValue) => {
                                                    field.onChange(newValue);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params} fullWidth
                                                        error={errors.orde_Fecha?.message !== undefined}
                                                        helperText={errors.orde_Fecha?.message}
                                                    />
                                                )}
                                                disabled
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                    <Controller
                                        name="orde_FechaEntrega"
                                        render={({ field, fieldState: { error } }) => (
                                            <DatePicker
                                                label="Fecha de Entrega"
                                                value={field.value || fechaTemp}
                                                minDate={new Date()}
                                                error={errors.orde_FechaEntrega?.message !== undefined}
                                                onChange={(newValue) => {
                                                    field.onChange(newValue);
                                                    defaultValues.orde_FechaEntrega = newValue;
                                                    methods.setValue('orde_FechaEntrega', newValue);
                                                    setFechaEntregaTemporal(newValue);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params} fullWidth
                                                        error={errors.orde_FechaEntrega?.message !== undefined}
                                                        helperText={errors.orde_FechaEntrega?.message}
                                                    />
                                                )}
                                                disabled={defaultValues.orde_FechaEntregaReal}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                    <Controller
                                        name="orde_FechaEntregaReal"
                                        render={({ field, fieldState: { error } }) => (
                                            <DatePicker
                                                label="Fecha de Entrega Real"
                                                value={field.value || fechaTemp}
                                                minDate={fechaEntregaTemporal}
                                                error={errors.orde_FechaEntregaReal?.message !== undefined}
                                                onChange={(newValue) => {

                                                    // console.log(detallesOrden);

                                                    // if(detallesOrden === null){
                                                    //     enqueueSnackbar('La orden está vacía', { variant: 'warning' });
                                                    //     field.onChange(null);
                                                    // }

                                                    if (newValue >= defaultValues.orde_FechaEntrega) {
                                                        setCanInsert(true);
                                                    } else {
                                                        enqueueSnackbar("La fecha no puede ser anterior a la fecha de entrega", { variant: 'warning' });
                                                        field.onChange(null);
                                                        setCanInsert(false);
                                                    }

                                                    if (orden?.fact_Id) {
                                                        setCanInsert(true);
                                                    } else {
                                                        enqueueSnackbar("La orden aún no ha sido pagada", { variant: 'warning' });
                                                        setCanInsert(false);
                                                    }

                                                    field.onChange(newValue);
                                                    defaultValues.orde_FechaEntregaReal = newValue;
                                                    methods.setValue('orde_FechaEntregaReal', newValue);
                                                    setFechaEntregaRealTemporal(newValue);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params} fullWidth
                                                        error={errors.orde_FechaEntregaReal?.message !== undefined}
                                                        helperText={errors.orde_FechaEntregaReal?.message}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <LoadingButton variant="contained" type="submit" loading={isSubmitting} onClick={submitHandler}>
                            Editar
                        </LoadingButton>
                        <Button onClick={handleDialogClose}>Cancelar</Button>
                    </DialogActions>
                </Dialog>
            </FormProvider>
        </div>
    );
}