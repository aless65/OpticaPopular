/* eslint-disable camelcase */
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

// eslint-disable-next-line no-use-before-define
OrdenDetallesTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};


export default function OrdenDetallesTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {

  const theme = useTheme();

  const { aros_Descripcion, deor_GraduacionLeft, deor_GraduacionRight, deor_Precio, deor_Cantidad, deor_Total } = row;
  
  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>

      <TableCell>{(aros_Descripcion)}</TableCell>

      <TableCell>{(deor_GraduacionLeft)}</TableCell>

      <TableCell>{(deor_GraduacionRight)}</TableCell>

      <TableCell>{(deor_Precio)}</TableCell>

      <TableCell>{(deor_Cantidad)}</TableCell>

      <TableCell>{(deor_Total)}</TableCell>

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