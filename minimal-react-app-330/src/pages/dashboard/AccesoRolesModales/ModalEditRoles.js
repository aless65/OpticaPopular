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
import { useState, useEffect, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from 'formik';
import { useSnackbar } from 'notistack';
import { useDispatch } from '../../../redux/store';
import { getRoles } from '../../../redux/slices/rol';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';


export default function EditRolDialog({ open, onClose, roles, setTableData, roleId, roleNombre }) {

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [insertSuccess, setInsertSuccess] = useState(false);

  const [rolTemporal, setRolTemporal] = useState('');

  const [optionsPantallas, setOptionsPantallas] = useState([]);

  const [selectedValues, setSelectedValues] = useState([]);

  const selectedValuesRef = useRef([]);

  const InsertSchema = Yup.object().shape({
    nombre: Yup.string().required('Nombre del rol requerido'),
  });

  useEffect(() => {
    setRolTemporal(roleNombre);
  }, [roleId]);

  const defaultValues = {
    nombre: roleNombre || '',
    pantallas: [],
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
      const selectedIds = selectedValues.map(value => value.id);
      data.pantallas = selectedIds;

      const jsonData = {
        role_Id: roleId,
        role_Nombre: data.nombre,
        role_UsuModificacion: 1,
        role_Pantallas: data.pantallas,
      };

      console.log(jsonData);

      fetch("http://opticapopular.somee.com/api/Roles/Editar", {
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
          if (data.message === "El rol ha sido editado con éxito") {
            setInsertSuccess(true);
            enqueueSnackbar(data.message);
            handleDialogClose();
          } else if (data.message === 'El rol ya existe') {
            setInsertSuccess(false);
            enqueueSnackbar(data.message, { variant: 'warning' });
          } else {
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
      dispatch(getRoles());

      setTableData(roles);

      setInsertSuccess(false);
    }

  }, [dispatch, insertSuccess]);

  useEffect(() => {
    methods.setValue('nombre', rolTemporal);
  }, [rolTemporal])

  const submitHandler = handleSubmit(onSubmit);

  const handleDialogClose = () => {
    onClose();
  };

  useEffect(() => {
    fetch('http://opticapopular.somee.com/api/Pantallas/Listado')
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        const optionsData = data.data.map(item => ({
          label: item.pant_Nombre, // replace 'name' with the property name that contains the label
          id: item.pant_Id,
          menu: item.pant_Menu // replace 'id' with the property name that contains the ID
        }));
        setOptionsPantallas(optionsData);
      })
      .catch(error => console.error(error));
  }, [])

  const options = optionsPantallas.map((option) => {
    const menuName = option.menu.toUpperCase();
    return {
      menuName: /[0-9]/.test(menuName) ? '0-9' : menuName,
      ...option,
    };
  });

  useEffect(() => {
    if (roleId) {
      fetch(`http://opticapopular.somee.com/api/Pantallas/ListadoXRoles?id=${roleId}`)
        .then(response => response.json())
        .then(data => {
          const optionsSelected = data.data.map(item => ({
            label: item.pantrole_NombrePantalla,
            id: item.pant_Id
          }));
          setSelectedValues(optionsSelected);
        })
        .catch(error => console.error(error));

    }
  }, [roleId])

  // useEffect(() => {
  //   console.log(selectedValues); 
  //   const optionsSelected = selectedValues.map(item => ({
  //     label: 
  //   }));

  // }, [selectedValues]);

  return (
    <FormProvider methods={methods}>
      <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} roles={roles} >
        <DialogTitle>Editar rol</DialogTitle>

        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
          <RHFTextField name="nombre" onChange={e => setRolTemporal(e.target.value)} value={rolTemporal} label="Nombre del rol" />

          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={options.sort((a, b) => -b.menuName.localeCompare(a.menuName))}
            groupBy={(option) => option.menuName}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} />
                {option.label}
              </li>
            )}
            renderInput={(params) => <TextField {...params} label="Pantallas" placeholder="Pantallas" />}
            onChange={(event, value) => {
              // selectedValuesRef.current = value;
              setSelectedValues(value);
              console.log(defaultValues.nombre);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedValues}
          />
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