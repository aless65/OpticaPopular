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
import { getUsuarios, getUsuario } from '../../../redux/slices/usuario';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';


export default function EditUserDialog({ open, onClose, usuarios, setTableData, usuaId }) {

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const [insertSuccess, setInsertSuccess] = useState(false);

    const [optionsEmpleados, setOptionsEmpleados] = useState([]);

    const [optionsRoles, setOptionsRoles] = useState([]);

    const usuario = useSelector((state) => state.usuario.usuario);

    const dispatch = useDispatch();

    const [empleadoTemporal, setEmpleadoTemporal] = useState('');

    const [rolTemporal, setRolTemporal] = useState('');

    const [esAdminTemporal, setEsAdminTemporal] = useState(false);

    // const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({ defaultValues });

    useEffect(() => {
        if (usuaId) {
            dispatch(getUsuario(usuaId));
        }
    }, [usuaId, dispatch, insertSuccess]);

    useEffect(() => {
        if (usuario) {
          setEmpleadoTemporal(usuario.empe_Id);
          setRolTemporal(usuario.role_Id);
          setEsAdminTemporal(usuario.usua_EsAdmin);
        }
      }, [usuario]);

    useEffect(() => {
        fetch('http://opticapopular.somee.com/api/Empleados/Listado')
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

    useEffect(() => {
        fetch('http://opticapopular.somee.com/api/Roles/Listado')
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                const optionsData = data.data.map(item => ({
                    label: item.role_Nombre, // replace 'name' with the property name that contains the label
                    id: item.role_Id // replace 'id' with the property name that contains the ID
                }));
                setOptionsRoles(optionsData);
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
        username: usuario?.usua_NombreUsuario || '',
        empleado: empleadoTemporal || '',
        rol: rolTemporal || '',
        esAdmin: esAdminTemporal || false,
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
        methods.setValue('username', defaultValues.username);
        methods.setValue('empleado', defaultValues.empleado);
        methods.setValue('rol', defaultValues.rol);
        methods.setValue('esAdmin', defaultValues.esAdmin);
      }, [defaultValues]);

    const onSubmit = async (data) => {
        // console.log(data);
        try {
            const jsonData = {
                usua_Id: usuaId,
                usua_EsAdmin: data.esAdmin,
                role_Id: data.rol,
                empe_Id: data.empleado,
                usua_UsuModificacion: 1,
            };

            fetch("http://opticapopular.somee.com/api/Usuarios/Editar", {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === "El usuario ha sido editado con éxito") {
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
            dispatch(getUsuarios());
            setTableData(usuarios);
            setInsertSuccess(false);
        }

    }, [insertSuccess]);

    const handleEsAdminChange = (event) => {
        methods.setValue('esAdmin', event.target.checked);
        setEsAdminTemporal(event.target.checked);
    };

    const submitHandler = handleSubmit(onSubmit);

    const handleDialogClose = () => {
        onClose();
        reset();
    };

    return (
        <FormProvider methods={methods}>
            <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} usuarios={usuarios}>
                <DialogTitle>Editar usuario</DialogTitle>

                {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

                <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
                    <RHFTextField name="username" disabled value={usuario?.usua_NombreUsuario || ''} label="Nombre de usuario" />

                    <Grid container>
                        <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
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
                        <Grid item xs={12} sx={{ pl: 1 }} sm={6}>
                            <Autocomplete
                                disablePortal
                                name="rol"
                                options={optionsRoles}
                                error={errors.rol?.message}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => <TextField {...params} label="Rol" />}
                                onChange={(event, value) => {
                                    if (value != null) {
                                        methods.setValue('rol', value.id);
                                        setRolTemporal(value.id);
                                    }
                                }}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={optionsRoles.find((option) => option.id === rolTemporal) ?? null}
                            />
                        </Grid>
                    </Grid>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={esAdminTemporal}
                                onChange={handleEsAdminChange}
                            // checked={usuario?.usua_EsAdmin || false}
                            />
                        }
                        label="Es Admin"
                    />
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