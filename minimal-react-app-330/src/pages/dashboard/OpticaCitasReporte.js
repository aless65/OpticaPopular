import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import { Container, Box, Tooltip, IconButton } from '@mui/material';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _invoices } from '../../_mock';
import Iconify from '../../components/Iconify';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import Invoice from '../../sections/@dashboard/invoice/details';
import CitaPDF from '../../sections/@dashboard/reportes/CitaPDF';

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
    const { themeStretch } = useSettings();

    const { id } = 'INV-17048';

    const invoice = _invoices.find((invoice) => invoice.id === 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1');

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const navigate = useNavigate();


    // ----------------------------------------------------------------------

    useEffect(() => {
        fetch(`https://localhost:44362/api/Pantallas/PantallasAccesos?role_Id=${JSON.parse(localStorage.getItem('usuario')).role_Id}&esAdmin=${JSON.parse(localStorage.getItem('usuario')).usua_EsAdmin}&pant_Nombre=reporte citas`)
            .then(response => response.json())
            .then(data => {
                if (data === 0) {
                    navigate(PATH_DASHBOARD.general.app);
                } else {
                    setIsLoadingPage(false);
                }
            })
            .catch(error => console.error(error));

    }, [])

    if (isLoadingPage) {
        return null;
    }

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', height: '180vh', pb: 0 }}>
            <Box sx={{ flexGrow: 2, overflow: 'hidden' }}>
                <Page title="Citas: Reporte">
                    <HeaderBreadcrumbs
                        heading="Reporte de citas"
                        links={[
                            { name: 'Inicio', href: PATH_DASHBOARD.root },
                            { name: 'Reporte' },
                        ]}
                    />
                </Page>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'hidden', height: '100%' }}>
                <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                    <CitaPDF invoice={invoice} />
                </PDFViewer>
            </Box>
        </Container>
    );
}
