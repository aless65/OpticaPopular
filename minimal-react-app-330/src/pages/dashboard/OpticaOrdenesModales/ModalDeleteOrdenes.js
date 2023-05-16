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
import orden, { getOrdenes } from '../../../redux/slices/orden';
import { FormProvider } from '../../../components/hook-form';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

export default function ModalEliminarOrden({ open, onClose, ordenes, setTableData, ordenId }) {
    
    const dispatch = useDispatch();

    const [deleteSuccess, setDeleteSuccess] = useState(false);
    
    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async () => {
        const jsonData = {
            orde_Id: ordenId,
        };

        console.log(jsonData);

        fetch("https://localhost:44362/api/Ordenes/Eliminar", {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === 'Ha ocurrido un error') {
                enqueueSnackbar(data.message, { variant: 'error' });
            } else if(data.message === 'La orden no puede ser eliminada ya que está siendo usada'){
                enqueueSnackbar('La orden no puede ser eliminada porque ya ha sido pagada', { variant: 'warning' });
                handleDialogClose();   
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
          dispatch(getOrdenes());
    
          setTableData(ordenes);
    
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
                Cancelar orden
            </DialogTitle>
            <br/>
            <Divider />
            <DialogContent style={{textAlign: "center"}}>
                ¿Está seguro que desea cancelar la orden?
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