import axios from 'axios'
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate  } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { PATH_AUTH } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func,
};

export default function ResetPasswordForm({ onSent, onGetEmail }) {
  const isMountedRef = useIsMountedRef();

  const ResetPasswordSchema = Yup.object().shape({
    usuario: Yup.string().required('Nombre de usuario requerido'),
    contrasena: Yup.string().required('Contraseña requerida'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: 'demo@minimals.cc' },
  });

  const { enqueueSnackbar } = useSnackbar();

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      if (data.usuario !== "" && data.contrasena !== "") {
        axios.get(`Usuarios/RecuperarContra?usuario=${data.usuario}&contrasena=${data.contrasena}`)
          .then((response) => {
            if (response.data === 'La contraseña ha sido cambiada exitosamente') {
                enqueueSnackbar('La contraseña ha sido restablecida');
                navigate(PATH_AUTH.login);
            } else{
              enqueueSnackbar(response.data, { variant: 'error' });
            }
          })
          .catch((ex) => {
            console.log(ex);
          });
      }
    } catch (error) {
      console.error(error);
      reset();
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>

        <RHFTextField name="usuario" label="Nombre de usuario" />
        <RHFTextField name="contrasena" label="Contraseña nueva" type="password" />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Restablecer contraseña
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
