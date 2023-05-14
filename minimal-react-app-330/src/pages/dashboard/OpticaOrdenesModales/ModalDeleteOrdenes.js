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
        console.log(ordenId);
        axios.put('Ordenes/Eliminar', {}, {
            params:{
                orde_Id: ordenId,
            }
        })
            .then((response) => {
                console.log(response.data.message);
                if (response.data.message === 'Ha ocurrido un error') {
                    enqueueSnackbar(response.data.message, { variant: 'error' });
                } else if(response.data.message === 'La orden no puede ser eliminada ya que está siendo usada'){
                    enqueueSnackbar('La orden no puede ser eliminada porque ya ha sido pagada', { variant: 'warning' });
                    handleDialogClose();   
                } else{
                    enqueueSnackbar(response.data.message, { variant: 'success' });
                    setDeleteSuccess(true);
                    handleDialogClose();   
                }
            })
            .catch((error) => {
                enqueueSnackbar(`Ocurrio un error al intentar eliminar la orden`, { variant: 'error' });   
                console.log(error);
            });
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
                Eliminar orden
            </DialogTitle>
            <br/>
            <Divider />
            <DialogContent style={{textAlign: "center"}}>
                ¿Está seguro que desea eliminar la orden?
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