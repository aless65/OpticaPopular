/* eslint-disable camelcase */
import * as React from 'react';
import Moment from 'moment';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { sentenceCase } from 'change-case';
import { useSnackbar } from 'notistack';
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

export default function CitasTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onDetailsRow, onDetallesCita, onDetalle }) {

  Moment.locale('en');

  const { cita_Id, clie_Nombres, clie_Apellidos, cons_Nombre, empe_Nombres, cita_Fecha, sucu_Id, deci_Id, deci_Costo, deci_HoraInicio, deci_HoraFin } = row;
  
  const [openMenu, setOpenMenuActions] = useState(null);

  const [openMenuDetails, setOpenMenuActionsDetails] = useState(null);

  const [open, setOpen] = React.useState(false);

  const [tableEmpty, setTableEmpty] = useState(false);
  
  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleOpenMenuDetails = (event) => {
    setOpenMenuActionsDetails(event.currentTarget);
  };

  const handleCloseMenuDetails = () => {
    setOpenMenuActionsDetails(null);
  };

  React.useEffect(() => {
    if(row.deci_Id === 0){
      setTableEmpty(true);
    }else{
      setTableEmpty(false);
    }
  }, [row.deci_Id])

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

      <TableCell>{(row.cita_Id)}</TableCell>

      <TableCell>{(row.clie_Nombres)}</TableCell>

      <TableCell>{(row.clie_Apellidos)}</TableCell>
      
      <TableCell>{(row.cons_Nombre )}</TableCell>

      <TableCell>{(row.empe_Nombres)}</TableCell>

      <TableCell>{(Moment(row.cita_Fecha).format('DD/MM/YYYY'))}</TableCell>

      <TableCell>{(row.sucu_Id)}</TableCell>
      
      <TableCell onClick={onSelectRow}>
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
                  onDetalle();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'mdi:format-list-bulleted'} />
                Detalles
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDetailsRow();
                  handleCloseMenu();
                }}
                style={{display: row.deci_Id !== 0 ? 'none' : ''}}
              >
                <Iconify icon={'mdi:check-all'} />
                 Completar cita
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
            Detalle cita
          </Typography>
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Costo</TableCell>
                <TableCell>Hora Inicio</TableCell>
                <TableCell>Hora Fin</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            <TableRow key={row.deci_Id}>
                  <TableCell component="th" scope="row">
                    {row.deci_Id === 0 ? '' : row.deci_Id}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.deci_Costo === 0 ? '' : row.deci_Costo}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.deci_HoraInicio}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.deci_HoraFin}
                  </TableCell>
                  <TableCell component="th" scope="row" style={{display: row.deci_Id === 0 ? 'none' : 'inline'}} >
                  <TableMoreMenu
                    open={openMenuDetails}
                    onOpen={handleOpenMenuDetails}
                    onClose={handleCloseMenuDetails}
                    actions={
                  <>
                    <MenuItem
                      onClick={() => {
                        onDetallesCita();
                        handleCloseMenuDetails();
                      }}
                    >
                    <Iconify icon={'eva:edit-fill'} />
                    Editar
                   </MenuItem>
                  </>
                  }
                   />
                  </TableCell>
              </TableRow>
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

CitasTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
