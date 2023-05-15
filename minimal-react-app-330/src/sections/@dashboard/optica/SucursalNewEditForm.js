
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
SUcursalNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));


export default function SUcursalNewEditForm({ isEdit, currentSucursal }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [optionsDepartamentos, setOptionsDepartamentos] = useState([]);

  const [depaId, setDepaId] = useState('');

  const [optionsMunicipios, setOptionsMunicipios] = useState([]);

  const NewUserSchema = Yup.object().shape({
    nombres: Yup.string().required('Nombres requeridos'),
    departamento: Yup.string().required('Departamento requerido'),
    municipio: Yup.string().required('Municipio requerido'),
    direccion: Yup.string().required('Dirección requerida'),
    
  });

  const defaultValues = useMemo(
    () => ({
      nombres: currentSucursal?.sucu_Descripcion || '',
      departamento: currentSucursal?.depa_Id || '',
      municipio: currentSucursal?.muni_Id || '',
      direccion: currentSucursal?.dire_DireccionExacta || '',
      
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSucursal]
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
    if (isEdit && currentSucursal) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentSucursal]);

  const onSubmit = async (data) => {
    try {

      const jsonData = {
        sucu_Id: currentSucursal?.sucu_Id,
        sucu_Descripcion: data.nombres,
        dire_DireccionExacta: data.direccion,
        muni_Id: data.municipio,
        sucu_UsuCreacion: 1,
        sucu_UsuModificacion: 1,
      };

      if (isEdit) {
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
            console.log(data);
            if (data.message === "La sucursal ha sido editado con éxito") {
              navigate(PATH_OPTICA.sucursales);
              enqueueSnackbar(data.message);
            } else if (data.message === 'La sucursal ya existe') {
              enqueueSnackbar(data.message, { variant: 'warning' });
            } else {
              enqueueSnackbar(data.message, { variant: 'error' });
            }
          })
          .catch((error) => console.error(error));
      } else {
        fetch("https://localhost:44362/api/Sucursales/Insertar", {
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
              navigate(PATH_OPTICA.sucursales);
              enqueueSnackbar(data.message);
            } else if (data.message === 'La sucursal ya existe') {
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

    setDepaId(currentSucursal?.depa_Id);
  }, [currentSucursal]);

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
    fetch(`https://localhost:44362/api/Municipios/ListadoDdl?id=${currentSucursal?.depa_Id}`)
      .then(response => response.json())
      .then(data => {
        const optionsData = data.data.map(item => ({
          label: item.muni_Nombre, // replace 'name' with the property name that contains the label
          id: item.muni_id // replace 'id' with the property name that contains the ID
        }));
        setOptionsMunicipios(optionsData);
        defaultValues.municipio = currentSucursal?.muni_Id;
        methods.setValue('municipio', currentSucursal?.muni_Id);
      })
      .catch(error => console.error(error));

  }, [currentSucursal])


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
          <Button to={PATH_DASHBOARD.optica.sucursales}>Cancelar</Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Crear sucursal' : 'Guardar cambios'}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
