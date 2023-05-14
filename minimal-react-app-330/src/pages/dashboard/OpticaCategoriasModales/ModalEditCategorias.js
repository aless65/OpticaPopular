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
import { getCategorias } from '../../../redux/slices/categoria';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';


export default function EditRolCategoriaDialog({ open, onClose, categorias, setTableData, categoriaId, categoriaNombre }) {

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [insertSuccess, setInsertSuccess] = useState(false);
  
  const [categoriaTemporal, setCategoriaTemporal] = useState('');

  const InsertSchema = Yup.object().shape({
    nombre: Yup.string().required('Nombre de la categoría requerido'),
  });

  useEffect(() => {
    setCategoriaTemporal(categoriaNombre);
  }, [categoriaId]);

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
        cate_Id: categoriaId,
        cate_Nombre: data.nombre,
        cate_UsuModificacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
      };

      fetch("http://opticapopular.somee.com/api/Categorias/Editar", {
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
          if (data.message === "La categoría ha sido editada con éxito") {
            setInsertSuccess(true);
            enqueueSnackbar(data.message);
            handleDialogClose();
          } else if (data.message === 'La categoría ya existe'){
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
      dispatch(getCategorias());

      setTableData(categorias);

      setInsertSuccess(false);
    }

  }, [dispatch, insertSuccess]);

  useEffect(() => {
    methods.setValue('nombre', categoriaTemporal);
  }, [categoriaTemporal])

//   useEffect(() => {
//     setRolTemporal(roleNombre);
//   }, [roleNombre])


  const submitHandler = handleSubmit(onSubmit);

  const handleDialogClose = () => {
    setCategoriaTemporal(categoriaNombre);
    onClose();
    reset();
  };

  return (
    <FormProvider methods={methods}>
      <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} categorias={categorias} >
        <DialogTitle>Editar categoria</DialogTitle>

        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
          <RHFTextField name="nombre" onChange={e => setCategoriaTemporal(e.target.value)} value={categoriaTemporal} label="Nombre de la categoria" />
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