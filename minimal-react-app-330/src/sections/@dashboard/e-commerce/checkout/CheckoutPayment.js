import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Grid, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { onGotoStep, onBackStep, onNextStep, applyShipping } from '../../../../redux/slices/product';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider } from '../../../../components/hook-form';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutDelivery from './CheckoutDelivery';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    value: 0,
    title: 'Envío estándar (Gratuito)',
    description: 'Envío en 4-7 días hábiles',
  },
  {
    value: 2,
    title: 'Envío acelerado (L. 200.00)',
    description: 'Envío en 3-5 días hábiles',
  },
];

const PAYMENT_OPTIONS = [
  {
    value: 'credit_card',
    title: 'Pago con tarjeta de crédito',
    description: 'Aceptamos tarjetas Visa y Mastercard.',
    icons: [
        'https://minimal-assets-api.vercel.app/assets/icons/ic_mastercard.svg',
        'https://minimal-assets-api.vercel.app/assets/icons/ic_visa.svg',
      ],
  },
  {
    value: 'debit_card',
    title: 'Pago con tarjeta de débito',
    description: 'Aceptamos tarjetas Visa y Mastercard.',
    icons: [
      'https://minimal-assets-api.vercel.app/assets/icons/ic_mastercard.svg',
      'https://minimal-assets-api.vercel.app/assets/icons/ic_visa.svg',
    ],
  },
  {
    value: 'cash',
    title: 'Pago con efectivo',
    description: 'Paga el total de la venta con efectivo',
    icons: [
        
    ],
  },
];

export default function CheckoutPayment({onBackStep, direccion}) {
  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);

  const { total, subtotal, shipping } = checkout;

  const handleBackStep = () => {
    onBackStep();
  };

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('El metodo de pago es requerido!'),
  });

  const defaultValues = {
    delivery: shipping,
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
        console.log('Hola');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
            {direccion.id > 0 && (
                <CheckoutDelivery deliveryOptions={DELIVERY_OPTIONS} />
            )}
          <CheckoutPaymentMethods paymentOptions={PAYMENT_OPTIONS} />
        </Grid>

        <Grid item xs={12} md={4}>
          {direccion.id > 0 && (
                <CheckoutBillingInfo onBackStep={handleBackStep} billing={direccion} />
            )}
          <CheckoutSummary
            total={total}
            subtotal={subtotal}
            shipping={shipping}
          />
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Finalizar venta
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
