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
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useDispatch } from '../../../redux/store';
import { getCitas, getcita } from '../../../redux/slices/citas';
import { FormProvider } from '../../../components/hook-form';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

export default function ModalAgregarCita({ open, onClose, citas, setTableData }) {

    const [valueDate, setValueDate] = React.useState(dayjs(new Date()).add(1, 'day'));

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const [insertSuccess, setInsertSuccess] = useState(false);

    const [optionsClientes, setOptionsClientes] = useState([]);

    const [optionsConsultorios, setOptionsConsultorios] = useState([]);

    const dispatch = useDispatch();

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

        axios.get('Consultorios/ListadoConsultoriosPorIdSucursal/0')
            .then((response) => {
                const optionsData = response.data.data.map(item => ({
                    label: `${item.sucu_Descripcion + [' - '] + item.cons_Nombre + [' - '] + item.empe_Nombres}`,
                    id: item.cons_Id
                }));

                setOptionsConsultorios(optionsData);
            })
            .catch(error => console.error(error));
    }, []);

    const InsertSchema = Yup.object().shape({
        clie_Id: Yup.string().required('El cliente es requerido'),
        cons_Id: Yup.string().required('El consultorio es requerido'),
        cita_Fecha: Yup.string().required('La fecha de la cita es requerida').nullable(),
    });

    const defaultValues = {
        clie_Id: '',
        cons_Id: '',
        cita_Fecha: `${valueDate}`,
    };

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

    const onSubmit = async (data) => {
        const dateFecha = dayjs(new Date(data.cita_Fecha));
        const formattedDate = dateFecha.toISOString();
        console.log(formattedDate);

        axios.post('Citas/Insert', {
            cita_Id: 0,
            clie_Id: data.clie_Id,
            cons_Id: data.cons_Id,
            cita_Fecha: formattedDate,
            usua_IdCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
            cita_FechaCreacion: '2023-05-09T04:57:01.245Z',
            usua_IdModificacion: 0,
            cita_FechaModificacion: '2023-05-09T04:57:01.245Z',
            clie_Nombres: 'string',
            clie_Apellidos: 'string',
            cons_Nombre: 'string',
            empe_Nombres: 'string',
            usua_NombreCreacion: 'string',
            usua_NombreModificacion: 'string',
            sucu_Id: 0,
            deci_Id: 0,
            deci_Costo: 0,
            deci_HoraInicio: '00:00',
            deci_HoraFin: '00:00'
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.data.code === 200) {
                    if (response.data.data.codeStatus > 0) {
                        setInsertSuccess(true);
                        enqueueSnackbar('Cita agregada con éxito', { variant: 'success' });
                    } else {
                        setInsertSuccess(false);
                        enqueueSnackbar('Ocurrio un error al intentar agregar la cita', { variant: 'error' });
                    }
                }else{
                    enqueueSnackbar('Ocurrio un error al intentar agregar la cita', { variant: 'error' });   
                }
                handleDialogClose();
            })
            .catch((error) => {
                enqueueSnackbar(`Ocurrio un error al intentar agregar la cita`, { variant: 'error' });   
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
          dispatch(getCitas());
    
          setTableData(citas);
    
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
                        Insertar cita
                    </DialogTitle>
                    <br/>
                    <Divider />
                    {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
                    <DialogContent>
                    <Stack spacing={3}>
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
                                        }
                                    }}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={optionsClientes.find(option => option.id === defaultValues.clie_Id)}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                <Controller
                                    name="cita_Fecha"
                                    render={({ field, fieldState: { error } }) => (
                                        <DatePicker
                                            label="Fecha de la cita"
                                            value={field.value || null}
                                            minDate={new Date()}
                                            error={errors.cita_Fecha?.message !== undefined}
                                            onChange={(newValue) => {
                                                field.onChange(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} fullWidth   
                                                    error={errors.cita_Fecha?.message !== undefined}
                                                    helperText={errors.cita_Fecha?.message} 
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sx={{ pr: 1 }} sm={12}>
                                <Autocomplete
                                    name="cons_Id"
                                    options={optionsConsultorios}
                                    error={errors.cons_Id?.message !== undefined}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => 
                                        <TextField 
                                            {...params} 
                                            label="Consultorio" 
                                            error={errors.cons_Id?.message !== undefined}
                                            helperText={errors.cons_Id?.message} 
                                        />}
                                    onChange={(event, value) => {
                                        if (value != null) {
                                            methods.setValue('cons_Id', value.id);
                                        }
                                    }}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={optionsConsultorios.find(option => option.id === defaultValues.cons_Id)}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                    </DialogContent>
                    <Divider/>
                    <DialogActions>
                        <LoadingButton variant="contained" type="submit" loading={isSubmitting} onClick={submitHandler}>
                            Ingresar
                        </LoadingButton>
                        <Button onClick={handleDialogClose}>Cancelar</Button>
                    </DialogActions>
                </Dialog>
            </FormProvider>
        </div>
    );
}