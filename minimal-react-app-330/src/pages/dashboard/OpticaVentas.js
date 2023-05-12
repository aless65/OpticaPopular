/* eslint-disable camelcase */
import * as React from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import {
    Container,
    Box,
    Card,
    Grid,
    Stack,
    Switch,
    Typography,
    FormControlLabel,
    FormControl,
    Autocomplete,
    TextField,
    Radio,
    RadioGroup,
    FormLabel,
    styled,
    Button,
    Divider,
    TableRow,
    TableCell,
    TableContainer,
    TableBody,
    Table,
    Stepper,
    Step,
    StepLabel,
    CardHeader,
    CardContent
} from '@mui/material';

import dayjs from 'dayjs';
import { Control } from 'mapbox-gl';
import { FormProvider, RHFTextField } from '../../components/hook-form';
// routes
import { PATH_DASHBOARD, PATH_OPTICA } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { dispatch, useDispatch, useSelector } from '../../redux/store';

// ----------------------------------------------------------------------

const steps = ['Seleccionar cliente y/o ordenes', 'Datos de envío', 'Finalizar venta'];

export default function Ventas() {
    const { themeStretch } = useSettings();

    const navigate = useNavigate();

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Page title="Ventas">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={'Ventas'}
                    links={[
                        { name: 'Inicio', href: PATH_DASHBOARD.root },
                        { name: 'Ventas', href: PATH_OPTICA.citas },
                    ]}
                />

                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep} alternativeLabel  >
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            if (isStepOptional(index)) {
                                labelProps.optional = (
                                    <Typography variant="caption">Opcional</Typography>
                                );
                            }
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleReset}>Reset</Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Atras
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                {isStepOptional(activeStep) && (
                                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                        Omitir
                                    </Button>
                                )}
                                <Button onClick={handleNext} style={{ display: activeStep === 2 ? 'none' : '' }}>
                                    {activeStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
                                </Button>
                            </Box>
                            <Container style={{ display: activeStep === 0 ? '' : 'none' }}>
                                <br />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12}>
                                        <Card sx={{ mb: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" style={{ textAlign: 'center' }}>
                                                    Seleccione un cliente
                                                </Typography>

                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Container>
                            <Container style={{ display: activeStep === 2 ? '' : 'none' }}>
                                <br />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={8}>
                                        <Card sx={{ mb: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" style={{ textAlign: 'center' }}>
                                                    Card
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Card sx={{ mb: 3 }}>
                                            <CardHeader
                                                title="Order Summary"
                                            />
                                            <CardContent>
                                                <Stack spacing={2}>
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                            Sub Total
                                                        </Typography>
                                                        <Typography variant="subtitle2">
                                                            0
                                                        </Typography>
                                                    </Stack>

                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                            Discount
                                                        </Typography>
                                                        <Typography variant="subtitle2">
                                                            0
                                                        </Typography>
                                                    </Stack>

                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                            Shipping
                                                        </Typography>
                                                        <Typography variant="subtitle2"> </Typography>
                                                    </Stack>

                                                    <Divider />

                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography variant="subtitle1">Total</Typography>
                                                        <Box sx={{ textAlign: 'right' }}>
                                                            <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                                                                0
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                                                                (VAT included if applicable)
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Button
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                        >
                                            Check Out
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Container>
                        </>
                    )}
                </Box>
            </Container>
        </Page>
    );
}
