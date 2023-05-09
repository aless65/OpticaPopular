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
    DialogContent
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

    const isMountedRef = useIsMountedRef();

    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async () => {
       
        axios.post('Citas/Insert', {
            cita_Id: citaId,
            usua_IdModificacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.data.code === 200) {
                    if (response.data.data.codeStatus > 0) {
                        enqueueSnackbar('Cita agregada con éxito', { variant: 'success' });
                    } else {
                        enqueueSnackbar('Ocurrio un error al intentar agregar la cita', { variant: 'error' });
                    }
                }else{
                    enqueueSnackbar('Ocurrio un error al intentar agregar la cita', { variant: 'error' });   
                }
                handleDialogClose();
            })
            .catch((error) => {
                enqueueSnackbar(`Ocurrio un error al intentar agregar la cita`, { variant: 'error' });   
                console.log(error);
            });
    };

    const handleDialogClose = () => {
        onClose();
        reset();
    };

    return (
        <div>
            <Dialog open={open} fullWidth maxWidth="sm" onClose={handleDialogClose}>
            <DialogTitle>
                <Typography variant="h5" sx={{pt: 3, pl: 3}} component="h2">Eliminar cita</Typography>
            </DialogTitle>
            <Stack spacing={3} sx={{ p: 3, pb: 0, pl: 5, pr: 5 }}>
                <DialogContent>
                ¿Está seguro de que desea eliminar la cita?
                </DialogContent>
            </Stack>
            <DialogActions>
                <LoadingButton variant="contained" type="submit" loading={isSubmitting} onClick={onSubmit}>
                    Eliminar
                </LoadingButton>
                <Button onClick={handleDialogClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}