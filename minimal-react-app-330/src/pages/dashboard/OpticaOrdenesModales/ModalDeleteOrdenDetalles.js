import axios from 'axios';
import * as React from 'react';
import * as Yup from 'yup';
import {
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
    DialogContentText,
    Typography,
    Divider
} from '@mui/material';
import { LoadingButton, DatePicker } from '@mui/lab';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useDispatch } from '../../../redux/store';
import ordendetalles, { getOrdenesDetalles } from '../../../redux/slices/ordendetalles';
import { FormProvider } from '../../../components/hook-form';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

export default function ModalEliminarOrdenDetalles({ open, onClose, ordendetalles, setTableData, deorId, ordeId }) {
    
    const dispatch = useDispatch();

    const [deleteSuccess, setDeleteSuccess] = useState(false);
    
    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async () => {

        fetch(`http://opticapopular.somee.com/api/Ordenes/EliminarDetalles?id=${deorId}`, {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === 'Ha ocurrido un error') {
                enqueueSnackbar(data.message, { variant: 'error' });
            } else{
                enqueueSnackbar(data.message, { variant: 'success' });
                setDeleteSuccess(true);
                handleDialogClose();   
            }
        })
        .catch((error) => console.error(error));
    };

    const handleDialogClose = () => {
        onClose();
    };

    useEffect(() => {
        if (deleteSuccess === true) {
          dispatch(getOrdenesDetalles(ordeId));
    
          setTableData(ordendetalles);
    
          setDeleteSuccess(false);
        }
    }, [deleteSuccess]);

    return (
        <div>
        <Dialog 
            open={open} 
            fullWidth 
            maxWidth="sm" 
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
        >
            <DialogTitle component="h2" id="alert-dialog-title">
                Eliminar detalle
            </DialogTitle>
            <br/>
            <Divider />
            <DialogContent style={{textAlign: "center"}}>
                ¿Está seguro que desea eliminar el detalle?
            </DialogContent>
            <Divider />
            <DialogActions>
                <LoadingButton variant="contained" type="submit" onClick={onSubmit}>
                    Eliminar
                </LoadingButton>
                <Button onClick={handleDialogClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}