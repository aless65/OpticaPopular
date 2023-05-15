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


export default function EditConsultorioDialog({ open, onClose, sucursales, setTableData, sucursalId, sucursalNombre }) {

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

    const [insertSuccess, setInsertSuccess] = useState(false);

    const consultorio = useSelector((state) => state.sucursal.sucursal);

    const dispatch = useDispatch();

    const [sucursalTemporal, setsucursalTemporal] = useState('');

    const [optionsDepartamentos, setOptionsDepartamentos] = useState([]);

    const [depaId, setDepaId] = useState('');

    const [optionsMunicipios, setOptionsMunicipios] = useState([]);

  
   

    // const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({ defaultValues });

    useEffect(() => {
        if (sucursalId) {
            dispatch(getSucursal(sucursalId));
        }
    }, [sucursalId, dispatch, insertSuccess]);

    useEffect(() => {
        if (consultorio) {
          setsucursalTemporal(sucursalNombre);
          
          
        }
      }, [consultorio]);

    

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

    

    const NewUserSchema = Yup.object().shape({
      sucursalNombre: Yup.string().required('Nombre del consultorio requerido'),
        empleado: Yup.string().required('Empleado requerido'),
        departamento: Yup.string().required('Departamento requerido'),
    municipio: Yup.string().required('Municipio requerido'),
    direccion: Yup.string().required('Dirección requerida'),
    });

    const defaultValues = {
        sucursalNombre: sucursalNombre || '',
        departamento:  '',
        municipio:  '',
        direccion:  '',

    };

    

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
        methods.setValue('sucursalNombre', defaultValues.sucursalNombre);
        methods.setValue('direccion', defaultValues.direccion);
        methods.setValue('departamento', defaultValues.departamento);
        methods.setValue('municipio', defaultValues.municipio);
      }, [defaultValues]);

      

    const onSubmit = async (data) => {
         
        try {
            console.log(data);
            const jsonData = {
                sucu_Id: sucursalId,
                sucu_Descripcion: data.sucursalNombre, 
                sucu_UsuModificacion: 1,
                dire_DireccionExacta: data.direccion,
                muni_Id: data.municipio,
            };
              console.log(jsonData);
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
                    if (data.message === "La sucursal ha sido editado con éxito") {
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
            setTableData(sucursales);
            setInsertSuccess(false);
        }

    }, [insertSuccess]);

    useEffect(() => {
        methods.setValue('sucursalNombre', sucursalTemporal);
      }, [sucursalTemporal])

    const submitHandler = handleSubmit(onSubmit);

    const handleDialogClose = () => {
        setsucursalTemporal(sucursalNombre);
        onClose();
        reset();
    };
    
    return (
      <FormProvider methods={methods}>
  <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} sucursales={sucursales}>
    <DialogTitle>Editar sucursal</DialogTitle>
    {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
    <Grid container>
      <Grid item xs={6} sx={{ p: 3, pb: 0, pl: 5, pr: 2 }}>
        {/* Agregar el campo TextField para el nombre del consultorio */}
        <TextField
          fullWidth
          label="Nombre de la sucursal"
          {...register('sucursalNombre', {
            validate: async value => {
              try {
                await NewUserSchema.validate({ sucursalNombre: value });
                return true;
              } catch (error) {
                return error.message;
              }
            }
          })}
          error={Boolean(errors.sucursalNombre)}
          helperText={errors.sucursalNombre?.message}
        />
      </Grid>

      <Grid item xs={6} sx={{ p: 3, pb: 0, pl: 2, pr: 5 }}>
        <Stack spacing={3}>
          <RHFTextField name="direccion" label="Dirección exacta" />

          <Autocomplete
            disablePortal
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
            value={optionsDepartamentos.find(option => option.id === defaultValues.departamento) ?? null}
          />

          <Autocomplete
            disablePortal
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
              } else {
                methods.setValue('municipio', '');
                defaultValues.municipio = '';
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={optionsMunicipios.find(option => option.id === defaultValues.municipio) ?? null}
          />
        </Stack>
      </Grid>
    </Grid>
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