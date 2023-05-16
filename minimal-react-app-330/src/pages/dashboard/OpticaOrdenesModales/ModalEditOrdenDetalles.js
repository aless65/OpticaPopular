import PropTypes from 'prop-types';
import axios from 'axios';
import * as React from 'react';
import * as Yup from 'yup';
import {
    Box,
    Stack,
    Button,
    Dialog,
    TextField,
    DialogTitle,
    DialogActions,
    Alert,
    Autocomplete,
    Grid,
    DialogContent,
    Divider,
    IconButton,
    Typography,
    styled,
    TableCell,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { LoadingButton, DatePicker } from '@mui/lab';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../../../redux/store';
import { getOrdenesDetalles } from '../../../redux/slices/ordendetalles';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

// ----------------------------------------------------------------------
const IncrementerStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(0.5, 0.75),
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${theme.palette.grey[500_32]}`,
}));


export default function ModalEditarOrdenDetalle({ open, onClose, ordendetalles, setTableData, ordendetalle, ordeId, optionsAros }) {

    const dispatch = useDispatch();

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const [quantity, setQuantity] = useState(parseInt(ordendetalle?.deor_Cantidad, 10) || '');

    const [available, setAvailable] = useState('');

    const [insertSuccess, setInsertSuccess] = useState(false);

    const [arosTemporal, setArosTemporal] = useState('');

    const [gradLeftTemporal, setGradLeftTemporal] = useState('');

    const [gradRightTemporal, setGradRightTemporal] = useState('');

    const [esLuzAzulTemporal, setEsLuzAzulTemporal] = useState(false);
    
    const [esTransitionTemporal, setEsTransitionTemporal] = useState(false);
    
    // const [canInsert, setCanInsert] = useState(true);

    const onIncreaseQuantity = () => {
        setQuantity(quantity => quantity + 1);
        setAvailable(available => available - 1);
    };

    const onDecreaseQuantity = () => {
        if (quantity > 0) {
            setQuantity(quantity => quantity - 1);
            setAvailable(available => available + 1);
        }
    }

    const defaultValues = {
        aros: ordendetalle?.aros_Id || '',
        graduacionLeft: ordendetalle?.deor_GraduacionLeft || '',
        graduacionRight: ordendetalle?.deor_GraduacionRight || '',
        esTransition: ordendetalle?.deor_Transition || false,
        esLuzAzul: ordendetalle?.deor_FiltroLuzAzul || false,
        cantidad: ordendetalle?.deor_Cantidad || '',
        sucursal: ordendetalle?.sucursal || '',
        precio: '',
    };

    const InsertSchema = Yup.object().shape({
        aros: Yup.string().required('Aros requeridos'),
    });

    useEffect(() => {
        if (ordendetalle) {
            setArosTemporal(ordendetalle.aros_Id);
            setQuantity(ordendetalle.deor_Cantidad);
            try {
                const aroSeleccionado = optionsAros.find((aros) => aros.id === ordendetalle.aros_Id);
                defaultValues.precio = aroSeleccionado.precio;
                methods.setValue('precio', aroSeleccionado.precio);
            } catch {
                methods.setValue('precio', '');
            }
            console.log(ordendetalle.deor_GraduacionLeft);
            setGradLeftTemporal(ordendetalle.deor_GraduacionLeft || '');
            setGradRightTemporal(ordendetalle.deor_GraduacionRight || '');
            setEsLuzAzulTemporal(ordendetalle.deor_FiltroLuzAzul);
            setEsTransitionTemporal(ordendetalle.deor_Transition);
        }
    }, [ordendetalle]);

    const methods = useForm({
        resolver: yupResolver(InsertSchema),
        defaultValues,
    });

    useEffect(() => {
        methods.setValue('aros', arosTemporal);
        methods.setValue('graduacionLeft', gradLeftTemporal);
        methods.setValue('graduacionRight', gradRightTemporal);
        methods.setValue('esTransition', esTransitionTemporal);
        methods.setValue('esLuzAzul', esLuzAzulTemporal);
        methods.setValue('cantidad', defaultValues.cantidad);
    }, [defaultValues]);

    const {
        reset,
        setError,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = methods;

    useEffect(() => {
        if (defaultValues.aros) {
            fetch(`https://localhost:44362/api/Aros/StockAros?aros_Id=${defaultValues.aros}&sucu_Id=${defaultValues.sucursal}`)
                .then(response => response.json())
                .then(data => {
                    // console.log(defaultValues.aros);
                    setAvailable(data.data.messageStatus);
                    // methods.setValue('precio', data.data.messageStatus);
                })
                .catch(error => console.error(error));
        }
    }, [defaultValues.aros])


    const onSubmit = async (data) => {
        const jsonData = {
            deor_Id: ordendetalle.deor_Id,
            aros_Id: data.aros,
            deor_GraduacionLeft: data.graduacionLeft,
            deor_GraduacionRight: data.graduacionRight,
            deor_Transition: data.esTransition,
            deor_FiltroLuzAzul: data.esLuzAzul,
            deor_Cantidad: quantity,
            usua_IdModificacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
        };

        console.log(jsonData);

        fetch("https://localhost:44362/api/Ordenes/EditarDetalles", {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === 'El detalle ha sido editado con éxito') {
                    setInsertSuccess(true);
                    enqueueSnackbar('El detalle ha sido editado', { variant: 'success' });
                } else {
                    enqueueSnackbar('Ha ocurrido un error', { variant: 'error' });
                    setInsertSuccess(false);
                }

                handleDialogClose();
            })
            .catch((error) => console.error(error));
    };

    const submitHandler = handleSubmit(onSubmit);

    const handleDialogClose = () => {
        reset();
        onClose();
    };

    useEffect(() => {
        if (insertSuccess === true) {
            dispatch(getOrdenesDetalles(ordeId));

            setTableData(ordendetalles);

            setInsertSuccess(false);
        }

    }, [insertSuccess]);

    const handleGraduacionLeftChange = (event) => {
        setGradLeftTemporal(event.target.value);
        methods.setValue('graduacionLeft', event.target.value);
        defaultValues.graduacionLeft = event.target.value;
    };

    const handleGraduacionRightChange = (event) => {
        setGradRightTemporal(event.target.value);
        methods.setValue('graduacionRight', event.target.value);
        defaultValues.graduacionRight = event.target.value;
    };

    const handleEsTransitionChange = (event) => {
        defaultValues.esTransition = event.target.checked;
        methods.setValue('esTransition', event.target.checked);
        setEsTransitionTemporal(event.target.checked);
    };

    const handleEsLuzAzulChange = (event) => {
        defaultValues.esLuzAzul = event.target.checked;
        methods.setValue('esLuzAzul', event.target.checked);
        setEsLuzAzulTemporal(event.target.checked);
    };

    return (
        <div>
            <FormProvider methods={methods}>
                <Dialog
                    open={open}
                    fullWidth
                    maxWidth="sm"
                    onClose={handleDialogClose}
                    aria-labelledby="alert-dialog-title"
                >
                    <DialogTitle component="h2" id="alert-dialog-title">
                        Editar orden
                    </DialogTitle>
                    <br />
                    <Divider />
                    {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
                    <DialogContent >
                        <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
                            <Grid container>
                                <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                    <Autocomplete
                                        name="aros"
                                        options={optionsAros}
                                        error={errors.aros?.message !== undefined}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Aros"
                                                error={errors.aros?.message !== undefined}
                                                helperText={errors.aros?.message}
                                            />)}
                                        onChange={(event, value) => {
                                            if (value != null) {
                                                methods.setValue('aros', value.id);
                                                defaultValues.aros = value.id;
                                                setArosTemporal(value.id);
                                                methods.setValue('precio', value.precio);
                                                defaultValues.precio = value.precio;
                                            } else {
                                                methods.setValue('aros', '');
                                                defaultValues.aros = '';
                                                setArosTemporal('');
                                                methods.setValue('precio', 0.00);
                                                defaultValues.precio = 0.00;

                                            }
                                        }}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        value={optionsAros.find(option => option.id === arosTemporal) ?? null}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                    <RHFTextField name="precio" disabled label="Precio" />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                    <RHFTextField name="graduacionLeft" value={gradLeftTemporal} onChange={handleGraduacionLeftChange} label="Graduación izquierdo" />
                                </Grid>
                                <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                    <RHFTextField name="graduacionRight" value={gradRightTemporal} onChange={handleGraduacionRightChange} label="Graduación derecho" />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={esTransitionTemporal}
                                                onChange={handleEsTransitionChange}
                                            />
                                        }
                                        label="Transition"
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={esLuzAzulTemporal}
                                                onChange={handleEsLuzAzulChange}
                                            />
                                        }
                                        label="Filtro luz azul"
                                    />                                
                                </Grid>
                                    <TableCell align="center">
                                        <Incrementer
                                            quantity={quantity}
                                            available={available}
                                            onDecrease={() => onDecreaseQuantity()}
                                            onIncrease={() => onIncreaseQuantity()}
                                        />
                                    </TableCell>
                            </Grid>
                        </Stack>
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <LoadingButton variant="contained" type="submit" loading={isSubmitting} onClick={submitHandler}>
                            Editar
                        </LoadingButton>
                        <Button onClick={handleDialogClose}>Cancelar</Button>
                    </DialogActions>
                </Dialog>
            </FormProvider>
        </div>
    );
}

// ----------------------------------------------------------------------
// eslint-disable-next-line no-use-before-define
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
                Stock: {available}
            </Typography>
        </Box>
    );
}