/* eslint-disable camelcase */
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

export default function ModalEliminarDireccion({ open, onClose, direccion, clie_Id, handleCargarDirecciones }) {

    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const clienteId = clie_Id;

    const address = direccion;

    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async () => {
        try {
            axios.post('DireccionesPorCliente/Delete', {
                dicl_Id: 0,
                clie_Id: clienteId,
                dire_Id: address.id,
                usua_IdModificacion: JSON.parse(localStorage.getItem('usuario')).usua_Id,
                muni_Id: '',
                dire_DireccionExacta: ''
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(response => {
                if (response.data.code === 200) {
                    if (response.data.data.codeStatus > 0) {
                        enqueueSnackbar(`Direccion eliminada con éxito`, { variant: 'success' });
                        handleCargarDirecciones(true);
                        handleDialogClose();
                    } else {
                        enqueueSnackbar(`Ocurrio un error al intentar eliminar la direccion`, { variant: 'error' });
                    }
                } else {
                    enqueueSnackbar(`Ocurrio un error al intentar eliminar la direccion`, { variant: 'error' });
                }
            })
        } catch (error) {
            console.error(error);
        }
    };

    const handleDialogClose = () => {
        onClose();
    };

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
                Eliminar direccion
            </DialogTitle>
            <br/>
            <Divider />
            <DialogContent style={{textAlign: "center"}}>
                ¿Está seguro que desea eliminar la dirección?
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