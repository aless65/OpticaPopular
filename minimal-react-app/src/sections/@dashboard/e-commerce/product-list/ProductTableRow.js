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

ProductTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};



export default function ProductTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {

  const theme = useTheme();

  const { usua_NombreUsuario, empe_NombreCompleto, usua_EsAdmin, role_Nombre } = row;
  
  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>{(usua_NombreUsuario)}</TableCell>

      <TableCell>{(empe_NombreCompleto)}</TableCell>

      <TableCell align="center">
        <Checkbox checked={usua_EsAdmin} disabled={!usua_EsAdmin} />
      </TableCell>

      <TableCell align="right">{role_Nombre}</TableCell>

      <TableCell align="right">
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
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}

/*
<TableCell sx={{ display: 'flex', alignItems: 'center' }}>
         <Image disabledEffect alt={usua_NombreUsuario} src={thumbnailUrl} sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }} /> 
        <Typography variant="subtitle2" noWrap>
          {usua_NombreUsuario}
        </Typography>
      </TableCell> 
*/