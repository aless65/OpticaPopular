import axios from 'axios';
import * as React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {
    styled,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    TextField,
    Alert,
    IconButton,
    InputAdornment,
    Autocomplete,
    Checkbox,
    FormControlLabel,
    Grid,
    DialogContent,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useDispatch } from '../../../redux/store';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

const today = dayjs();

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function ModalAgregarCita() {

    const [open, setOpen] = React.useState(false);

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const [insertSuccess, setInsertSuccess] = useState(false);

    const [optionsClientes, setOptionsClientes] = useState([]);

    const [optionsConsultorios, setOptionsConsultorios] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const InsertSchema = Yup.object().shape({
        clie_Id: Yup.string().required('El cliente es requerido'),
    });

    const defaultValues = {
        clie_Id: 0,
        cons_Id: 0,
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

    useEffect(() => {
        axios.get('Clientes/Listado')
            .then((response) => {
                const optionsData = response.data.data.map(item => ({
                    label: `${item.clie_Nombres + [' '] + item.clie_Apellidos}`,
                    id: item.clie_Id
                }));

                setOptionsClientes(optionsData);
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        axios.get('Consultorios/ListadoConsultoriosPorIdSucursal/0')
            .then((response) => {
                const optionsData = response.data.data.map(item => ({
                    label: `${item.sucu_Descripcion + [' - '] + item.cons_Nombre + [' - '] + item.empe_Nombres}`,
                    id: item.cons_Id
                }));

                setOptionsConsultorios(optionsData);
            })
            .catch(error => console.error(error));
    }, []);


    const onSubmit = async (data) => {
        console.log(data.clie_Id);

    };

    const submitHandler = handleSubmit(onSubmit);


    useEffect(() => {


    }, [dispatch, insertSuccess]);

    return (
        <div>
            <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleClickOpen}
            >
                Agregar
            </Button>
            <FormProvider methods={methods} onSubmit={submitHandler}>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                    fullWidth maxWidth="md"
                >
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        Insertar cita
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

                        <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
                            <Grid container>
                                <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                    <Autocomplete
                                        name="clie_Id"
                                        options={optionsClientes}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => <TextField {...params} label="Cliente" />}
                                        onChange={(event, value) => {
                                            if (value != null) {
                                                methods.setValue('clie_Id', value.id);
                                            }
                                        }}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        value={optionsClientes.find(option => option.id === defaultValues.clie_Id)}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ pr: 1 }} sm={6}>
                                    <Autocomplete
                                        name="cons_Id"
                                        options={optionsConsultorios}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => <TextField {...params} label="Consultorio" />}
                                        onChange={(event, value) => {
                                            if (value != null) {
                                                methods.setValue('cons_Id', value.id);
                                            }
                                        }}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        value={optionsConsultorios.find(option => option.id === defaultValues.cons_Id)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sx={{ pr: 1 }} sm={12}>
                                    
                                </Grid>
                            </Grid>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <LoadingButton variant="contained" type="submit" >
                            Ingresar
                        </LoadingButton>
                        <Button onClick={handleClose}>Cancelar</Button>
                    </DialogActions>
                </BootstrapDialog>
            </FormProvider>
        </div>
    );
}
