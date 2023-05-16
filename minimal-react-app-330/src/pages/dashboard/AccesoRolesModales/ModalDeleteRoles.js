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
    CardContent,
    Divider,
    DialogContent
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from 'formik';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../../../redux/store';
import { getRoles, getRol } from '../../../redux/slices/rol';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';


export default function DeleteRolDialog({ open, onClose, roles, setTableData, roleId }) {

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const dispatch = useDispatch();
    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting }, } = useForm();

    const onSubmit = async (data) => {
        try {
            const jsonData = {
                role_Id: roleId,
            };

            fetch("https://localhost:44362/api/Roles/Eliminar", {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === "El rol ha sido eliminado") {
                        setDeleteSuccess(true);
                        enqueueSnackbar(data.message);
                        handleDialogClose();
                    } else if((data.message === "El rol no puede ser eliminado ya que está siendo usado")){
                        setDeleteSuccess(true);
                        enqueueSnackbar(`${data.message} en otro registro`, { variant: 'warning'});
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
            dispatch(getRoles());
            setTableData(roles);
            setDeleteSuccess(false);
        }

    }, [deleteSuccess]);

    const submitHandler = onSubmit;

    const handleDialogClose = () => {
        onClose();
        reset();
    };

    return (
        <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose} roles={roles}>
            <DialogTitle variant="h5">
                Eliminar rol
            </DialogTitle>
            <br/>                
            <Divider/>
            <DialogContent>
                ¿Está seguro de que desea eliminar este rol?
            </DialogContent>
            <Divider/>
            <DialogActions>
                <LoadingButton variant="contained" type="submit" loading={isSubmitting} onClick={submitHandler}>
                    Eliminar
                </LoadingButton>
                <Button onClick={handleDialogClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
}