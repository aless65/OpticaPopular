/* eslint-disable camelcase */
import axios from 'axios';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { sentenceCase } from 'change-case';
import dayjs from 'dayjs';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, MenuItem, IconButton, Collapse, Box, Table, TableHead, TableBody } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
//

// ----------------------------------------------------------------------

OrdenesTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onSelectRow: PropTypes.func,
};

export default function OrdenesTableRow({ row, selected, onSelectRow, isCita}) {
    const theme = useTheme();

    const [open, setOpen] = React.useState(false);

    const { orde_Id, orde_Fecha, orde_FechaEntrega } = row;

    const [tableDetalleOrden, setTableDetalleOrden] = useState([]);

    useEffect(() => {
        axios.get(`Ordenes/ListadoDetalles?id=${orde_Id}`)
            .then((response) => {
                if (response.data.code === 200) {
                    if (response.data.data.length > 0) {
                        const data = response.data.data.map(item => ({
                            deor_Id: item.deor_Id,
                            aros_Id: item.aros_Id,
                            aros_Descripcion: item.aros_Descripcion,
                            deor_GraduacionLeft: item.deor_GraduacionLeft,
                            deor_GraduacionRight: item.deor_GraduacionRight,
                            deor_Transition: item.deor_Transition,
                            deor_FiltroLuzAzul: item.deor_FiltroLuzAzul,
                            deor_Precio: item.deor_Precio,
                            deor_Cantidad: item.deor_Cantidad,
                            deor_Total: item.deor_Total,
                        }));
                        setTableDetalleOrden(data);
                    }
                }
            })
            .catch(error => console.error(error));
    }, [orde_Id])

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} style={{display: isCita ? 'none' : ''}} />
                </TableCell>

                <TableCell padding="checkbox">
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>

                <TableCell align='center'>
                    {orde_Id}
                </TableCell>

                <TableCell align='center'>
                    {dayjs(orde_Fecha).format('DD/MM/YYYY')}
                </TableCell>

                <TableCell align='center'>
                    {dayjs(orde_FechaEntrega).format('DD/MM/YYYY')}
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Detalle orden
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Id</TableCell>
                                        <TableCell>Aro</TableCell>
                                        <TableCell>Graduación Izquierda</TableCell>
                                        <TableCell>Graduación Derecha</TableCell>
                                        <TableCell>Transition</TableCell>
                                        <TableCell>Filtro de luz azul</TableCell>
                                        <TableCell>Precio</TableCell>
                                        <TableCell>Cantidad</TableCell>
                                        <TableCell>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableDetalleOrden.map((item) => (
                                        <TableRow key={item.deor_Id}>
                                            <TableCell component="th" scope="row">
                                                {item.deor_Id === 0 ? '' : item.deor_Id}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {item.aros_Descripcion}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {item.deor_GraduacionLeft}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {item.deor_GraduacionRight}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {item.deor_Transition ? 'Si' : 'No'}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {item.deor_FiltroLuzAzul ? 'Si' : 'No'}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {item.deor_Precio === 0 ? '' : item.deor_Precio}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {item.deor_Cantidad === 0 ? '' : item.deor_Cantidad}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {item.deor_Total === 0 ? '' : item.deor_Total}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}
