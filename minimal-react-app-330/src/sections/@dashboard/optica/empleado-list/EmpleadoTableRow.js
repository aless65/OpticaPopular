/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import { useState } from 'react';
<<<<<<< HEAD
import { sentenceCase } from 'change-case';
=======
// import { sentenceCase } from 'change-case';
>>>>>>> aless
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, MenuItem } from '@mui/material';
// utils
<<<<<<< HEAD
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
=======
// import { fDate } from '../../../../utils/formatTime';
// import { fCurrency } from '../../../../utils/formatNumber';
// components
// import Label from '../../../../components/Label';
// import Image from '../../../../components/Image';
>>>>>>> aless
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
//

// ----------------------------------------------------------------------

EmpleadoTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};



export default function EmpleadoTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {

<<<<<<< HEAD
  const theme = useTheme();
=======
  // const theme = useTheme();
>>>>>>> aless

  const { empe_NombreCompleto, empe_SucursalNombre, empe_Sexo } = row;
  
  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell>{(empe_NombreCompleto)}</TableCell>

      <TableCell>{(empe_Sexo)}</TableCell>

      <TableCell>{(empe_SucursalNombre)}</TableCell>

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