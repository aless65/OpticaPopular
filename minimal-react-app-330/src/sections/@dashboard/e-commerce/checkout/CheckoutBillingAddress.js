/* eslint-disable camelcase */
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Box, Grid, Card, Button, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { onBackStep, onNextStep, createBilling } from '../../../../redux/slices/product';
// _mock_
import { _addressBooks } from '../../../../_mock';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutNewAddressForm from './CheckoutNewAddressForm';

// ----------------------------------------------------------------------

export default function CheckoutBillingAddress({clie_Id, cita_Id, ordenes, nextStep, direccion}) {
  //
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);

  const { total, subtotal } = checkout;
  //
  const [open, setOpen] = useState(false);

  const[tableData, setTableData] = useState([]);
    
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNextStep = () => {
    nextStep();
  };

  const handleCreateBilling = (value) => {
    direccion(value);
  };

  useEffect(() => {
    axios.get(`DireccionesPorCliente/ListadoByIdCliente?clie_Id=${clie_Id}`)
    .then((response) => {
        if (response.data.code === 200) {
            if (response.data.data.length > 0) {
                const data = response.data.data.map((item, index) => ({
                    id: item.dire_Id,
                    receiver: item.dicl_NombreClientes,
                    fullAddress: `Honduras, ${item.depa_Nombre}, ${item.muni_Nombre}.  ${item.dicl_DireccionExacta}`,
                    phone: item.clie_Telefono,
                    addressType: index === 0 ? 'Casa' : 'Otro',
                    isDefault: index === 0,
                }));
                setTableData(data);
            }
        }
    });
  }, [clie_Id])

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {tableData.map((address, index) => (
            <AddressItem
              key={index}
              address={address}
              onNextStep={handleNextStep}
              onCreateBilling={handleCreateBilling}
            />
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button size="small" onClick={handleClickOpen} startIcon={<Iconify icon={'eva:plus-fill'} />}>
              Agregar nueva direccion
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutSummary subtotal={subtotal} total={total} direccion={direccion} />
        </Grid>
      </Grid>

      <CheckoutNewAddressForm
        open={open}
        onClose={handleClose}
      />
    </>
  );
}

// ----------------------------------------------------------------------

AddressItem.propTypes = {
  address: PropTypes.object,
  onCreateBilling: PropTypes.func,
};

function AddressItem({ address, onCreateBilling, onNextStep }) {

  const { id, receiver, fullAddress, addressType, phone, isDefault } = address;

  const handleCreateBilling = () => {
    onCreateBilling(address);
    onNextStep();
  };

  return (
    <Card sx={{ p: 3, mb: 3, position: 'relative' }}>
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1">{receiver}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({addressType})
        </Typography>
        {isDefault && (
          <Label color="info" sx={{ ml: 1 }}>
            Por defecto
          </Label>
        )}
      </Box>
      <Typography variant="body2" gutterBottom>
        {fullAddress}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {phone}
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          position: { sm: 'absolute' },
          right: { sm: 24 },
          bottom: { sm: 24 },
        }}
      >
        {!isDefault && (
          <Button variant="outlined" size="small" color="inherit">
            Eliminar
          </Button>
        )}
        <Box sx={{ mx: 0.5 }} />
        <Button variant="outlined" size="small" onClick={handleCreateBilling}>
            Enviar a esta dirección
        </Button>
      </Box>
    </Card>
  );
}
