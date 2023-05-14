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

ProveedorNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));


export default function ProveedorNewEditForm({ isEdit, currentProveedor }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();


  const [optionsDepartamentos, setOptionsDepartamentos] = useState([]);

  const [depaId, setDepaId] = useState('');

  const [optionsMunicipios, setOptionsMunicipios] = useState([]);

  

  // const [estadoCivilTemporal, setEstadoCivilTemporal] = useState(currentEmpleado?.estacivi_Id || '');

  const NewUserSchema = Yup.object().shape({
    nombres: Yup.string().required('Nombres requeridos'),
    email: Yup.string().required('Correo Electrónico requerido').email('Correo inválido'),
    telefono: Yup.string().required('Teléfono requerido'),
    departamento: Yup.string().required('Departamento requerido'),
    municipio: Yup.string().required('Municipio requerido'),
    direccion: Yup.string().required('Dirección requerida'),
    // avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      nombres: currentProveedor?.prov_Nombre || '',
      email: currentProveedor?.prov_CorreoElectronico || '',
      telefono: currentProveedor?.prov_Telefono || '',
      departamento: currentProveedor?.depa_Id || '',
      municipio: currentProveedor?.muni_id || '',
      direccion: currentProveedor?.dire_DireccionExacta || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProveedor]
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
    if (isEdit && currentProveedor) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProveedor]);

  

  const onSubmit = async (data) => {
    try {
      const jsonData = {
        prov_Id: currentProveedor?.prov_Id,
        prov_Nombre: data.nombres,
        prov_CorreoElectronico: data.email,
        prov_Telefono: data.telefono,
        prov_UsuCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
        prov_UsuModificacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
        dire_DireccionExacta: data.direccion,
        muni_Id: data.municipio,
      };
     console.log(jsonData)

      if (isEdit) {
        fetch("https://localhost:44362/api/Proveedores/Editar", {
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
            if (data.message === "El Proveedor ha sido editada con éxito") {
              navigate(PATH_OPTICA.proveedores);
              enqueueSnackbar(data.message);
            } else if (data.message === 'El proveedor ya existe') {
              enqueueSnackbar(data.message, { variant: 'warning' });
            } else {
              enqueueSnackbar(data.message, { variant: 'error' });
            }
          })
          .catch((error) => console.error(error));
      } else {
        fetch("https://localhost:44362/api/Proveedores/Insertar", {
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
            if (data.message === "El proveedor ha sido insertada con éxito") {
              navigate(PATH_OPTICA.proveedores);
              enqueueSnackbar(data.message);
            } else if (data.message === 'El proveedor ya existe') {
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


    setDepaId(currentProveedor?.depa_Id);
  }, [currentProveedor]);

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
    fetch(`http://opticapopular.somee.com/api/Municipios/ListadoDdl?id=${currentProveedor?.depa_Id}`)
      .then(response => response.json())
      .then(data => {
        const optionsData = data.data.map(item => ({
          label: item.muni_Nombre, // replace 'name' with the property name that contains the label
          id: item.muni_id // replace 'id' with the property name that contains the ID
        }));
        setOptionsMunicipios(optionsData);
        defaultValues.municipio = currentProveedor?.muni_Id;
        methods.setValue('municipio', currentProveedor?.muni_Id);
      })
      .catch(error => console.error(error));

  }, [currentProveedor])


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
          <RHFTextField name="nombres" label="Nombre" />
         
          {/* <RHFTextField type="date" name="nacimiento" label="" /> */}

          <RHFTextField name="telefono" label="Teléfono" />
          <RHFTextField name="email" label="Correo electrónico" />

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

          <RHFTextField name="direccion" label="Dirección Exacta" />

          
        </Box>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button to={PATH_DASHBOARD.optica.proveedores}>Cancelar</Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Crear Proveedor' : 'Guardar cambios'}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}

