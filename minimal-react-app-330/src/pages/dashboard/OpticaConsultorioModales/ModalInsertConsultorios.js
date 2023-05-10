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
import { getConsultorios } from '../../../redux/slices/consultorio';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';


export default function AddConsultorioDialog({ open, onClose, consultorio, setTableData }) {

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  

  const [insertSuccess, setInsertSuccess] = useState(false);

  const [optionsEmpleados, setOptionsEmpleados] = useState([]);

 

  useEffect(() => {
    fetch('http://opticapopular.somee.com/api/Empleados/Listado')
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


  const InsertSchema = Yup.object().shape({
    consulNombre: Yup.string().required('Nombre del consultorio requerido'),
    empleado: Yup.string().required('Empleado requerido'),
    
  });

  const defaultValues = {
    consulNombre: '',
    empleado: '',
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
        cons_Nombre: data.consulNombre,
        empe_Id: data.empleado,
        usua_IdCreacion: 1,
      };

      fetch("https://localhost:44362/api/Consultorios/Insertar", {
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
          if (data.message === "El Consultorio ha sido insertado con éxito") {
            setInsertSuccess(true);
            enqueueSnackbar(`${data.message} con éxito`);
            handleDialogClose();
          } else if (data.message === 'El Consultorio ya existe') {
            setInsertSuccess(false);
            enqueueSnackbar(data.message, { variant: 'warning' });
          } else {
            setInsertSuccess(false);
            enqueueSnackbar(data.message, { variant: 'error' });
          }
        })
        .catch((error) => console.error(error));
       console.log(data.empleado);
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

      setTableData(consultorio);

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
      <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} consultorio={consultorio} >
        <DialogTitle>Insertar consultorio</DialogTitle>

        {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}


        <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
          <RHFTextField name="consulNombre" label="Nombre del consultorio" />

          <Grid container>
            <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
              <Autocomplete
                disablePortal
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
           
          </Grid>

         
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