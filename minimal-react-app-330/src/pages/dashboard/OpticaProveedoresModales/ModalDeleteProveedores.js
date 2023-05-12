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
import { getProveedores, getProveedor } from '../../../redux/slices/proveedor';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';


export default function DeleteClienteDialog({ open, onClose, proveedores, setTableData, proveedorId }) {

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const [deleteSuccess, setDeleteSuccess] = useState(false);


    
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting }, } = useForm();

    const onSubmit = async (data) => {
        try {
            const jsonData = {
                prov_Id: proveedorId,
            };

            fetch("https://localhost:44362/api/Proveedores/Eliminar", {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === "El Proveedor ha sido eliminado") {
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
            dispatch(getProveedores());
            setTableData(proveedores);
            setDeleteSuccess(false);
        }

    }, [deleteSuccess]);

    const submitHandler = onSubmit;

    const handleDialogClose = () => {
        onClose();
        reset();
    };

    return (
        <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} proveedores={proveedores}>
            <Card>
                <Typography variant="h5" sx={{pt: 3, pl: 3}} component="h2">Eliminar proveedor</Typography>
                <CardContent>
                    ¿Está seguro de que desea eliminar este proveedor?
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