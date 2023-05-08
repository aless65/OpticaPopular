/* eslint-disable camelcase */
import Moment from 'moment';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, MenuItem } from '@mui/material';
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

CitasTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};


export default function CitasTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  Moment.locale('en');
  const theme = useTheme();

  const { cita_Id, clie_Nombres, clie_Apellidos, cons_Nombre, empe_Nombres, cita_Fecha } = row;
  
  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
     
      <TableCell>{(cita_Id)}</TableCell>

      <TableCell>{(clie_Nombres)}</TableCell>

      <TableCell>{(clie_Apellidos)}</TableCell>
      
      <TableCell>{(cons_Nombre )}</TableCell>

      <TableCell>{(empe_Nombres)}</TableCell>

      <TableCell>{(Moment(cita_Fecha).format('DD-MM-YYYY'))}</TableCell>
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
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}