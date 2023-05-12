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

export default function ModalEditarOrden({ open, onClose, ordenes, setTableData, orden }) {

    const dispatch = useDispatch();

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const [insertSuccess, setInsertSuccess] = useState(false);

    const [optionsClientes, setOptionsClientes] = useState([]);

    const [optionsSucursales, setOptionsSucursales] = useState([]);

    const [fechaTemp, setFechaTemp] = useState('');
  
    const defaultValues = {
        clie_Id: orden?.clie_Id,
        sucu_Id: orden?.sucu_Id,
        orde_Fecha: orden?.orde_Fecha,
        orde_FechaEntrega: dayjs(orden?.orde_FechaEntrega)
    }; 

    useEffect(() => {
        methods.setValue('clie_Id', defaultValues.clie_Id);
        methods.setValue('sucu_Id', defaultValues.sucu_Id);
        methods.setValue('orde_Fecha', defaultValues.orde_Fecha);
        methods.setValue('orde_FechaEntrega', defaultValues.orde_FechaEntrega);
      }, [defaultValues]);

    const InsertSchema = Yup.object().shape({
        clie_Id: Yup.string().required('El cliente es requerido'),
        sucu_Id: Yup.string().required('La sucursal es requerida'),
        deor_FechaEntrega: Yup.string().required('La fecha de entrega es requerida').nullable(),
    });

    const methods = useForm({
        resolver: yupResolver(InsertSchema),
        defaultValues,
    });

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

        axios.get('Sucursales/Listado')
            .then((response) => {
                const optionsData = response.data.data.map(item => ({
                    label: item.sucu_Descripcion,
                    id: item.sucu_Id
                }));

                setOptionsSucursales(optionsData);
            })
            .catch(error => console.error(error));
        if(orden){
            setFechaTemp(orden.orde_Fecha);
        }
    }, [orden, methods]);


    const onSubmit = async (data) => {
        console.log(data);
        
        const dateFecha = new Date(data.orde_FechaEntrega);
        const formattedDate = dateFecha.toISOString();

        console.log(formattedDate);

        axios.put('Ordenes/Editar', {
            orde_Id: orden.orde_Id,
            clie_Id: data.clie_Id,
            orde_Fecha: data.orde_Fecha,
            orde_FechaEntrega: formattedDate,
            sucu_Id: data.sucu_Id,
            usua_IdModificacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
            // cita_FechaModificacion: '2023-05-09T04:57:01.245Z',
            // clie_Nombres: 'string',
            // clie_Apellidos: 'string',
            // cons_Nombre: 'string',
            // empe_Nombres: 'string',
            // usua_NombreCreacion: 'string',
            // usua_NombreModificacion: 'string',
            // sucu_Id: 0,
            // deci_Id: 0,
            // deci_Costo: 0,
            // deci_HoraInicio: '00:00',
            // deci_HoraFin: '00:00'
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
                }else{
                    enqueueSnackbar('Ha ocurrido un error', { variant: 'error' });   
                }
                handleDialogClose();
            })
            .catch((error) => {
                enqueueSnackbar(`Ha ocurrido un error`, { variant: 'error' });   
                console.log(error);
            });
    };

    const submitHandler = handleSubmit(onSubmit);

    const handleDialogClose = () => {
        onClose();
        reset();
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
                    <br/>
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
                                        }
                                    }}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={optionsClientes.find(option => option.id === defaultValues.clie_Id)?? null}
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
                                        }}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} fullWidth   
                                                error={errors.orde_FechaEntrega?.message !== undefined}
                                                helperText={errors.orde_FechaEntrega?.message} 
                                            />
                                        )}
                                    />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                <Autocomplete
                                    name="sucu_Id"
                                    options={optionsSucursales}
                                    error={errors.sucu_Id?.message !== undefined}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => 
                                        <TextField 
                                            {...params} 
                                            label="Sucursal" 
                                            error={errors.sucu_Id?.message !== undefined}
                                            helperText={errors.sucu_Id?.message} 
                                        />}
                                    onChange={(event, value) => {
                                        if (value != null) {
                                            methods.setValue('sucu_Id', value.id);
                                            defaultValues.sucu_Id = value.id
                                        }
                                    }}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={optionsSucursales.find(option => option.id === defaultValues.sucu_Id)?? null}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                    </DialogContent>
                    <Divider/>
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