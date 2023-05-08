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
  FormLabel
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD, PATH_OPTICA } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit, currentUser }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [optionsEstadosCiviles, setOptionsEstadoCiviles] = useState([]);

  const [optionsCargos, setOptionsCargos] = useState([]);

  const [optionsSucursales, setOptionsSucursales] = useState([]);

  const [optionsDepartamentos, setOptionsDepartamentos] = useState([]);

  const [depaId, setDepaId] = useState('');

  const [optionsMunicipios, setOptionsMunicipios] = useState([]);

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
      nombres: currentUser?.nombres || '',
      apellidos: currentUser?.apellidos || '',
      identidad: currentUser?.identidad || '',
      fechaNacimiento: currentUser?.fechaNacimiento || '',
      sexo: currentUser?.sexo || '',
      estadoCivil: currentUser?.estadoCivil || '',
      telefono: currentUser?.telefono || '',
      email: currentUser?.email || '',
      departamento: currentUser?.departamento || '',
      municipio: currentUser?.municipio || '',
      direccion: currentUser?.direccion,
      cargo: currentUser?.cargo || '',
      sucursal: currentUser?.sucursal || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
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
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const dateStr = data.fechaNacimiento;
      const date = new Date(dateStr);
      const formattedDate = date.toLocaleDateString('en-GB');

      const jsonData = {
        empe_Nombres: data.nombres,
        empe_Apellidos: data.apellidos,
        empe_Identidad: data.identidad,
        fecha_nacimiento: formattedDate,
        empe_Sexo: data.sexo,
        estacivi_Id: data.estadoCivil,
        empe_Telefono: data.telefono,
        empe_CorreoElectronico: data.email,
        dire_DireccionExacta: data.direccion,
        muni_Id: data.municipio,
        carg_Id: data.cargo,
        sucu_Id: data.sucursal,
        empe_UsuCreacion: 1,
      };

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
  }, []);

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

    // methods.setValue('municipio', null || '');
  }, [depaId])

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

          <Controller
            name="sexo"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl>
                <FormLabel component="legend">Sexo</FormLabel>
                <RadioGroup {...field} row>
                  <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />
                  <FormControlLabel value="femenino" control={<Radio />} label="Femenino" />
                </RadioGroup>
              </FormControl>
            )}
          />

          <Autocomplete
            disablePortal
            name="estadoCivil"
            options={optionsEstadosCiviles}
            error={errors.estadoCivil?.message !== undefined}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Estado Civil"
                error={errors.estadoCivil?.message !== undefined}
                helperText={errors.estadoCivil?.message}
              />
            )}
            onChange={(event, value) => {
              if (value != null) {
                methods.setValue('estadoCivil', value.id);
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={optionsEstadosCiviles.find(option => option.id === defaultValues.estadoCivil)}
          />

          <RHFTextField name="telefono" label="Teléfono" />
          <RHFTextField name="email" label="Correo electrónico" />

          <Autocomplete
            disablePortal
            name="departamento"
            options={optionsDepartamentos}
            error={errors.departamento?.message !== undefined}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Departamento"
                error={errors.departamento?.message !== undefined}
                helperText={errors.departamento?.message}
              />
            )}
            onChange={(event, value) => {
              if (value != null) {
                methods.setValue('departamento', value.id);
                setDepaId(value.id);
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={optionsDepartamentos.find(option => option.id === defaultValues.departamento)}
          />

          <Autocomplete
            disablePortal
            name="municipio"
            options={optionsMunicipios}
            error={errors.municipio?.message !== undefined}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Municipio"
                error={errors.municipio?.message !== undefined}
                helperText={errors.municipio?.message}
              />
            )}
            onChange={(event, value) => {
              if (value != null) {
                console.log(value.id);
                methods.setValue('municipio', value.id);
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={optionsMunicipios.find(option => option.id === defaultValues.municipio)}
          />

          <RHFTextField name="direccion" label="Dirección Exacta" />

          <Autocomplete
            disablePortal
            name="cargo"
            options={optionsCargos}
            error={errors.cargo?.message !== undefined}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cargo"
                error={errors.cargo?.message !== undefined}
                helperText={errors.cargo?.message}
              />
            )}
            onChange={(event, value) => {
              if (value != null) {
                methods.setValue('cargo', value.id);
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={optionsCargos.find(option => option.id === defaultValues.cargo)}
          />

          <Autocomplete
            disablePortal
            name="sucursal"
            options={optionsSucursales}
            error={errors.sucursal?.message !== undefined}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sucursal"
                error={errors.sucursal?.message !== undefined}
                helperText={errors.sucursal?.message}
              />
            )}
            onChange={(event, value) => {
              if (value != null) {
                methods.setValue('sucursal', value.id);
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={optionsSucursales.find(option => option.id === defaultValues.sucursal)}
          />
        </Box>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Crear empleado' : 'Guardar cambios'}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
