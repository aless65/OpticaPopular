/* eslint-disable camelcase */
import axios from 'axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Dialog, Button, Divider, DialogTitle, DialogContent, DialogActions, Autocomplete, TextField, TextareaAutosize } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// _mock
import { countries } from '../../../../_mock';
import { FormProvider, RHFCheckbox, RHFSelect, RHFTextField, RHFRadioGroup } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

CheckoutNewAddressForm.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onNextStep: PropTypes.func,
    onCreateBilling: PropTypes.func,
};

export default function CheckoutNewAddressForm({ open, onClose, onNextStep, onCreateBilling, clie_Id, cargarDirecciones }) {
    const { enqueueSnackbar } = useSnackbar();

    const [optionsDepartamentos, setOptionsDepartamentos] = useState([]);

    const [optionsMunicipios, setOptionsMunicipios] = useState([]);

    const [depa_Id, setDepa_Id] = useState('');

    const clieId = clie_Id;

    const NewAddressSchema = Yup.object().shape({
        depa_Id: Yup.string().required('El departamento es requerido'),
        muni_Id: Yup.string().required('El municipio es requerido'),
        dire_DireccionExacta: Yup.string().required('La dirección exacta es requerida'),
    });

    useEffect(() => {
        axios.get('Departamentos/Listado')
            .then((response) => {
                if (response.data.code === 200) {
                    const optionsData = response.data.data.map(item => ({
                        label: item.depa_Nombre,
                        id: item.depa_Id
                    }));
                    setOptionsDepartamentos(optionsData);
                }
            })
            .catch(error => console.error(error));
    }, [])

    useEffect(() => {
        axios.get(`Municipios/ListadoDdl?id=${depa_Id}`)
            .then((response) => {
                if (response.data.code === 200) {
                    const optionsData = response.data.data.map(item => ({
                        label: item.muni_Nombre,
                        id: item.muni_id
                    }));
                    setOptionsMunicipios(optionsData);
                }
            })
            .catch(error => console.error(error));
    }, [depa_Id])


    const defaultValues = {
        depa_Id: '',
        muni_Id: '',
        dire_DireccionExacta: ''
    };

    const methods = useForm({
        resolver: yupResolver(NewAddressSchema),
        defaultValues,
    });

    const handleClose = () => {
        reset();
        onClose();
    }

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = methods;

    const onSubmit = async (data) => {
        try {
            axios.post('DireccionesPorCliente/Insert', {
                dicl_Id: 0,
                clie_Id: clieId,
                dire_Id: 0,
                usua_IdCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
                muni_Id: data.muni_Id,
                dire_DireccionExacta: data.dire_DireccionExacta
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(response => {
                if (response.data.code === 200) {
                    if (response.data.data.codeStatus > 0) {
                        enqueueSnackbar(`Direccion insertada con éxito`, { variant: 'success' });
                        handleClose();
                        axios.get(`DireccionesPorCliente/UltimaDireccionPorCliente?clie_Id=${clieId}`)
                            .then(response1 => {
                                if (response1.data.code === 200) {
                                    onCreateBilling({
                                        id: response1.data.data.dire_Id,
                                        receiver: response1.data.data.dicl_NombreClientes,
                                        fullAddress: `Honduras, ${response1.data.data.depa_Nombre}, ${response1.data.data.muni_Nombre}.  ${response1.data.data.dicl_DireccionExacta}`,
                                        phone: response1.data.data.clie_Telefono,
                                        addressType: 'Otro',
                                        isDefault: false,
                                    });
                                }
                            })
                        cargarDirecciones(true);
                        onNextStep();
                    } else {
                        enqueueSnackbar(`Ocurrio un error al intentar agregar la direccion`, { variant: 'error' });
                    }
                } else {
                    enqueueSnackbar(`Ocurrio un error al intentar agregar la direccion`, { variant: 'error' });
                }
            })
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <DialogTitle>Agregar nueva dirección</DialogTitle>
            <br />
            <Divider />
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Stack spacing={3}>
                        <Controller
                            name="depa_Id"
                            render={({ field, fieldState: { error } }) => (
                                <Autocomplete
                                    name="depa_Id"
                                    options={optionsDepartamentos}
                                    error={errors.depa_Id?.message !== undefined}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Departamento"
                                            error={errors.depa_Id?.message !== undefined}
                                            helperText={errors.depa_Id?.message}
                                        />}
                                    onChange={(event, value) => {
                                        if (value != null) {
                                            methods.setValue('depa_Id', value.id);
                                            methods.setValue('muni_Id', '');
                                            setDepa_Id(value.id);
                                        } else {
                                            methods.setValue('depa_Id', '');
                                            methods.setValue('muni_Id', '');
                                            setDepa_Id('');
                                        }
                                    }}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={optionsDepartamentos.find(option => option.id === defaultValues.depa_Id)}
                                />
                            )}
                        />

                        <Controller
                            name="muni_Id"
                            render={({ field, fieldState: { error } }) => (
                                <Autocomplete
                                    name="muni_Id"
                                    options={optionsMunicipios}
                                    error={errors.muni_Id?.message !== undefined}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Municipio"
                                            error={errors.muni_Id?.message !== undefined}
                                            helperText={errors.muni_Id?.message}
                                        />}
                                    onChange={(event, val) => {
                                        field.onChange(val.id);
                                    }}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={optionsMunicipios.find(option => option.id === defaultValues.muni_Id)}
                                />
                            )}
                        />

                        <RHFTextField
                            name='dire_DireccionExacta'
                            label='Dirección exacta'
                        />
                    </Stack>
                </DialogContent>

                <Divider />

                <DialogActions>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Enviar a esta dirección
                    </LoadingButton>
                    <Button color="inherit" variant="outlined" onClick={handleClose}>
                        Cancelar
                    </Button>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
}
