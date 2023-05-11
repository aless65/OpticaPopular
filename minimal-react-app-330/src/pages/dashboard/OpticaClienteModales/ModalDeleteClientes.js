import * as Yup from 'yup';
import {
    // Box,
    Card,
    // Link,
    Stack,
    // Input,
    Button,
    // Avatar,
    Dialog,
    // Tooltip,
    TextField,
    Typography,
    // CardHeader,
    DialogTitle,
    DialogActions,
    // Slider as MuiSlider,
    Alert,
    IconButton,
    InputAdornment,
    // Autocomplete,
    Checkbox,
    FormControlLabel,
    Grid,
    CardHeader,
    CardContent
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from 'formik';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../../../redux/store';
import { getClientes, getCliente } from '../../../redux/slices/cliente';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';


export default function DeleteEmpleadoDialog({ open, onClose, clientes, setTableData, clienteId }) {

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const [deleteSuccess, setDeleteSuccess] = useState(false);


    
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting }, } = useForm();

    const onSubmit = async (data) => {
        try {
            const jsonData = {
                clie_Id: clienteId,
            };

            fetch("http://opticapopular.somee.com/api/Clientes/Eliminar", {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === "El cliente ha sido eliminado") {
                        setDeleteSuccess(true);
                        enqueueSnackbar(data.message);
                        handleDialogClose();
                    } else {
                        setDeleteSuccess(false);
                        enqueueSnackbar(data.message, { variant: 'error' });
                    }
                })
                .catch((error) => console.error(error));
        } catch (error) {
            console.error(error);
            reset();
            if (isMountedRef.current) {
                setError('afterSubmit', { ...error, message: error.message });
            }
        }
    };

  

    useEffect(() => {

        if (deleteSuccess === true) {
            dispatch(getClientes());
            setTableData(clientes);
            setDeleteSuccess(false);
        }

    }, [deleteSuccess]);

    const submitHandler = onSubmit;

    const handleDialogClose = () => {
        onClose();
        reset();
    };

    return (
        <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} clientes={clientes}>
            <Card>
                <Typography variant="h5" sx={{pt: 3, pl: 3}} component="h2">Eliminar cliente</Typography>
                <CardContent>
                    ¿Está seguro de que desea eliminar este cliente?
                </CardContent>
            </Card>
            <DialogActions>
                <LoadingButton variant="contained" type="submit" loading={isSubmitting} onClick={submitHandler}>
                    Eliminar
                </LoadingButton>
                <Button onClick={handleDialogClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
}