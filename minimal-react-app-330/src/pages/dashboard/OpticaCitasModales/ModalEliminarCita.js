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
import { getCitas } from '../../../redux/slices/citas';
import { FormProvider } from '../../../components/hook-form';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

export default function ModalEliminarCita({ open, onClose, citas, setTableData, citaId }) {
    
    const dispatch = useDispatch();

    const [deleteSuccess, setDeleteSuccess] = useState(false);
    
    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async () => {
        axios.post('Citas/Eliminar', {}, {
            params:{
                cita_Id: citaId,
                usua_IdModificacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
            }
        })
            .then((response) => {
                if (response.data.code === 200) {
                    if (response.data.data.codeStatus > 0) {
                        enqueueSnackbar('Cita eliminada con éxito', { variant: 'success' });
                        setDeleteSuccess(true);
                    } else {
                        enqueueSnackbar('Ocurrio un error al intentar eliminar la cita', { variant: 'error' });
                    }
                }else{
                    enqueueSnackbar('Ocurrio un error al intentar eliminar la cita', { variant: 'error' });   
                }
                handleDialogClose();
            })
            .catch((error) => {
                enqueueSnackbar(`Ocurrio un error al intentar eliminar la cita`, { variant: 'error' });   
                console.log(error);
            });
    };

    const handleDialogClose = () => {
        onClose();
    };

    useEffect(() => {
        if (deleteSuccess === true) {
          dispatch(getCitas());
    
          setTableData(citas);
    
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
                Eliminar cita
            </DialogTitle>
            <br/>
            <Divider />
            <DialogContent style={{textAlign: "center"}}>
                ¿Está seguro que desea eliminar la cita?
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