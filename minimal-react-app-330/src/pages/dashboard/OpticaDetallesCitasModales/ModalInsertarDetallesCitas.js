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
import { FormProvider, RHFTextField} from '../../../components/hook-form';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

export default function ModalAgregarDetalleCita({ open, onClose, citas, setTableData, citaId }) {

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
        deci_Costo: Yup.string().required('El precio de la cita es requerido'),
        deci_HoraInicio: Yup.string().required('La hora de inicio es requerida'),
        deci_HoraFin: Yup.string().required('La hora fin es requerida').nullable(),
    });

    const defaultValues = {
        deci_Costo: '',
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
       
        axios.post('Citas/Insert', {
           
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
                    maxWidth="xs" 
                    onClose={handleDialogClose} 
                    aria-labelledby="alert-dialog-title"
                    >
                    <DialogTitle component="h2" id="alert-dialog-title">
                        Completar cita
                    </DialogTitle>
                    <br/>
                    <Divider />
                    {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
                    <DialogContent>
                    <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
                        <Grid container>
                            <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                <RHFTextField
                                    name="deci_Costo"
                                    label="Precio de la cita"
                                    />
                            </Grid>
                            <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                            <RHFTextField
                                    name="deci_HoraInicio"
                                    label="Hora de inicio"
                                    />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sx={{ pr: 1 }} sm={12}>
                            <RHFTextField
                                    name="deci_HoraFin"
                                    label="Hora fin"
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