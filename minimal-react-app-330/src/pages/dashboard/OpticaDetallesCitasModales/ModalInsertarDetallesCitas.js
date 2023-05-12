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
import { useDispatch } from '../../../redux/store';
import { getCitas, getcita } from '../../../redux/slices/citas';
import { FormProvider, RHFTextField} from '../../../components/hook-form';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

export default function ModalAgregarDetalleCita({ open, onClose, citas, setTableData, citaId }) {

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const [insertSuccess, setInsertSuccess] = useState(false);

    const [allCorrect, setAllCorrect] = useState(true);

    const [errorMessages, setErrorMessages] = useState({});

    const [mostrarAlertaError, setMostrarAlerta] = useState(false);

    const dispatch = useDispatch();
    
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

    const InsertSchema = Yup.object().shape({
        deci_Costo: Yup.string().required('El precio de la cita es requerido').trim().matches(/^(?!0+(\.0{1,2})?$)\d{3,4}(\.\d{1,2})?$/, 'El costo debe estar entre 100 y 9,999 con un máximo de 2 decimales opcionales'),
        deci_HoraInicio: Yup.string().required('La hora de inicio es requerida').nullable(),
        deci_HoraFin: Yup.string().required('La hora fin es requerida').nullable(),
    });

    const defaultValues = {
        deci_Costo: '500.00',
        deci_HoraInicio: '',
        deci_HoraFin: '',
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
           axios.post('DetallesCitas/Insert', {}, {
            params:{
                cita_Id: citaId,
                deci_Costo: data.deci_Costo,
                deci_HoraInicio: `${dayjs(data.deci_HoraInicio).format('HH:mm:ss').substring(0, 2)}:${dayjs(data.deci_HoraInicio).format('HH:mm:ss').substring(3, 5)}`,
                deci_HoraFin: `${dayjs(data.deci_HoraFin).format('HH:mm:ss').substring(0, 2)}:${dayjs(data.deci_HoraFin).format('HH:mm:ss').substring(3, 5)}`,
                usua_IdCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
            }
            })
            .then((response) => {
                if (response.data.code === 200) {
                    if (response.data.data.codeStatus > 0) {
                        enqueueSnackbar('Cita completada con éxito', { variant: 'success' });
                        setInsertSuccess(true);
                    } else {
                        enqueueSnackbar('Ocurrio un error al intentar completar la cita', { variant: 'error' });
                    }
                }else{
                    enqueueSnackbar('Ocurrio un error al intentar completar la cita', { variant: 'error' });   
                }
                handleDialogClose();
            })
            .catch((error) => {
                enqueueSnackbar(`Ocurrio un error al intentar completar la cita`, { variant: 'error' });   
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
                    maxWidth="xs" 
                    onClose={handleDialogClose} 
                    aria-labelledby="alert-dialog-title"
                    >
                    <DialogTitle component="h2" id="alert-dialog-title">
                        Completar cita
                    </DialogTitle>
                    <br/>
                    <Divider />
                    <DialogContent>
                    <Stack spacing={3} >
                        {mostrarAlertaError && renderErrorMessage("generalError")}
                        <Grid container>
                            <Grid item xs={12} sx={{ pr: 1 }} sm={12}>
                                <RHFTextField
                                    name="deci_Costo"
                                    label="Precio de la cita"
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
                                            value={field.value || null}
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
                                            value={field.value || null}
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
                            Completar cita
                        </LoadingButton>
                        <Button onClick={handleDialogClose}>Cancelar</Button>
                    </DialogActions>
                </Dialog>
            </FormProvider>
        </div>
    );
}