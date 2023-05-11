/* eslint-disable camelcase */
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
import { LoadingButton, DatePicker, TimePicker } from '@mui/lab';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../../../redux/store';
import { getCitas } from '../../../redux/slices/citas';
import { FormProvider, RHFTextField} from '../../../components/hook-form';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

export default function ModalEditarDetalleCita({ open, onClose, citas, setTableData, citaId }) {

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const [insertSuccess, setInsertSuccess] = useState(false);

    const [allCorrect, setAllCorrect] = useState(true);

    const [errorMessages, setErrorMessages] = useState({});

    const [mostrarAlertaError, setMostrarAlerta] = useState(false);

    const [deci_CostoTemp, setdeci_CostoTemp] = useState('');

    const [deci_HoraInicioTemp, setdeci_HoraInicioTemp] = useState('');

    const [deci_HoraFinTemp, setdeci_HoraFinTemp] = useState('');

    const dispatch = useDispatch();

    const InsertSchema = Yup.object().shape({
        deci_Costo: Yup.string().required('El precio de la cita es requerido').trim().matches(/^(?!0+(\.0{1,2})?$)\d{3,4}(\.\d{1,2})?$/, 'El costo debe estar entre 100 y 9,999 con un máximo de 2 decimales opcionales'),
        deci_HoraInicio: Yup.string().required('La hora de inicio es requerida').nullable(),
        deci_HoraFin: Yup.string().required('La hora fin es requerida').nullable(),
    });

    const defaultValues = {
        deci_Costo: deci_CostoTemp || '',
        deci_HoraInicio: deci_HoraInicioTemp || '' ,
        deci_HoraFin: deci_HoraFinTemp || ''
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

    useEffect(() => {
        if (citaId) {
            axios.get(`DetallesCitas/BuscarDetalleCitaPorIdCita/${citaId}`)
            .then((response) => {
                if (response.data.code === 200) {
                    setdeci_CostoTemp(response.data.data.deci_Costo);
                    const newDate1 = new Date();
                    newDate1.setHours(response.data.data.deci_HoraInicio.substring(0, 2));
                    newDate1.setMinutes(response.data.data.deci_HoraInicio.substring(3, 5));
                    newDate1.setSeconds(0);
                    setdeci_HoraInicioTemp(dayjs(newDate1));
                    const newDate2 = new Date();
                    newDate2.setHours(response.data.data.deci_HoraFin.substring(0, 2));
                    newDate2.setMinutes(response.data.data.deci_HoraFin.substring(3, 5));
                    newDate2.setSeconds(0);
                    setdeci_HoraFinTemp(newDate2);
                }
             })
        }
      
        if (insertSuccess === true) {
            dispatch(getCitas());
      
            setTableData(citas);
      
            setInsertSuccess(false);
          }
    }, [citaId, insertSuccess]);

    useEffect(() => {
        methods.setValue('deci_Costo', defaultValues.deci_Costo);
        methods.setValue('deci_HoraInicio', defaultValues.deci_HoraInicio);
        methods.setValue('deci_HoraFin', defaultValues.deci_HoraFin);
    }, [methods])

    const mostrarAlerta = () => {
        setMostrarAlerta(true);
    }

    const ocultarAlerta = () => {
        setMostrarAlerta(false);
    }

    const errores = {
        horaFinErrorMayor: "La hora final no puede ser menor a la hora de inicio",
        horaInicioError: "La hora de inicio no es válida",
        horaFinError: "La hora fin no es válida",
        horaInicioFueraHorario: "La hora de inicio debe ser mayor a la hora de apertura (08:00)",
        horaFinFueraHorario: "La hora fin debe ser menor a la hora de cierre (17:00)"
    };

    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <Alert severity="error" >{errorMessages.message}</Alert>
    );

    const onSubmit = async (data) => {
        
        if(data.deci_HoraInicio === "Invalid Date"){
            setErrorMessages({ name: "generalError", message: errores.horaInicioError });
        }

        if(data.deci_HoraFin === "Invalid Date"){
            setErrorMessages({ name: "generalError", message: errores.horaFinError });
        }

        if(dayjs(data.deci_HoraFin) < dayjs(data.deci_HoraInicio)){
            setErrorMessages({ name: "generalError", message: errores.horaFinErrorMayor });
        }

        const horaApertura = new Date();
        horaApertura.setHours(8);
        horaApertura.setMinutes(0);
        horaApertura.setSeconds(0);
        
        const horaCierre = new Date();
        horaCierre.setHours(17);
        horaCierre.setMinutes(0);
        horaCierre.setSeconds(0);

        if(dayjs(data.deci_HoraInicio) < dayjs(horaApertura)){
            setErrorMessages({ name: "generalError", message: errores.horaInicioFueraHorario });
        }

        if(dayjs(data.deci_HoraFin) > dayjs(horaCierre)){
            setErrorMessages({ name: "generalError", message: errores.horaFinFueraHorario });
        }
        
        if(
            data.deci_HoraInicio !== "Invalid Date" && data.deci_HoraFin !== "Invalid Date"
            && dayjs(data.deci_HoraFin) > dayjs(data.deci_HoraInicio) && dayjs(data.deci_HoraInicio) > dayjs(horaApertura)
            && dayjs(data.deci_HoraFin) < dayjs(horaCierre)
        ){
           axios.post('DetallesCitas/Editar', {}, {
            params:{
                cita_Id: citaId,
                deci_Costo: data.deci_Costo,
                deci_HoraInicio: `${dayjs(data.deci_HoraInicio).format('HH:mm:ss').substring(0, 2)}:${dayjs(data.deci_HoraInicio).format('HH:mm:ss').substring(3, 5)}`,
                deci_HoraFin: `${dayjs(data.deci_HoraFin).format('HH:mm:ss').substring(0, 2)}:${dayjs(data.deci_HoraFin).format('HH:mm:ss').substring(3, 5)}`,
                usua_IdModificacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
            }
            })
            .then((response) => {
                if (response.data.code === 200) {
                    if (response.data.data.codeStatus > 0) {
                        enqueueSnackbar('Detalles cita editados con éxito', { variant: 'success' });
                        setInsertSuccess(true);
                    } else {
                        enqueueSnackbar('Ocurrio un error al intentar editar detalles de la cita', { variant: 'error' });
                    }
                }else{
                    enqueueSnackbar('Ocurrio un error al intentar editar detalles de la cita', { variant: 'error' });   
                }
                handleDialogClose();
            })
            .catch((error) => {
                enqueueSnackbar(`Ocurrio un error al intentar editar detalles de la cita`, { variant: 'error' });   
                console.log(error);
            });
        }
        mostrarAlerta();
    };

    const submitHandler = handleSubmit(onSubmit);

    const handleDialogClose = () => {
        onClose();
        reset();
        ocultarAlerta();
    };

    return (
        <div>
            <FormProvider methods={methods}>
                <Dialog 
                    open={open} 
                    fullWidth 
                    maxWidth="xs" 
                    onClose={handleDialogClose} 
                    aria-labelledby="alert-dialog-title"
                    >
                    <DialogTitle component="h2" id="alert-dialog-title">
                        Editar detalles cita
                    </DialogTitle>
                    <br/>
                    <Divider />
                    <DialogContent>
                    <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
                        {mostrarAlertaError && renderErrorMessage("generalError")}
                        <Grid container>
                            <Grid item xs={12} sx={{ pr: 1 }} sm={12}>
                                <Controller
                                     name="deci_Costo"
                                     render={({ field }) => (
                                         <RHFTextField
                                             name="deci_Costo"
                                             label="Precio de la cita"
                                             value={field.value || deci_CostoTemp || ''}
                                             onChange={(newValue) => {
                                                field.onChange(newValue);
                                                setdeci_CostoTemp('');
                                             }}
                                         />
                                     )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                <Controller
                                    name="deci_HoraInicio"
                                    render={({ field, fieldState: { error } }) => (
                                        <TimePicker
                                            ampm={false}    
                                            label="Hora inicio"
                                            value={field.value || deci_HoraInicioTemp}
                                            error={errors.deci_HoraInicio?.message !== undefined}
                                            onChange={(newValue) => {
                                                field.onChange(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} fullWidth   
                                                    error={errors.deci_HoraInicio?.message !== undefined}
                                                    helperText={errors.deci_HoraInicio?.message} 
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                <Controller
                                    name="deci_HoraFin"
                                    render={({ field, fieldState: { error } }) => (
                                        <TimePicker
                                            ampm={false}
                                            label="Hora fin"
                                            value={field.value || deci_HoraFinTemp}
                                            error={errors.deci_HoraFin?.message !== undefined}
                                            onChange={(newValue) => {
                                                field.onChange(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} fullWidth   
                                                    error={errors.deci_HoraFin?.message !== undefined}
                                                    helperText={errors.deci_HoraFin?.message} 
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                    </DialogContent>
                    <Divider/>
                    <DialogActions>
                        <LoadingButton variant="contained" type="submit" loading={isSubmitting} onClick={submitHandler}>
                            Guardar edición
                        </LoadingButton>
                        <Button onClick={handleDialogClose}>Cancelar</Button>
                    </DialogActions>
                </Dialog>
            </FormProvider>
        </div>
    );
}