import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  InputAdornment,
} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------


CheckoutSummary.propTypes = {
    total: PropTypes.number,
    subtotal: PropTypes.number,
  };

export default function CheckoutSummary({
  total,
  precioCita,
  subtotal,
  isv,
  shipping,
  direccion,
}) {

  const [subTotalReal, setSubTotalReal] = useState(0);
  const [isvReal, setIsvReal] = useState(0);
  const [totalReal, setTotalReal] = useState(0);

  useEffect(() => {
    setSubTotalReal(subtotal + precioCita);
    setIsvReal(isv);
    setTotalReal(subTotalReal + isvReal + (shipping === 'L. 200.00' ? 200 : 0));
  }, [subtotal, total, precioCita, shipping, subTotalReal])

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Resumen"
      />

      <CardContent>
        <Stack spacing={2}>

            <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Cita
            </Typography>
            <Typography variant="subtitle2">
                L. {(precioCita.toFixed(2))}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sub Total
            </Typography>
            <Typography variant="subtitle2">
               L. {(subTotalReal.toFixed(2))}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ISV(15%)
            </Typography>
            <Typography variant="subtitle2">
                L. {(isvReal.toFixed(2))}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Envío
            </Typography>
            <Typography variant="subtitle2">
                {(shipping)}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Total</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                L. {(totalReal.toFixed(2))}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
