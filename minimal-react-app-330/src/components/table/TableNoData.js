// @mui
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
//
import EmptyContent from '../EmptyContent';

// ----------------------------------------------------------------------

export default function TableNoData({ isNotFound }) {
  return (
    <>
      {isNotFound ? (
        <TableRow>
          <TableCell colSpan={9}>
            <EmptyContent
              title="Sin Datos"
              sx={{
                '& span.MuiBox-root': { height: 160 },
              }}
            />
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell colSpan={9} sx={{ p: 0 }} />
        </TableRow>
      )}
    </>
  );
}

TableNoData.propTypes = {
  isNotFound: PropTypes.bool,
};
