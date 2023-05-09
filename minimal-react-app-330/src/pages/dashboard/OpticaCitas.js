import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import {
    Box,
    Card,
    Table,
    Button,
    Switch,
    Tooltip,
    TableBody,
    Container,
    IconButton,
    TableContainer,
    TablePagination,
    FormControlLabel,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCitas } from '../../redux/slices/citas';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
    TableNoData,
    TableSkeleton,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedActions,
} from '../../components/table';
// sections
import { CitasTableRow, TableToolbar } from '../../sections/@dashboard/optica/citas-list';
import ModalAgregarCita from './OpticaCitasModales/ModalInsertarCita';
import ModalEditarCita from './OpticaCitasModales/ModalEditarCita';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: '' },
    { id: 'cita_Id', label: 'Id', align: 'left' },
    { id: 'clie_Nombres', label: 'Nombres cliente', align: 'left' },
    { id: 'clie_Apellidos', label: 'Apellidos cliente', align: 'left' },
    { id: 'cons_Nombre', label: 'Consultorio', align: 'left' },
    { id: 'empe_Nombres', label: 'Nombre empleado', align: 'left' },
    { id: 'cita_Fecha', label: 'Fecha cita', align: 'left' },
    { id: 'sucu_Id', label: 'Id sucursal', align: 'left' },
    { id: '', label: 'Acciones', align: 'left' },
];

// ----------------------------------------------------------------------

export default function OpticaCitas() {
    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable({
        defaultOrderBy: 'cita_Id',
    });

    const { themeStretch } = useSettings();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { citas, isLoading } = useSelector((state) => state.cita);

    const [citaIdEditar, setCitaIdEditar ] = useState('');

    const [tableData, setTableData] = useState([]);

    const [openAddCitaDialog, setOpenAddCitaDialog] = useState(false);

    const [openEditCitaDialog, setOpenEditCitaDialog] = useState(false);

    const [openDeleteDialog, setOpenDeleteDialog]= useState(false);

    const [filterName, setFilterName] = useState('');

    const handleOpenAddCitaDialog = () => {
        setOpenAddCitaDialog(true)
    }

    const handleCloseAddCitaDialog = () => {
        setOpenAddCitaDialog(false);
    }

    const handleOpenEditCitaDialog = () => {
        setOpenEditCitaDialog(true)
    }

    const handleCloseEditCitaDialog = () => {
        setOpenEditCitaDialog(false);
    }

    const handleOpenDeleteCitaDialog = () => {
        setOpenDeleteDialog(true)
    }

    const handleCloseDeleteCitaDialog = () => {
        setOpenDeleteDialog(false);
    }

    useEffect(() => {
        dispatch(getCitas());
    }, [dispatch]);

    useEffect(() => {
        if (citas.length) {
            setTableData(citas);
        }
    }, [citas]);

    const handleFilterName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };

    const handleDeleteRow = (id) => {
        const deleteRow = tableData.filter((row) => row.cita_Id !== id);
        setSelected([]);
        setTableData(deleteRow);
    };

    const handleDeleteRows = (selected) => {
        const deleteRows = tableData.filter((row) => !selected.includes(row.cita_Id));
        setSelected([]);
        setTableData(deleteRows);
    };

    const handleDeleteRow = (Id) => {
        setCitaIdEditar(Id);
        handleOpenEditCitaDialog();
    };

    const dataFiltered = applySortFilter({
        tableData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const denseHeight = dense ? 60 : 80;

    const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

    return (
        <Page title="Citas">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Listado de citas"
                    links={[
                        { name: 'Inicio', href: PATH_DASHBOARD.root },
                        { name: 'Citas' },
                    ]}
                    action={
                        <div>
                            <Button
                                variant="contained"
                                startIcon={<Iconify icon="eva:plus-fill" />}
                                onClick={handleOpenAddCitaDialog}
                            >
                                Agregar
                            </Button>
                            <ModalAgregarCita open={openAddCitaDialog} onClose={handleCloseAddCitaDialog} citas={citas} setTableData={setTableData} />
                            <ModalEditarCita open={openEditCitaDialog} onClose={handleCloseEditCitaDialog} citas={citas} setTableData={setTableData} citaId={citaIdEditar}/>
                        </div>
                    }
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
                                            tableData.map((row) => row.cita_Id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) =>
                                            row ? (
                                                <CitasTableRow
                                                    key={row.cita_Id}
                                                    row={row}
                                                    selected={selected.includes(row.cita_Id)}
                                                    onSelectRow={() => onSelectRow(row.cita_Id)}
                                                    onDeleteRow={() => handleDeleteRow(row.cita_Id)}
                                                    onEditRow={() => handleEditRow(row.cita_Id)}
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

// ----------------------------------------------------------------------

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
            item.cita_Id.toString().indexOf(filterName.toLowerCase()) !== -1 ||
            item.clie_Nombres.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            item.clie_Apellidos.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            item.cons_Nombre.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            item.empe_Nombres.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            item.cita_Fecha.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            item.sucu_Id.toString().indexOf(filterName.toLowerCase()) !== -1
        );
    }

    return tableData;
}
