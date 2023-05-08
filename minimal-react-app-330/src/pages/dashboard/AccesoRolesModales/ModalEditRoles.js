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
import { getRoles } from '../../../redux/slices/rol';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';


export default function EditRolDialog({ open, onClose, roles, setTableData, roleId, roleNombre }) {

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [insertSuccess, setInsertSuccess] = useState(false);
  
  const [rolTemporal, setRolTemporal] = useState('');

  const InsertSchema = Yup.object().shape({
    nombre: Yup.string().required('Nombre del rol requerido'),
  });

  useEffect(() => {
    setRolTemporal(roleNombre);
  }, [roleId]);

  const defaultValues = {
    nombre: '',
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
        role_Id: roleId,
        role_Nombre: data.nombre,
        role_UsuModificacion: 1,
      };

      fetch("http://opticapopular.somee.com/api/Roles/Editar", {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })
        .then((response) => response.json())
        .then((data) => {
        //   console.log(data);
          if (data.message === "El rol ha sido editado con éxito") {
            setInsertSuccess(true);
            enqueueSnackbar(data.message);
            handleDialogClose();
          } else if (data.message === 'El rol ya existe'){
            setInsertSuccess(false);
            enqueueSnackbar(data.message, { variant: 'warning' });
          } else{
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
      dispatch(getRoles());

      setTableData(roles);

      setInsertSuccess(false);
    }

  }, [dispatch, insertSuccess]);

  useEffect(() => {
    methods.setValue('nombre', rolTemporal);
  }, [rolTemporal])

//   useEffect(() => {
//     setRolTemporal(roleNombre);
//   }, [roleNombre])


  const submitHandler = handleSubmit(onSubmit);

  const handleDialogClose = () => {
    setRolTemporal(roleNombre);
    onClose();
    reset();
  };

  return (
    <FormProvider methods={methods}>
      <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} roles={roles} >
        <DialogTitle>Editar rol</DialogTitle>

        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
          <RHFTextField name="nombre" onChange={e => setRolTemporal(e.target.value)} value={rolTemporal} label="Nombre del rol" />
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