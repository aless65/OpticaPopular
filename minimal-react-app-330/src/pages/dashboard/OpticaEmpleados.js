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
import { getEmpleados } from '../../redux/slices/empleado';
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
import { EmpleadoTableRow, TableToolbar } from '../../sections/@dashboard/optica/empleado-list';
import DeleteEmpleadoDialog from './OpticaEmpleadosModales/ModalDeleteEmpleados';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'empe_NombreCompleto', label: 'Nombre', align: 'left' },
  { id: 'empe_Sexo', label: 'Sexo', align: 'left' },
  { id: 'empe_SucursalNombre', label: 'Sucursal', align: 'left' },
  { id: '', label: 'Acciones', align: 'left' },
];

// ----------------------------------------------------------------------

export default function OpticaEmpleados() {
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
    defaultOrderBy: 'empe_NombreCompleto',
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { empleados, isLoading } = useSelector((state) => state.empleado);

  const [tableData, setTableData] = useState([]);

  const [empeId, setEmpeId] = useState('');

  const [openDeleteEmpleadoDialog, setOpenDeleteEmpleadoDialog] = useState(false);

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    dispatch(getEmpleados());
  }, [dispatch]);

  useEffect(() => {
    if (empleados.length) {
      setTableData(empleados);
    }
  }, [empleados]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    setEmpeId(id);
    handleOpenDeleteEmpleadoDialog();
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.empe_Id));
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
    <Page title="Empleados">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Listado de empleados"
          links={[
            { name: 'Inicio', href: PATH_DASHBOARD.root },
            { name: 'Empleados' },
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
              <DeleteEmpleadoDialog open={openDeleteEmpleadoDialog} onClose={handleCloseDeleteEmpleadoDialog} empleados={empleados} setTableData={setTableData} empeId={empeId} />

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
                      tableData.map((row) => row.empe_Id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <EmpleadoTableRow
                          key={row.empe_Id}
                          row={row}
                          selected={selected.includes(row.empe_Id)}
                          onSelectRow={() => onSelectRow(row.empe_Id)}
                          onDeleteRow={() => handleDeleteRow(row.empe_Id)}
                          onEditRow={() => handleEditRow(row.empe_Id)}
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

  // if (filterName) {
  //   tableData = tableData.filter((item) => 
  //     Object.values(item).some(
  //       (value) => 
  //         value && value.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1
  //     )
  //   );
  // }

  if (filterName) {
    tableData = tableData.filter((item) =>
      item.empe_NombreCompleto.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      item.empe_SucursalNombre.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      item.empe_Sexo.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }


  return tableData;
}
