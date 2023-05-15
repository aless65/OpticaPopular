import * as Yup from 'yup';
import {
    // Box,
    // Card,
    // Link,
    Stack,
    // Input,
    Button,
    // Avatar,
    Dialog,
    // Tooltip,
    TextField,
    // Typography,
    // CardHeader,
    DialogTitle,
    DialogActions,
    // Slider as MuiSlider,
    Alert,
    IconButton,
    InputAdornment,
    Autocomplete,
    Checkbox,
    FormControlLabel,
    Grid
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../../../redux/store';
import { getConsultorios, getConsultorio } from '../../../redux/slices/consultorio';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';


export default function EditConsultorioDialog({ open, onClose, consultorios, setTableData, consultorioId, consultorioNombre }) {

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const [insertSuccess, setInsertSuccess] = useState(false);

    const [optionsEmpleados, setOptionsEmpleados] = useState([]);

    const consultorio = useSelector((state) => state.consultorio.consultorio);

    const dispatch = useDispatch();

    const [empleadoTemporal, setEmpleadoTemporal] = useState('');

    const [consultorioTemporal, setconsultorioTemporal] = useState('');


    // const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({ defaultValues });

    useEffect(() => {
        if (consultorioId) {
            dispatch(getConsultorio(consultorioId));
        }
    }, [consultorioId, dispatch, insertSuccess]);

    useEffect(() => {
        if (consultorio) {
            setconsultorioTemporal(consultorioNombre);
            setEmpleadoTemporal(consultorio.empe_Id);

        }
    }, [consultorio]);

    useEffect(() => {
        fetch('https://localhost:44362/api/Empleados/Listado')
            .then(response => response.json())
            .then(data => {
                const optionsData = data.data.map(item => ({
                    label: item.empe_NombreCompleto, // replace 'name' with the property name that contains the label
                    id: item.empe_Id // replace 'id' with the property name that contains the ID
                }));
                setOptionsEmpleados(optionsData);
            })
            .catch(error => console.error(error));
    }, []);



    const InsertSchema = Yup.object().shape({
        consultorioNombre: Yup.string().required('Nombre del consultorio requerido'),
        empleado: Yup.string().required('Empleado requerido'),
    });

    const defaultValues = {
        consultorioNombre: consultorioNombre || '',
        empleado: empleadoTemporal || '',
    };

    const methods = useForm({
        resolver: yupResolver(InsertSchema),
        defaultValues,
    });

    const {
        reset,
        register, // Registrar el campo consultorioNombre
        setError,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = methods;

    useEffect(() => {
        methods.setValue('consultorioNombre', defaultValues.consultorioNombre);
        methods.setValue('empleado', defaultValues.empleado);

    }, [defaultValues]);



    const onSubmit = async (data) => {

        try {
            console.log(data);
            const jsonData = {
                cons_Id: consultorioId,
                cons_Nombre: data.consultorioNombre, // Agregar el valor del nombre del consultorio
                empe_Id: data.empleado,
                usua_UsuModificacion: 1,
            };
            console.log(jsonData);
            fetch("https://localhost:44362/api/Consultorios/Editar", {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === "El Consultorio ha sido editado con éxito") {
                        setInsertSuccess(true);
                        enqueueSnackbar(data.message);
                        handleDialogClose();
                    } else {
                        setInsertSuccess(false);
                        enqueueSnackbar(data.message, { variant: 'error' });
                    }
                })
                .catch((error) => console.error(error));
            console.log(data);
        } catch (error) {
            console.error(error);
            reset();
            if (isMountedRef.current) {
                setError('afterSubmit', { ...error, message: error.message });
            }
        }
    };

    useEffect(() => {

        if (insertSuccess === true) {
            dispatch(getConsultorios());
            setTableData(consultorios);
            setInsertSuccess(false);
        }

    }, [insertSuccess]);

    useEffect(() => {
        methods.setValue('consultorioNombre', consultorioTemporal);
    }, [consultorioTemporal])

    const submitHandler = handleSubmit(onSubmit);

    const handleDialogClose = () => {
        setconsultorioTemporal(consultorioNombre);
        onClose();
        reset();
    };

    return (
        <FormProvider methods={methods}>
            <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} consultorios={consultorios}>
                <DialogTitle>Editar consultorio</DialogTitle>

                {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

                <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>

                    <Grid container>
                        <Grid item xs={12} sx={{ pr: 5}} sm={12}>
                            {/* Agregar el campo TextField para el nombre del consultorio */}
                            <TextField
                                fullWidth
                                label="Nombre del consultorio"
                                {...register('consultorioNombre')}
                                error={!!errors.consultorioNombre}
                                helperText={errors.consultorioNombre?.message}
                                onChange={e => setconsultorioTemporal(e.target.value)} value={consultorioTemporal}
                            />

                        </Grid>
                        <Grid item xs={12} sx={{ pr: 5, pt: 3  }} sm={12}>
                            <Autocomplete
                                disablePortal
                                name="empleado"
                                options={optionsEmpleados}
                                error={errors.empleado?.message}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => <TextField {...params} label="Empleado" />}
                                onChange={(event, value) => {
                                    if (value != null) {
                                        methods.setValue('empleado', value.id);
                                        setEmpleadoTemporal(value.id);
                                    }
                                }}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={optionsEmpleados.find((option) => option.id === empleadoTemporal) ?? null}
                            />
                        </Grid>

                    </Grid>

                </Stack>
                <DialogActions>
                    <LoadingButton variant="contained" type="submit" loading={isSubmitting} onClick={submitHandler}>
                        Editar
                    </LoadingButton>
                    <Button onClick={handleDialogClose}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </FormProvider>
    );
}