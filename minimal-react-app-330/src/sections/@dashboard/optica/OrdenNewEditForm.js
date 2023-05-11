
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
                empe_UsuCreacion: 1,
                empe_UsuModificacion: 1,
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

    // Incrementer.propTypes = {
    //     available: PropTypes.number,
    //     quantity: PropTypes.number,
    //     onIncrease: PropTypes.func,
    //     onDecrease: PropTypes.func,
    //   };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', gap: '16px' }}>
                <Card sx={{ flex: 1, p: 3, pl: 4, pr: 4 }}>
                    <Box
                        sx={{
                            display: 'grid',
                            columnGap: 2,
                            rowGap: 3,
                            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                        }}
                    >
                        <Autocomplete
                            disablePortal
                            name="estadoCivil"
                            options={optionsEstadosCiviles}
                            error={!!errors.estadoCivil}
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Cliente"
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

                        <Controller
                            name="fechaNacimiento"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <DatePicker
                                    label="Fecha"
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
                            name="fechaNacimiento"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <DatePicker
                                    label="Fecha de Entrega"
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

                    </Box>

                    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Button to={PATH_DASHBOARD.optica.empleados}>Cancelar</Button>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            {!isEdit ? 'Crear empleado' : 'Guardar cambios'}
                        </LoadingButton>
                    </Stack>
                </Card>
                <Card sx={{ flex: 1, p: 3, pl: 4, pr: 4 }}>
                    <Box
                        sx={{
                            display: 'grid',
                            columnGap: 2,
                            rowGap: 3,
                            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                        }}
                    >
                        <Autocomplete
                            disablePortal
                            name="municipio"
                            options={optionsMunicipios}
                            error={!!errors.municipio}
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Aros"
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

                        <RHFTextField name="direccion" label="Graduación izquierdo" />
                        <RHFTextField name="direccion" label="Graduación derecho" />
                        <RHFTextField name="direccion" label="Precio" />
                        <TableCell align="left">
                  <Incrementer
                    quantity={quantity}
                    available={available}
                    onDecrease={() => onDecreaseQuantity(id)}
                    onIncrease={() => onIncreaseQuantity(id)}
                  />
                </TableCell>
                    </Box>
                </Card>
            </Box>

        </FormProvider>
    );
}

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  available: PropTypes.number,
  quantity: PropTypes.number,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func,
};

function Incrementer({ available, quantity, onIncrease, onDecrease }) {
  return (
    <Box sx={{ width: 96, textAlign: 'right' }}>
      <IncrementerStyle>
        <IconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
          <Iconify icon={'eva:minus-fill'} width={16} height={16} />
        </IconButton>
        {quantity}
        <IconButton size="small" color="inherit" onClick={onIncrease} disabled={quantity >= available}>
          <Iconify icon={'eva:plus-fill'} width={16} height={16} />
        </IconButton>
      </IncrementerStyle>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        available: {available}
      </Typography>
    </Box>
  );
}
