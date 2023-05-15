/* eslint-disable camelcase */
import * as Yup from 'yup';
import dayjs from 'dayjs';
// form
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Grid, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { forEach } from 'lodash';
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
        value: 1,
        title: 'Envío acelerado (L. 200.00)',
        description: 'Envío en 2-4 días hábiles',
    },
];

export default function CheckoutPayment({ onBackStep, direccion, clie_Id, cita_Id, ordenes, stepActive, nextStep }) {
    const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();

    const [PAYMENT_OPTIONS, setPAYMENT_OPTIONS] = useState([]);

    const [shipping, setShipping] = useState('Gratis');

    const [subTotal, setSubTotal] = useState(0);

    const [precioCita, setPrecioCita] = useState(0);

    const [total, setTotal] = useState(0);

    const [allCorrect, setAllCorrect] = useState(false);

    const [factId, setFactId] = useState(0);

    const [envId, setEnvId] = useState(0);

    const [opcionPago, setOpcionPago] = useState(0);

    const [optionDelivery, setOptionDelivery] = useState(0);

    const citaId = cita_Id;

    const handleBackStep = () => {
        onBackStep();
    };

    const PaymentSchema = Yup.object().shape({
        payment: Yup.string().required('El metodo de pago es requerido!'),
    });

    const defaultValues = {
        delivery: 0,
        payment: '',
    };
    
    const handleOptionDelivery = (value) => {
        if (value === 0 && direccion.id > 0) {
            setShipping('Gratis');
        }

        if (value === 1 && direccion.id > 0) {
            setShipping('L. 200.00')
        }
        setOptionDelivery(value);
    }

    useEffect(() => {
        if (stepActive === 1) {
            setPrecioCita(0);

            if (ordenes.length > 0) {
                let subTemp = 0;
                ordenes.forEach(item => {
                    axios.get(`Ordenes/ListadoDetalles?id=${item}`)
                        .then(response => {
                            const data = response.data.data;
                            data.forEach(element => {
                                subTemp += element.deor_Total;
                                setSubTotal(subTemp);
                            });
                        })
                        .catch(ex => {
                            console.log(ex);
                        })
                });
            }

            if (clie_Id !== 0 && cita_Id !== 0) {
                axios.get(`Ordenes/Listado`)
                    .then(response => {
                        if (response.data.code === 200) {
                            const data = response.data.data
                                .filter(item => item.cita_Id === cita_Id)
                                .map(item => ({
                                    orde_Id: item.orde_Id
                                }))

                            if (data.length > 0) {
                                let subTemp = 0;
                                axios.get(`Ordenes/ListadoDetalles?id=${data[0].orde_Id}`)
                                    .then(response => {
                                        const data = response.data.data;
                                        data.forEach(element => {
                                            subTemp += element.deor_Total;
                                            setSubTotal(subTemp);
                                        });
                                    })
                                    .catch(ex => {
                                        console.log(ex);
                                    })
                            } else {
                                axios.get(`Citas/BuscarCitaPorId/${cita_Id}`)
                                    .then(response => {
                                        setPrecioCita(response.data.data.deci_Costo);
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    })
                            }
                        }
                    })
                    .catch(ex => {
                        console.log(ex);
                    })
            }
        }
    }, [stepActive])

    useEffect(() => {
        setSubTotal(0);
    }, [clie_Id])

    const handleOptionPayment = (value) => {
        setOpcionPago(value);
    }

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
            const granTotal = ((subTotal + precioCita) * 1.15) + (shipping === 'L. 200.00' ? 200 : 0);

            axios.post('Facturas/Insert', {
                fact_Id: 0,
                cita_Id: citaId > 0 ? citaId : 0,
                meto_Id: opcionPago,
                empe_Id: JSON.parse(localStorage.getItem('usuario')).empe_Id,
                fact_Total: granTotal.toFixed(2),
                usua_IdCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(response => {
                if (response.data.code === 200) {
                    if(response.data.data.codeStatus > 0){
                        setFactId(response.data.data.codeStatus);
                        setAllCorrect(true);
                    }else{
                        setAllCorrect(false);
                        enqueueSnackbar(`Ocurrio un error al intentar finalizar la venta`, { variant: 'error' });
                    }
                } else {
                    setAllCorrect(false);
                }
            }).catch(error => {
                console.log(error);
            })

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (allCorrect) {
            nextStep();
        } else if (!allCorrect && factId !== 0) {
            enqueueSnackbar(`Ocurrio un error al intentar finalizar la venta`, { variant: 'error' });
        }
    }, [allCorrect])

    useEffect(() => {
        if (!direccion.id > 0) {
            if (clie_Id !== 0 && citaId !== 0 && ordenes.length === 0) {
                axios.get(`Ordenes/Listado`)
                    .then(response => {
                        if (response.data.code === 200) {
                            const data = response.data.data
                                .filter(item => item.cita_Id === citaId)
                                .map(item => ({
                                    orde_Id: item.orde_Id
                                }))

                            if (data.length > 0) {
                                data.forEach(element => {
                                    axios.post('FacturasDetalles/Insert', {
                                        fact_Id: factId,
                                        orde_Id: element.orde_Id,
                                        envi_Id: 0,
                                        usua_IdCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
                                    }, {
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    }).then(response1 => {
                                        if (response1.data.code === 200) {
                                            if (response1.data.data.codeStatus === 1) {
                                                setAllCorrect(true);
                                            } else {
                                                setAllCorrect(false);
                                            }
                                        } else {
                                            setAllCorrect(false);
                                        }
                                    })
                                })
                            } else {
                                axios.post('FacturasDetalles/Insert', {
                                    fact_Id: factId,
                                    orde_Id: 0,
                                    envi_Id: 0,
                                    usua_IdCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
                                }, {
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }).then(response => {
                                    if (response.data.code === 200) {
                                        if (response.data.data.codeStatus === 1) {
                                            setAllCorrect(true);
                                        } else {
                                            setAllCorrect(false);
                                        }
                                    } else {
                                        setAllCorrect(false);
                                    }
                                })
                            }
                        }
                    })
                    .catch(ex => {
                        console.log(ex);
                    })
            }
        }

        if (direccion.id > 0) {
            if (clie_Id !== 0 && cita_Id !== 0 && ordenes.length === 0) {
                const numAleatorio = optionDelivery === 1 ? Math.random() * (4 - 2) + 2 : Math.random() * (7 - 4) + 4;
                const fechaEntrega = dayjs().add(numAleatorio, 'day');

                axios.post('Envios/Insert', {
                    fact_Id: factId,
                    dire_Id: direccion.id,
                    envi_FechaEntrega: fechaEntrega.toISOString(),
                    usua_IdCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then(respuesta => {
                    if (respuesta.data.code === 200) {
                        if (respuesta.data.data.codeStatus > 0) {
                            const envioId = respuesta.data.data.codeStatus;

                            axios.get(`Ordenes/Listado`)
                                .then(response1 => {
                                    if (response1.data.code === 200) {
                                        const data = response1.data.data
                                            .filter(item => item.cita_Id === citaId)
                                            .map(item => ({
                                                orde_Id: item.orde_Id
                                            }))

                                        if (data.length > 0) {
                                            data.forEach(element => {
                                                axios.post('DetallesEnvios/Insert', {}, {
                                                    params: {
                                                        envi_Id: envioId,
                                                        orde_Id: element.orde_Id,
                                                        usua_IdCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
                                                    }
                                                }).then(response2 => {
                                                    if (response2.data.code === 200) {
                                                        if (response2.data.data.codeStatus === 1) {
                                                            setAllCorrect(true);
                                                        } else {
                                                            setAllCorrect(false);
                                                        }
                                                    } else {
                                                        setAllCorrect(false);
                                                    }
                                                })
                                            })

                                            axios.post('FacturasDetalles/Insert', {
                                                fact_Id: factId,
                                                orde_Id: 0,
                                                envi_Id: envioId,
                                                usua_IdCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
                                            }, {
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                            }).then(response => {
                                                if (response.data.code === 200) {
                                                    if (response.data.data.codeStatus === 1) {
                                                        setAllCorrect(true);
                                                    } else {
                                                        setAllCorrect(false);
                                                    }
                                                } else {
                                                    setAllCorrect(false);
                                                }
                                            })
                                        }
                                    }
                                })
                                .catch(ex => {
                                    console.log(ex);
                                })
                        } else {
                            setAllCorrect(false);
                        }
                    } else {
                        setAllCorrect(false);
                    }
                })
            }
        }


        if (ordenes.length > 0 && direccion.id > 0) {
            const numAleatorio = optionDelivery === 1 ? Math.random() * (4 - 2) + 2 : Math.random() * (7 - 4) + 4;
            const fechaEntrega = dayjs().add(numAleatorio, 'day');

            axios.post('Envios/Insert', {
                fact_Id: factId,
                dire_Id: direccion.id,
                envi_FechaEntrega: fechaEntrega.toISOString(),
                usua_IdCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(respuesta => {
                if (respuesta.data.code === 200) {
                    if (respuesta.data.data.codeStatus > 0) {
                        const envioId = respuesta.data.data.codeStatus;

                        ordenes.forEach(element => {
                            axios.post('DetallesEnvios/Insert', {}, {
                                params: {
                                    envi_Id: envioId,
                                    orde_Id: element,
                                    usua_IdCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
                                }
                            }).then(response2 => {
                                if (response2.data.code === 200) {
                                    if (response2.data.data.codeStatus === 1) {
                                        setAllCorrect(true);
                                    } else {
                                        setAllCorrect(false);
                                    }
                                } else {
                                    setAllCorrect(false);
                                }
                            })
                        })

                        axios.post('FacturasDetalles/Insert', {
                            fact_Id: factId,
                            orde_Id: 0,
                            envi_Id: envioId,
                            usua_IdCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }).then(response => {
                            if (response.data.code === 200) {
                                if (response.data.data.codeStatus === 1) {
                                    setAllCorrect(true);
                                } else {
                                    setAllCorrect(false);
                                }
                            } else {
                                setAllCorrect(false);
                            }
                        })
                    } else {
                        setAllCorrect(false);
                    }
                } else {
                    setAllCorrect(false);
                }
            })
        }

        if (ordenes.length > 0 && !direccion.id > 0) {
            ordenes.forEach(element => {
                axios.post('FacturasDetalles/Insert', {
                    fact_Id: factId,
                    orde_Id: element,
                    envi_Id: 0,
                    usua_IdCreacion: JSON.parse(localStorage.getItem('usuario')).usua_Id
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then(response => {
                    if (response.data.code === 200) {
                        if (response.data.data.codeStatus === 1) {
                            setAllCorrect(true);
                        } else {
                            setAllCorrect(false);
                        }
                    } else {
                        setAllCorrect(false);
                    }
                })
            })
        }
    }, [factId])


    useEffect(() => {
        axios
            .get('MetodosPago/Listado')
            .then((response) => {
                if (response.data.code === 200) {
                    const dataTemp = response.data.data.map(item => ({
                        value: item.meto_Id,
                        title: `Paga con ${item.meto_Nombre}`,
                        description: '',
                        icons: item.meto_Id > 1 && item.meto_Id < 4 ? [
                            'https://minimal-assets-api.vercel.app/assets/icons/ic_mastercard.svg',
                            'https://minimal-assets-api.vercel.app/assets/icons/ic_visa.svg',
                        ] : ['https://minimal-assets-api.vercel.app/assets/icons/ic_paypal.svg']
                    }));

                    setPAYMENT_OPTIONS(dataTemp);
                }
            })
    }, [])

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {direccion.id > 0 && (
                        <CheckoutDelivery deliveryOptions={DELIVERY_OPTIONS} optionDelivery={handleOptionDelivery} />
                    )}
                    <CheckoutPaymentMethods paymentOptions={PAYMENT_OPTIONS} optionPayment={handleOptionPayment} />
                </Grid>

                <Grid item xs={12} md={4}>
                    {direccion.id > 0 && (
                        <CheckoutBillingInfo onBackStep={handleBackStep} billing={direccion} />
                    )}
                    <CheckoutSummary
                        precioCita={precioCita}
                        total={total}
                        subtotal={subTotal}
                        isv={(subTotal + precioCita) * 0.15}
                        shipping={direccion.id > 0 ? shipping : 'No aplica'}
                    />
                    <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                        Finalizar venta
                    </LoadingButton>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
