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
import { getOrdenes } from '../../redux/slices/orden';
// routes
import { PATH_DASHBOARD, PATH_OPTICA } from '../../routes/paths';
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
import { OrdenTableRow, TableToolbar } from '../../sections/@dashboard/optica/orden-list';
import DeleteEmpleadoDialog from './OpticaEmpleadosModales/ModalDeleteEmpleados';

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
      item.empe_NombreCompleto.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      item.empe_SucursalNombre.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      item.empe_Sexo.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }


  return tableData;
}

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'orde_Id', label: 'ID', align: 'left' },
  { id: 'clie_NombreCompleto', label: 'Cliente', align: 'left' },
  { id: 'orde_Fecha', label: 'Fecha de Orden', align: 'left' },
  { id: 'orde_FechaEntrega', label: 'Fecha de Entrega', align: 'left' },
  { id: 'sucu_Descripcion', label: 'Sucursal', align: 'left' },
  { id: 'Acciones' },
];

// ----------------------------------------------------------------------

export default function OpticaOrdenes() {
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

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { ordenes, isLoading } = useSelector((state) => state.orden);

  const [tableData, setTableData] = useState([]);

  const [empeId, setEmpeId] = useState('');

  const [openDeleteEmpleadoDialog, setOpenDeleteEmpleadoDialog] = useState(false);

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    dispatch(getOrdenes());
  }, [dispatch]);

  useEffect(() => {
    if (ordenes.length) {
      setTableData(ordenes);
    }
  }, [ordenes]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    setEmpeId(id);
    handleOpenDeleteEmpleadoDialog();
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.orde_Id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_OPTICA.empleadosEdit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleOpenDeleteEmpleadoDialog = () => {
    setOpenDeleteEmpleadoDialog(true);
  }

  const handleCloseDeleteEmpleadoDialog = () => {
    setOpenDeleteEmpleadoDialog(false);
  }

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="Órdenes">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Listado de órdenes"
          links={[
            { name: 'Inicio', href: PATH_DASHBOARD.root },
            { name: 'Órdenes' },
          ]}
          action={
            <div>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                component={RouterLink}
                to={PATH_OPTICA.empleadosNew}
              >
                Agregar
              </Button>
              <DeleteEmpleadoDialog open={openDeleteEmpleadoDialog} onClose={handleCloseDeleteEmpleadoDialog} empleados={ordenes} setTableData={setTableData} empeId={empeId} />

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
                      tableData.map((row) => row.orde_Id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <OrdenTableRow
                          key={row.orde_Id}
                          row={row}
                          selected={selected.includes(row.orde_Id)}
                          onSelectRow={() => onSelectRow(row.orde_Id)}
                          onDeleteRow={() => handleDeleteRow(row.orde_Id)}
                          onEditRow={() => handleEditRow(row.orde_Id)}
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
