/* eslint-disable camelcase */
import axios from 'axios';
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

export default function FacturasTableRow({ row, onDetallesFactura }) {

  Moment.locale('en');

  const { fact_Id, cita_Id, fact_Fecha, meto_Nombre, empe_Nombres, empe_Apellidos, fact_Total } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const [openMenuDetails, setOpenMenuActionsDetails] = useState(null);

  const [open, setOpen] = React.useState(false);

  const [tableEmpty, setTableEmpty] = useState(false);

  const [tableData, setTableData] = useState([]);

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

  useEffect(() => {
    axios.get(`FacturasDetalles/ListByIdFactura/${fact_Id}`)
    .then((response) => {
        if (response.data.code === 200) {
            if (response.data.data.length > 0) {
                const data = response.data.data
                .map(item => ({
                    defa_Id: item.defa_Id, 
                    fact_Id: item.fact_Id, 
                    orde_Id: item.orde_Id, 
                    envi_Id: item.envi_Id, 
                }));
                setTableData(data);
                setTableEmpty(false);   
            }
        }
    })
    .catch(error => console.error(error));
}, [])

  React.useEffect(() => {
    if (tableData.length === 0) {
      setTableEmpty(true);
    } else {
      setTableEmpty(false);
    }
  }, [tableData])


  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>{(row.fact_Id)}</TableCell>

        <TableCell>{(row.cita_Id)}</TableCell>

        <TableCell>{(Moment(row.fact_Fecha).format('DD-MM-YYYY'))}</TableCell>

        <TableCell>{(row.meto_Nombre)}</TableCell>

        <TableCell>{(row.empe_Nombres)}</TableCell>

        <TableCell>{(row.empe_Apellidos)}</TableCell>
        <TableCell>L. {(row.fact_Total.toFixed(2))}</TableCell>

      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalles factura
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Id Orden</TableCell>
                    <TableCell>Id Envio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((item) => (
                    <TableRow>
                         <TableCell component="th" scope="row">
                                      {item?.defa_Id === 0 ? '' : item?.defa_Id}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                      {item?.orde_Id === 0 ? '' : item?.orde_Id}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                      {item?.envi_Id === 0 ? '' : item?.envi_Id}
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

FacturasTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
