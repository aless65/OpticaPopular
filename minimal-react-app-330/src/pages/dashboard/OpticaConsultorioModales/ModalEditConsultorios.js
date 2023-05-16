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


export default function EditConsultorioDialog({ open, onClose, consultorios, setTableData, consultorioId,consultorioNombre }) {

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const [insertSuccess, setInsertSuccess] = useState(false);

    const [optionsEmpleados, setOptionsEmpleados] = useState([]);

   

    const consultorio = useSelector((state) => state.consultorio.consultorio);

    const dispatch = useDispatch();

    const [empleadoTemporal, setEmpleadoTemporal] = useState('');
    const [consultorioTemporal, setconsultorioTemporal] = useState('');
    
    const [ConsultorioNombre, setConsultorioNombre] = useState('');
   

    // const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({ defaultValues });

    useEffect(() => {
        if (consultorioId) {
            dispatch(getConsultorio(consultorioId));
        }
    }, [consultorioId, dispatch, insertSuccess]);

    useEffect(() => {
        setconsultorioTemporal(consultorioNombre);
      }, [consultorioId]);

    useEffect(() => {
        if (consultorio) {
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
        // username: Yup.string().required('Nombre de usuario requerido'),
        // password: Yup.string().required('Contraseña requerida'),
        // empleado: Yup.string().required('Empleado requerido'),
        // rol: Yup.string().required('Rol requerido'),
    });

    const defaultValues = {
        consultorioNombre: consultorio?.cons_Nombre || '',
        empleado: empleadoTemporal || '',
        
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
        methods.setValue('nombre', defaultValues.consultorioNombre);
        methods.setValue('empleado', defaultValues.empleado);
        
      }, [defaultValues]);

    const onSubmit = async (data) => {
        // console.log(data);
        try {
            const jsonData = {
                cons_Id: consultorioId,
                cons_Nombre:consultorioNombre, 
                empe_Id: data.empleado,
                usua_UsuModificacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
            };

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
            // console.log(response);
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

   

    const submitHandler = handleSubmit(onSubmit);

    const handleDialogClose = () => {
        onClose();
        reset();
    };

    return (
        <FormProvider methods={methods}>
            <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} consultorios={consultorios}>
                <DialogTitle>Editar consultorio</DialogTitle>

                {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

                <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
                    
                                  
                <TextField
    label="Nombre del consultorio"
    variant="outlined"
    fullWidth
    inputProps={{ readOnly: false }}
    {...methods.register('consultorioNombre')}
    value={consultorioTemporal}
    onChange={(event) => setconsultorioTemporal(event.target.value)}
/>

                    <Grid container>
                        <Grid item xs={12} sx={{ pr: 5 }} sm={12}>
                            <Autocomplete
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