/* eslint-disable camelcase */
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
    TablePagination
} from '@mui/material';

// sections

import dayjs from 'dayjs';
import { Control } from 'mapbox-gl';
import axios from 'axios';

import { dispatch, useDispatch, useSelector } from '../../redux/store';
import TableToolbar from '../../sections/@dashboard/TableToolbar';
import Scrollbar from '../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSkeleton } from '../../components/table';
import { FacturasTableRow } from '../../sections/@dashboard/optica/facturas-list';

import { FormProvider, RHFTextField } from '../../components/hook-form';
// routes
import { PATH_DASHBOARD, PATH_OPTICA } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useTable, { emptyRows, getComparator } from '../../hooks/useTable';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
    { id: '' },
    { id: 'fact_Id', label: 'Id', align: 'left' },
    { id: 'cita_Id', label: 'Id Cita', align: 'left' },
    { id: 'fact_Fecha', label: 'Fecha factura', align: 'left' },
    { id: 'meto_Nombre', label: 'Metodo de pago', align: 'left' },
    { id: 'empe_Nombres', label: 'Nombre empleado', align: 'left' },
    { id: 'empe_Apellidos', label: 'Apellido empleado', align: 'left' },
    { id: 'fact_Total', label: 'Total Factura', align: 'left' },
];

export default function Facturas() {
    const { themeStretch } = useSettings();

    const navigate = useNavigate();

    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable({
        defaultOrderBy: 'orde_Id',
    });

    const [tableData, setTableData] = useState([]);

    const [isLoading, setisloading] = useState(true);

    const [filterName, setFilterName] = useState('');

    const handleFilterName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };

    const dataFiltered = applySortFilter({
        tableData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const denseHeight = dense ? 60 : 80;

    const isNotFound = (!dataFiltered.length);

    useEffect(() => {
        axios.get(`Facturas/List`)
        .then((response) => {
            if (response.data.code === 200) {
                if (response.data.data.length > 0) {
                    const data = response.data.data
                    .map(item => ({
                        fact_Id: item.fact_Id, 
                        cita_Id: item.cita_Id, 
                        fact_Fecha: item.fact_Fecha, 
                        meto_Nombre: item.meto_Nombre, 
                        empe_Nombres: item.empe_Nombres, 
                        empe_Apellidos: item.empe_Apellidos, 
                        fact_Total: item.fact_Total
                    }));
                    setTableData(data);
                    setisloading(false);
                }
            }
        })
        .catch(error => console.error(error));
    }, [])
    return (
        <Page title="Facturas">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={'Listado de facturas'}
                    links={[
                        { name: 'Inicio', href: PATH_DASHBOARD.root },
                        { name: 'Facturas', href: PATH_OPTICA.facturas },
                    ]}
                />
                <Card>
                    <TableToolbar filterName={filterName} onFilterName={handleFilterName} />
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                        
                            <Table size={dense ? 'small' : 'medium'}>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={tableData.length}
                                    numSelected={selected.length}
                                    onSort={onSort}
                                    onSelectAllRows={(checked) =>
                                        onSelectAllRows(
                                            checked,
                                            tableData.map((row) => row.orde_Id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) =>
                                            row ? (
                                                <FacturasTableRow
                                                    key={row.fact_Id}
                                                    row={row}
                                                />
                                            ) : (
                                                !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                                            )
                                        )}

                                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                                    <TableNoData isNotFound={isNotFound} />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>
                    <Box sx={{ position: 'relative' }}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={dataFiltered.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onChangePage}
                            onRowsPerPageChange={onChangeRowsPerPage}
                        />
                        <FormControlLabel
                            control={<Switch checked={dense} onChange={onChangeDense} />}
                            label="Denso"
                            sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
                        />
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

function applySortFilter({ tableData, comparator, filterName }) {
    const stabilizedThis = tableData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    tableData = stabilizedThis.map((el) => el[0]);

    if (filterName) {
        tableData = tableData.filter((item) =>
            item.orde_Id.toString().indexOf(filterName.toLowerCase()) !== -1 ||
            item.orde_Fecha.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            item.orde_FechaEntrega.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        );
    }
    return tableData;
}
