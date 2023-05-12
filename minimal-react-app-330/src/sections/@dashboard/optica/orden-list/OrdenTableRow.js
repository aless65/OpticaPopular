/* eslint-disable camelcase */
import * as React from 'react';
import Moment from 'moment';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import { MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// components
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu, TableNoData } from '../../../../components/table';

// ----------------------------------------------------------------------

export default function OrdenTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onDetallesRow }) {

    OrdenTableRow.propTypes = {
        row: PropTypes.object,
        selected: PropTypes.bool,
        onEditRow: PropTypes.func,
        onSelectRow: PropTypes.func,
        onDeleteRow: PropTypes.func,
        onDetallesRow: PropTypes.func,
    };

    Moment.locale('en');

    const { orde_Id, clie_Id, clie_NombreCompleto, orde_Fecha, orde_FechaEntrega, orde_FechaEntregaReal, sucu_Id, sucu_Descripcion } = row;

    const [openMenu, setOpenMenuActions] = useState(null);

    const [open, setOpen] = React.useState(false);

    const [tableEmpty, setTableEmpty] = useState(false);

    const [detallesOrden, setDetallesOrden] = useState([]);

    useEffect(() => {
        fetch(`http://opticapopular.somee.com/api/Ordenes/ListadoDetalles?id=${orde_Id}`)
            .then(response => response.json())
            .then(data => {
                setDetallesOrden(data.data);
            })
            .catch(error => console.error(error));
    }, [row.orde_Id]);

    const handleOpenMenu = (event) => {
        setOpenMenuActions(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpenMenuActions(null);
    };

    React.useEffect(() => {
        if (row.orde_Id === 0) {
            setTableEmpty(true);
        } else {
            setTableEmpty(false);
        }
    })

    return (
        <>
            <TableRow hover selected={selected}>

                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>

                <TableCell>{(orde_Id)}</TableCell>

                <TableCell>{(clie_NombreCompleto)}</TableCell>

                <TableCell>{(orde_Fecha)}</TableCell>

                <TableCell>{(orde_FechaEntrega)}</TableCell>

                <TableCell>{(sucu_Descripcion)}</TableCell>

                <TableCell align="right" onClick={onSelectRow}>
                    <TableMoreMenu
                        open={openMenu}
                        onOpen={handleOpenMenu}
                        onClose={handleCloseMenu}
                        actions={
                            <>
                                <MenuItem
                                    onClick={() => {
                                        onDeleteRow();
                                        handleCloseMenu();
                                    }}
                                    sx={{ color: 'error.main' }}
                                >
                                    <Iconify icon={'eva:trash-2-outline'} />
                                    Eliminar
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        onEditRow();
                                        handleCloseMenu();
                                    }}
                                >
                                    <Iconify icon={'eva:edit-fill'} />
                                    Editar
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        // onDetailsRow();
                                        handleCloseMenu();
                                    }}
                                    style={{ display: row.orde_FechaEntregaReal !== null ? 'none' : '' }}
                                >
                                    <Iconify icon={'mdi:check-all'} />
                                    Cerrar orden
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        onDetallesRow();
                                        handleCloseMenu();
                                    }}
                                    style={{ display: row.orde_FechaEntregaReal !== null ? 'none' : '' }}
                                >
                                    <Iconify icon={'mdi:add'} />
                                    Editar detalles
                                </MenuItem>
                            </>
                        }
                    />
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
                                        <TableCell>Aros</TableCell>
                                        <TableCell>Graduación (izquierdo)</TableCell>
                                        <TableCell>Graduación (derecho)</TableCell>
                                        <TableCell>Precio</TableCell>
                                        <TableCell>Cantidad</TableCell>
                                        <TableCell>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {detallesOrden.map((detalle) => (
                                        <TableRow key={detalle.deor_Id}>
                                            <TableCell component="th" scope="row">
                                                {detalle.orde_Id === 0 ? '' : detalle.orde_Id}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {detalle.aros_Descripcion}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {detalle.deor_GraduacionLeft}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {detalle.deor_GraduacionRight}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {detalle.deor_Precio}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {detalle.deor_Cantidad}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {detalle.deor_Total}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableNoData isNotFound={tableEmpty} />
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}