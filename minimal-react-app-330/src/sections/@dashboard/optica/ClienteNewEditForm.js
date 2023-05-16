import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton, DatePicker } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  FormControl,
  Autocomplete,
  TextField,
  Radio,
  RadioGroup,
  FormLabel,
  styled,
  Button
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD, PATH_OPTICA } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFRadioGroup } from '../../../components/hook-form';

// ----------------------------------------------------------------------

ClienteNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));


export default function ClienteNewEditForm({ isEdit, currentCliente }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [optionsEstadosCiviles, setOptionsEstadoCiviles] = useState([]);

  const [optionsDepartamentos, setOptionsDepartamentos] = useState([]);

  const [depaId, setDepaId] = useState('');

  const [optionsMunicipios, setOptionsMunicipios] = useState([]);

  const GENDER_OPTION = ['Masculino', 'Femenino'];

  // const [estadoCivilTemporal, setEstadoCivilTemporal] = useState(currentEmpleado?.estacivi_Id || '');

  const NewUserSchema = Yup.object().shape({
    nombres: Yup.string().required('Nombres requeridos'),
    apellidos: Yup.string().required('Apellidos requeridos'),
    identidad: Yup.string().required('Identidad requerida'),
    fechaNacimiento: Yup.string().required('Fecha de Nacimiento requerida').nullable(),
    sexo: Yup.string().required('Sexo requerido'),
    estadoCivil: Yup.string().required('Estado Civil requerido'),
    telefono: Yup.string().required('Teléfono requerido'),
    email: Yup.string().required('Correo Electrónico requerido').email('Correo inválido'),
    departamento: Yup.string().required('Departamento requerido'),
    municipio: Yup.string().required('Municipio requerido'),
    direccion: Yup.string().required('Dirección requerida'),
    // avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      nombres: currentCliente?.clie_Nombres || '',
      apellidos: currentCliente?.clie_Apellidos || '',
      identidad: currentCliente?.clie_Identidad || '',
      fechaNacimiento: currentCliente?.clie_FechaNacimiento || '',
      sexo: currentCliente?.clie_Sexo || '',
      estadoCivil: currentCliente?.estacivi_Id || '',
      telefono: currentCliente?.clie_Telefono || '',
      email: currentCliente?.clie_CorreoElectronico || '',
      departamento: currentCliente?.depa_Id || '',
      municipio: currentCliente?.muni_id || '',
      direccion: currentCliente?.dire_DireccionExacta || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCliente]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentCliente) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCliente]);
 
  const onSubmit = async (data) => {
    try {
      const dateStr = data.fechaNacimiento;
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // add 1 to month to get 1-based month number
      const day = date.getDate();
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;


      const jsonData = {
        clie_Id: currentCliente?.clie_Id,
        clie_Nombres: data.nombres,
        clie_Apellidos: data.apellidos,
        clie_Identidad: data.identidad,
        clie_Sexo: data.sexo,
        clie_FechaNacimiento: formattedDate,
        estacivi_Id: data.estadoCivil,
        clie_Telefono: data.telefono,
        clie_CorreoElectronico: data.email,
        clie_UsuCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
        clie_UsuModificacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
        dire_DireccionExacta: data.direccion,
        muni_Id: data.municipio,
      };

      if (isEdit) {
        fetch("https://localhost:44362/api/Clientes/Editar", {
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
            console.log("update")
            if (data.message === "El cliente ha sido editado con éxito") {
              navigate(PATH_OPTICA.clientes);
              enqueueSnackbar(data.message);
            } else if (data.message === 'Ya existe un cliente con este número de identidad') {
              enqueueSnackbar(data.message, { variant: 'warning' });
            } else {
              enqueueSnackbar(data.message, { variant: 'error' });
            }
          })
          .catch((error) => console.error(error));
      } else {
        fetch("https://localhost:44362/api/Clientes/Insertar", {
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
            console.log("insertar");
            if (data.message === "El cliente ha sido ingresado con éxito") {
              navigate(PATH_OPTICA.clientes);
              enqueueSnackbar(data.message);
            } else if (data.message === 'Ya existe un cliente con este número de identidad') {
              enqueueSnackbar(data.message, { variant: 'warning' });
            } else {
              enqueueSnackbar(data.message, { variant: 'error' });
            }
          })
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.error(error); 
    }
  };

  useEffect(() => {

    fetch('https://localhost:44362/api/EstadosCiviles/Listado')
      .then(response => response.json())
      .then(data => {
        const optionsData = data.data.map(item => ({
          label: item.estacivi_Nombre, // replace 'name' with the property name that contains the label
          id: item.estacivi_Id // replace 'id' with the property name that contains the ID
        }));
        setOptionsEstadoCiviles(optionsData);
      })
      .catch(error => console.error(error));

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


    setDepaId(currentCliente?.depa_Id);
  }, [currentCliente]);

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
    fetch(`https://localhost:44362/api/Municipios/ListadoDdl?id=${currentCliente?.depa_Id}`)
      .then(response => response.json())
      .then(data => {
        const optionsData = data.data.map(item => ({
          label: item.muni_Nombre, // replace 'name' with the property name that contains the label
          id: item.muni_id // replace 'id' with the property name that contains the ID
        }));
        setOptionsMunicipios(optionsData);
        defaultValues.municipio = currentCliente?.muni_Id;
        methods.setValue('municipio', currentCliente?.muni_Id);
      })
      .catch(error => console.error(error));

  }, [currentCliente])


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3, pl: 4, pr: 4 }}>
        <Box
          sx={{
            display: 'grid',
            columnGap: 2,
            rowGap: 3,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <RHFTextField name="nombres" label="Nombres" />
          <RHFTextField name="apellidos" label="Apellidos" />
          <RHFTextField name="identidad" label="Identidad" />
          {/* <RHFTextField type="date" name="nacimiento" label="" /> */}
          <Controller
            name="fechaNacimiento"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label="Fecha de Nacimiento"
                value={field.value || null}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                )}
              />
            )}
          />

          <div>
            <LabelStyle>Sexo</LabelStyle>
            <RHFRadioGroup
              name="sexo"
              options={GENDER_OPTION}
              sx={{
                '& .MuiFormControlLabel-root': { mr: 4 },
              }}
            />
          </div>


          <Autocomplete
            name="estadoCivil"
            options={optionsEstadosCiviles}
            error={!!errors.estadoCivil}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Estado Civil"
                error={!!errors.estadoCivil}
                helperText={errors.estadoCivil?.message}
              />
            )}
            onChange={(event, value) => {
              if (value != null) {
                methods.setValue('estadoCivil', value.id);
                // setEstadoCivilTemporal(value.id);
                defaultValues.estadoCivil = value.id;
                // console.log(defaultValues.estadoCivil);
              } else {
                methods.setValue('estadoCivil', '');
                defaultValues.estadoCivil = '';
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={optionsEstadosCiviles.find(option => option.id === defaultValues.estadoCivil) ?? null}
          />

          <RHFTextField name="telefono" label="Teléfono" />
          <RHFTextField name="email" label="Correo electrónico" />

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
            value={optionsDepartamentos.find(option => option.id === defaultValues.departamento) ?? null}
          />

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
              } else {
                methods.setValue('municipio', '');
                defaultValues.municipio = '';
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={optionsMunicipios.find(option => option.id === defaultValues.municipio) ?? null}
          />

          <RHFTextField name="direccion" label="Dirección Exacta" />

          
        </Box>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button to={PATH_DASHBOARD.optica.clientes}>Cancelar</Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Crear cliente' : 'Guardar cambios'}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}

