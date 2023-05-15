
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

// eslint-disable-next-line no-use-before-define
EmpleadoNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));


export default function EmpleadoNewEditForm({ isEdit, currentEmpleado }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [optionsEstadosCiviles, setOptionsEstadoCiviles] = useState([]);

  const [optionsCargos, setOptionsCargos] = useState([]);

  const [optionsSucursales, setOptionsSucursales] = useState([]);

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
    cargo: Yup.string().required('Cargo requerido'),
    sucursal: Yup.string().required('Sucursal requerida'),
    // avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      nombres: currentEmpleado?.empe_Nombres || '',
      apellidos: currentEmpleado?.empe_Apellidos || '',
      identidad: currentEmpleado?.empe_Identidad || '',
      fechaNacimiento: currentEmpleado?.empe_FechaNacimiento || '',
      sexo: currentEmpleado?.empe_Sexo || '',
      estadoCivil: currentEmpleado?.estacivi_Id || '',
      telefono: currentEmpleado?.empe_Telefono || '',
      email: currentEmpleado?.empe_CorreoElectronico || '',
      departamento: currentEmpleado?.depa_Id || '',
      municipio: currentEmpleado?.muni_id || '',
      direccion: currentEmpleado?.dire_DireccionExacta || '',
      cargo: currentEmpleado?.carg_Id || '',
      sucursal: currentEmpleado?.sucu_Id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentEmpleado]
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
    if (isEdit && currentEmpleado) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentEmpleado]);

  const onSubmit = async (data) => {
    try {
      const dateStr = data.fechaNacimiento;
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // add 1 to month to get 1-based month number
      const day = date.getDate();
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;


      const jsonData = {
        empe_Id: currentEmpleado?.empe_Id,
        empe_Nombres: data.nombres,
        empe_Apellidos: data.apellidos,
        empe_Identidad: data.identidad,
        empe_FechaNacimiento: formattedDate,
        empe_Sexo: data.sexo,
        estacivi_Id: data.estadoCivil,
        empe_Telefono: data.telefono,
        empe_CorreoElectronico: data.email,
        dire_DireccionExacta: data.direccion,
        muni_Id: data.municipio,
        carg_Id: data.cargo,
        sucu_Id: data.sucursal,
        empe_UsuCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
        empe_UsuModificacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
      };

      if (isEdit) {
        fetch("http://opticapopular.somee.com/api/Empleados/Editar", {
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
            if (data.message === "El empleado ha sido editado con éxito") {
              navigate(PATH_OPTICA.empleados);
              enqueueSnackbar(data.message);
            } else if (data.message === 'Ya existe un empleado con este número de identidad') {
              enqueueSnackbar(data.message, { variant: 'warning' });
            } else {
              enqueueSnackbar(data.message, { variant: 'error' });
            }
          })
          .catch((error) => console.error(error));
      } else {
        fetch("http://opticapopular.somee.com/api/Empleados/Insertar", {
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
            if (data.message === "El empleado ha sido ingresado con éxito") {
              navigate(PATH_OPTICA.empleados);
              enqueueSnackbar(data.message);
            } else if (data.message === 'Ya existe un empleado con este número de identidad') {
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

    fetch('http://opticapopular.somee.com/api/EstadosCiviles/Listado')
      .then(response => response.json())
      .then(data => {
        const optionsData = data.data.map(item => ({
          label: item.estacivi_Nombre, // replace 'name' with the property name that contains the label
          id: item.estacivi_Id // replace 'id' with the property name that contains the ID
        }));
        setOptionsEstadoCiviles(optionsData);
      })
      .catch(error => console.error(error));

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

    fetch('http://opticapopular.somee.com/api/Cargos/Listado')
      .then(response => response.json())
      .then(data => {
        const optionsData = data.data.map(item => ({
          label: item.carg_Nombre, // replace 'name' with the property name that contains the label
          id: item.carg_Id // replace 'id' with the property name that contains the ID
        }));
        setOptionsCargos(optionsData);
      })
      .catch(error => console.error(error));

    fetch('http://opticapopular.somee.com/api/Sucursales/Listado')
      .then(response => response.json())
      .then(data => {
        const optionsData = data.data.map(item => ({
          label: item.sucu_Descripcion, // replace 'name' with the property name that contains the label
          id: item.sucu_Id // replace 'id' with the property name that contains the ID
        }));
        setOptionsSucursales(optionsData);
      })
      .catch(error => console.error(error));

    setDepaId(currentEmpleado?.depa_Id);
  }, [currentEmpleado]);

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

  }, [depaId])

  useEffect(() => {
    fetch(`http://opticapopular.somee.com/api/Municipios/ListadoDdl?id=${currentEmpleado?.depa_Id}`)
      .then(response => response.json())
      .then(data => {
        const optionsData = data.data.map(item => ({
          label: item.muni_Nombre, // replace 'name' with the property name that contains the label
          id: item.muni_id // replace 'id' with the property name that contains the ID
        }));
        setOptionsMunicipios(optionsData);
        defaultValues.municipio = currentEmpleado?.muni_Id;
        methods.setValue('municipio', currentEmpleado?.muni_Id);
      })
      .catch(error => console.error(error));

  }, [currentEmpleado])


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

          <Autocomplete
            name="cargo"
            options={optionsCargos}
            error={!!errors.cargo}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cargo"
                error={!!errors.cargo}
                helperText={errors.cargo?.message}
              />
            )}
            onChange={(event, value) => {
              if (value != null) {
                methods.setValue('cargo', value.id);
                defaultValues.cargo = value.id;
              } else {
                methods.setValue('cargo', '');
                defaultValues.cargo = '';
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={optionsCargos.find(option => option.id === defaultValues.cargo) ?? null}
          />

          <Autocomplete
            name="sucursal"
            options={optionsSucursales}
            error={!!errors.sucursal}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sucursal"
                error={!!errors.sucursal}
                helperText={errors.sucursal?.message}
              />
            )}
            onChange={(event, value) => {
              if (value != null) {
                methods.setValue('sucursal', value.id);
                defaultValues.sucursal = value.id;
              } else {
                methods.setValue('sucursal', '');
                defaultValues.sucursal = '';
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={optionsSucursales.find(option => option.id === defaultValues.sucursal) ?? null}
          />
        </Box>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button to={PATH_DASHBOARD.optica.empleados}>Cancelar</Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Crear empleado' : 'Guardar cambios'}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
