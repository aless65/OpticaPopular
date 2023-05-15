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
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../../../redux/store';
import { getSucursales, getSucursal } from '../../../redux/slices/sucursal';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';


export default function EditSucursalDialog({ open, onClose, sucursales, setTableData, sucursalId }) {

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [insertSuccess, setInsertSuccess] = useState(false);

  const sucursal = useSelector((state) => state.sucursal.sucursal);

  const dispatch = useDispatch();

  const [sucursalTemporal, setsucursalTemporal] = useState('');

  const [optionsDepartamentos, setOptionsDepartamentos] = useState([]);

  const [depaId, setDepaId] = useState('');

  const [muniId, setMuniId] = useState('');

  const [direccion, setDireccion] = useState('');

  const [optionsMunicipios, setOptionsMunicipios] = useState([]);




  // const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({ defaultValues });

  useEffect(() => {
    if (sucursalId) {
      dispatch(getSucursal(sucursalId));
    }
  }, [sucursalId, dispatch, insertSuccess]);

  useEffect(() => {
    if (sucursal) {
      setsucursalTemporal(sucursal.sucu_Descripcion);
      setDepaId(sucursal.depa_Id);
      setMuniId(sucursal.muni_Id);
      setDireccion(sucursal.dire_DireccionExacta);
      console.log(sucursal);
    }
  }, [sucursal]);



  useEffect(() => {

    fetch('https://localhost:44362/api/Departamentos/Listado')
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
    fetch(`https://localhost:44362/api/Municipios/ListadoDdl?id=${depaId}`)
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

  }, [depaId])

  useEffect(() => {
    fetch(`https://localhost:44362/api/Municipios/ListadoDdl?id=${sucursales?.depa_Id}`)
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

  const defaultValues = {
    sucursal: sucursal?.sucu_Descripcion || '',
    departamento: sucursal?.depa_Id || '',
    municipio: sucursal?.muni_Id || '',
    direccion: sucursal?.dire_DireccionExacta || '',

  };


  const NewUserSchema = Yup.object().shape({
    sucursal: Yup.string().required('Nombre del consultorio requerido'),
    departamento: Yup.string().required('Departamento requerido'),
    municipio: Yup.string().required('Municipio requerido'),
    direccion: Yup.string().required('Dirección requerida'),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    register, // Registrar el campo consultorioNombre
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;



  // const values = watch();

  useEffect(() => {
    methods.setValue('sucursal', sucursalTemporal);
    methods.setValue('direccion', direccion);
    methods.setValue('departamento', depaId);
    methods.setValue('municipio', muniId);
  }, [defaultValues]);



  const onSubmit = async (data) => {

    try {
      // console.log(data);
      const jsonData = {
        sucu_Id: sucursalId,
        sucu_Descripcion: data.sucursalNombre,
        sucu_UsuModificacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
        dire_DireccionExacta: data.direccion,
        muni_Id: data.municipio,
      };
      console.log(jsonData);
      fetch("https://localhost:44362/api/Sucursales/Editar", {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.message === "La sucursal ha sido editada con éxito") {
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
      dispatch(getSucursales());
      setInsertSuccess(false);
    }

  }, [insertSuccess]);

  useEffect(() => {
    methods.setValue('sucursalNombre', sucursalTemporal);
  }, [sucursalTemporal])

  const submitHandler = handleSubmit(onSubmit);

  const handleDialogClose = () => {
    onClose();
  };

  return (
    <FormProvider methods={methods}>
      <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} sucursales={sucursales}>
        <DialogTitle>Editar sucursal</DialogTitle>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
          <Grid container>
            <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
              <RHFTextField name="sucursal" label="Nombre del consultorio" value={sucursalTemporal} onChange={(e) => setsucursalTemporal(e.target.value)} />

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
                    setMuniId(value.id);
                  } else {
                    methods.setValue('municipio', '');
                    defaultValues.municipio = '';
                    setMuniId('');
                  }
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={optionsMunicipios.find(option => option.id === muniId) ?? null}
              />
            </Grid>
            <Grid item xs={12} sx={{ pr: 1,  pt: 3 }} sm={6}>
              <RHFTextField name="direccion" label="Dirección Exacta" value={direccion} onChange={(e) => setDireccion(e.target.value)} />

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