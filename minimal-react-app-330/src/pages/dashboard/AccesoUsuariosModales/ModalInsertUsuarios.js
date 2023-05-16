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
import { ErrorMessage } from 'formik';
import { useSnackbar } from 'notistack';
import { useDispatch } from '../../../redux/store';
import { getUsuarios } from '../../../redux/slices/usuario';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';


export default function AddUserDialog({ open, onClose, usuarios, setTableData }) {

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  const [insertSuccess, setInsertSuccess] = useState(false);

  const [optionsEmpleados, setOptionsEmpleados] = useState([]);

  const [optionsRoles, setOptionsRoles] = useState([]);

  useEffect(() => {
    fetch('https://localhost:44362/api/Empleados/Listado')
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        const optionsData = data.data.map(item => ({
          label: item.empe_NombreCompleto, // replace 'name' with the property name that contains the label
          id: item.empe_Id // replace 'id' with the property name that contains the ID
        }));
        setOptionsEmpleados(optionsData);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    fetch('https://localhost:44362/api/Roles/Listado')
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
    username: Yup.string().required('Nombre de usuario requerido'),
    password: Yup.string().required('Contraseña requerida'),
    empleado: Yup.string().required('Empleado requerido'),
    rol: Yup.string().required('Rol requerido'),
  });

  const defaultValues = {
    username: '',
    password: '',
    empleado: '',
    rol: '',
    esAdmin: false,
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

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const jsonData = {
        usua_NombreUsuario: data.username,
        usua_Contrasena: data.password,
        usua_EsAdmin: data.esAdmin,
        role_Id: data.rol,
        empe_Id: data.empleado,
        usua_UsuCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
      };

      fetch("https://localhost:44362/api/Usuarios/Insertar", {
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
          if (data.message === "El usuario se ha insertado") {
            setInsertSuccess(true);
            enqueueSnackbar(`${data.message} con éxito`);
            handleDialogClose();
          } else if (data.message === 'Este usuario ya existe') {
            setInsertSuccess(false);
            enqueueSnackbar(data.message, { variant: 'warning' });
          } else {
            setInsertSuccess(false);
            enqueueSnackbar(data.message, { variant: 'error' });
          }
        })
        .catch((error) => console.error(error));
      // console.log(data.empleado);
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
  };

  const submitHandler = handleSubmit(onSubmit);

  const handleDialogClose = () => {
    onClose();
    reset();
  };

  return (
    <FormProvider methods={methods}>
      <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} usuarios={usuarios} >
        <DialogTitle>Insertar usuario</DialogTitle>

        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
          <RHFTextField name="username" label="Nombre de usuario" />
          <RHFTextField
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Grid container>
            <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
              <Autocomplete
                name="empleado"
                options={optionsEmpleados}
                error={errors.empleado?.message !== undefined}
                // helperText={errors.empleado?.message}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Empleado"
                    error={errors.empleado?.message !== undefined}
                    helperText={errors.empleado?.message}
                  />
                )}
                onChange={(event, value) => {
                  if (value != null) {
                    methods.setValue('empleado', value.id);
                  }
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={optionsEmpleados.find(option => option.id === defaultValues.empleado)}
              />
            </Grid>
            <Grid item xs={12} sx={{ pl: 1 }} sm={6}>
              <Autocomplete
                name="rol"
                options={optionsRoles}
                error={errors.rol?.message !== undefined}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Rol"
                    error={errors.rol?.message !== undefined}
                    helperText={errors.rol?.message}
                  />
                )}
                onChange={(event, value) => {
                  if (value != null) {
                    methods.setValue('rol', value.id);
                  }
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={optionsRoles.find(option => option.id === defaultValues.rol)}
              />
            </Grid>
          </Grid>

          <FormControlLabel
            control={
              <Checkbox
                // checked={defaultValues.esAdmin}
                onChange={handleEsAdminChange}
              />
            }
            label="Es Admin"
          />
        </Stack>
        <DialogActions>
          <LoadingButton variant="contained" type="submit" loading={isSubmitting} onClick={submitHandler}>
            Ingresar
          </LoadingButton>
          <Button onClick={handleDialogClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}