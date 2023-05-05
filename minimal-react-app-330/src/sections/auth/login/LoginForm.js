
import axios from 'axios'
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    if (localStorage.getItem('usuario') !== "" && localStorage.getItem('usuario') !== null && localStorage.getItem('usuario') !== 'null') {
      navigate('/Inicio', { replace: true });
    }
  }, [])

  const errores = {
    generalError: "Usuario y/o contraseña incorrecto"
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <Alert severity="error">{errorMessages.message}</Alert>
    );

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('El nombre de usuario es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria'),
  });

  const defaultValues = {
    email: 'admin',
    password: '123',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      if (data.email !== "" && data.password !== "") {
        axios.get(`http://opticapopular.somee.com/api/Usuarios/Login?usuario=${data.email}&contrasena=${data.password}`)
          .then((response) => {
            if (response.data.code === 200) {
              if (response.data.data[0] !== null) {
                localStorage.setItem('usuario', response.data.data[0].empe_NombreCompleto);
                navigate('/dashboard/app', { replace: true })
              } else {
                setErrorMessages({ name: "generalError", message: errors.generalError });
              }
            }
          })
          .catch((ex) => {
            console.log(ex);
          });
      }
      await login('demo@minimals.cc', 'demo1234');
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
      <Stack spacing={3}>
        {renderErrorMessage("generalError")}

        <RHFTextField
          name="email"
          label="Nombre de usuario"
        />

        <RHFTextField
          name="password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Recuerdame" />
        <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
          ¿Olvidaste tu contraseña?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" >
        Iniciar sesión
      </LoadingButton>
    </FormProvider>
  );
}
