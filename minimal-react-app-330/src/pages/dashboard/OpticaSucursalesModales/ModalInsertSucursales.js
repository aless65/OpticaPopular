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
import { getSucursales } from '../../../redux/slices/sucursal';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';


export default function AddConsultorioDialog({ open, onClose, sucursales, setTableData }) {

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();
  const [optionsDepartamentos, setOptionsDepartamentos] = useState([]);

  const [depaId, setDepaId] = useState('');

  const [optionsMunicipios, setOptionsMunicipios] = useState([]);

  const [insertSuccess, setInsertSuccess] = useState(false);

  const [municipioTemporal, setMunicipioTemporal] = useState('');

  const [sucursal, setSucursal] = useState('');

  const [direccion, setDireccion] = useState('');


  const InsertSchema = Yup.object().shape({
    sucursalNombre: Yup.string().required('Nombre del consultorio requerido'),
    departamento: Yup.string().required('Departamento requerido'),
    municipio: Yup.string().required('Municipio requerido'),
    direccion: Yup.string().required('Dirección requerida'),

  });

  const defaultValues = {
    sucursalNombre: '',
    departamento: '',
    municipio: '',
    direccion: '',

  };

  useEffect(() => {
    methods.setValue('sucursalNombre', sucursal);
    methods.setValue('departamento', depaId);
    methods.setValue('municipio', municipioTemporal);
    methods.setValue('direccion', direccion);
  }, [defaultValues]);


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
        sucu_Descripcion: data.sucursalNombre,
        muni_Id: data.municipio,
        dire_DireccionExacta: data.direccion,
        sucu_UsuCreacion: 1,
      };
      console.log(jsonData);

      fetch("http://opticapopular.somee.com/api/Sucursales/Insertar", {
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
          if (data.message === "La sucursal ha sido insertada con éxito") {
            setInsertSuccess(true);
            enqueueSnackbar(`${data.message} con éxito`);
            handleDialogClose();
          } else if (data.message === 'La sucursal ya existe') {
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

    fetch('http://opticapopular.somee.com/api/Departamentos/Listado')
      .then(response => response.json())
      .then(data => {
        const optionsData = data.data.map(item => ({
          label: item.depa_Nombre, // replace 'name' with the property name that contains the label
          id: item.depa_Id // replace 'id' with the property name that contains the ID
        }));
        setOptionsDepartamentos(optionsData);
      })
      .catch(error => console.error(error));

    setDepaId(sucursales?.depa_Id);
  }, [sucursales]);

  useEffect(() => {
    fetch(`http://opticapopular.somee.com/api/Municipios/ListadoDdl?id=${depaId}`)
      .then(response => response.json())
      .then(data => {
        const optionsData = data.data.map(item => ({
          label: item.muni_Nombre, // replace 'name' with the property name that contains the label
          id: item.muni_id // replace 'id' with the property name that contains the ID
        }));
        setOptionsMunicipios(optionsData);
      })
      .catch(error => console.error(error));

    methods.setValue('municipio', null || '');
    defaultValues.municipio = null;
    setMunicipioTemporal('');

  }, [depaId])

  useEffect(() => {
    fetch(`http://opticapopular.somee.com/api/Municipios/ListadoDdl?id=${sucursales?.depa_Id}`)
      .then(response => response.json())
      .then(data => {
        const optionsData = data.data.map(item => ({
          label: item.muni_Nombre, // replace 'name' with the property name that contains the label
          id: item.muni_id // replace 'id' with the property name that contains the ID
        }));
        setOptionsMunicipios(optionsData);
        defaultValues.municipio = sucursales?.muni_Id;
        methods.setValue('municipio', sucursales?.muni_Id);
      })
      .catch(error => console.error(error));

  }, [sucursales])


  useEffect(() => {
    if (insertSuccess === true) {
      dispatch(getSucursales());

      setTableData(sucursales);

      setInsertSuccess(false);
    }

  }, [insertSuccess]);



  const submitHandler = handleSubmit(onSubmit);

  const handleDialogClose = () => {
    setSucursal('');
    setMunicipioTemporal('');
    setDepaId('');
    setDireccion('');
    reset();
    onClose();
  };

  return (
    <FormProvider methods={methods}>
      <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} sucursales={sucursales} >
        <DialogTitle>Insertar sucursal</DialogTitle>

        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
          <Grid container>
            <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
              <RHFTextField name="sucursalNombre" label="Nombre de sucursal" value={sucursal} onChange={(e) => setSucursal(e.target.value)} />

            </Grid>
            <Grid item xs={12} sx={{ pr: 1 }} sm={6}>

              <Autocomplete
                name="departamento"
                options={optionsDepartamentos}
                error={!!errors.departamento}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Departamento"
                    error={!!errors.departamento}
                    helperText={errors.departamento?.message}
                  />
                )}
                onChange={(event, value) => {
                  if (value != null) {
                    methods.setValue('departamento', value.id);
                    defaultValues.departamento = value.id;
                    setDepaId(value.id);
                  } else {
                    methods.setValue('departamento', '');
                    defaultValues.departamento = '';
                    setDepaId('');
                  }
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={optionsDepartamentos.find(option => option.id === depaId) ?? null}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ pr: 1, pt: 3 }} sm={6}>

              <Autocomplete
                name="municipio"
                options={optionsMunicipios}
                error={!!errors.municipio}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Municipio"
                    error={!!errors.municipio}
                    helperText={errors.municipio?.message}
                  />
                )}
                onChange={(event, value) => {
                  if (value != null) {
                    methods.setValue('municipio', value.id);
                    defaultValues.municipio = value.id;
                    setMunicipioTemporal(value.id);
                  } else {
                    methods.setValue('municipio', '');
                    defaultValues.municipio = '';
                    setMunicipioTemporal('');
                  }
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={optionsMunicipios.find(option => option.id === municipioTemporal) ?? null}
              />
            </Grid>
            <Grid item xs={12} sx={{ pr: 1,  pt: 3 }} sm={6}>
              <RHFTextField name="direccion" label="Dirección Exacta" value={direccion} onChange={(e) => setDireccion(e.target.value)} />

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