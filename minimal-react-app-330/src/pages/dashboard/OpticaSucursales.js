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
import { getSucursales } from '../../redux/slices/sucursal';
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
import { SucursalTableRow, TableToolbar } from '../../sections/@dashboard/optica/sucursal-list';
import AddRolDialog from './AccesoRolesModales/ModalInsertRoles';
import EditRolDialog from './AccesoRolesModales/ModalEditRoles';
import DeleteRolDialog from './AccesoRolesModales/ModalDeleteRoles';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sucu_Id', label: 'ID', align: 'left' },
  { id: 'sucu_Descripcion', label: 'Nombre', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function OpticaSucursales() {
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
    defaultOrderBy: 'sucu_Id',
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { sucursales, isLoading } = useSelector((state) => state.sucursal);

  const [openAddRolDialog, setOpenAddRolDialog] = useState(false);

  const [openEditRolDialog, setOpenEditRolDialog] = useState(false);

  const [openDeleteRolDialog, setOpenDeleteRolDialog] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [sucursalId, setsucursalId] = useState('');

  const [sucursalNombre, setsucursalNombre] = useState('');

  const [isLoadingPage, setIsLoadingPage] = useState(true);

  // ----------------------------------------------------------------------

  useEffect(() => {
    fetch(`http://opticapopular.somee.com/api/Pantallas/PantallasAccesos?role_Id=${JSON.parse(localStorage.getItem('usuario')).role_Id}&esAdmin=${JSON.parse(localStorage.getItem('usuario')).usua_EsAdmin}&pant_Nombre=sucursales`)
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

  useEffect(() => {
    dispatch(getSucursales());
  }, [dispatch]);

  useEffect(() => {
    if (sucursales.length) {
      setTableData(sucursales);
    }
  }, [sucursales]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    setsucursalId(id);
    handleOpenDeleteRolDialog();
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.sucu_Id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id, nombre) => {
    setsucursalId(id);
    setsucursalNombre(nombre);
    handleOpenEditRolDialog();
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleOpenAddRolDialog = () => {
    setOpenAddRolDialog(true)
  }

  const handleCloseAddRolDialog = () => {
    setOpenAddRolDialog(false);
  }

  const handleOpenEditRolDialog = () => {
    setOpenEditRolDialog(true)
  }

  const handleCloseEditRolDialog = () => {
    setOpenEditRolDialog(false);
  }

  const handleOpenDeleteRolDialog = () => {
    setOpenDeleteRolDialog(true)
  }

  const handleCloseDeleteRolDialog = () => {
    setOpenDeleteRolDialog(false);
  }

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  if(isLoadingPage){
    return null;
  }

  return (
    <Page title="Sucursales">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Listado de sucursales"
          links={[
            { name: 'Inicio', href: PATH_DASHBOARD.root },
            { name: 'Sucursales' },
          ]}
          action={
            <div>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleOpenAddRolDialog}
              >
                Agregar
              </Button>
              <AddRolDialog open={openAddRolDialog} onClose={handleCloseAddRolDialog} sucursales={sucursales} setTableData={setTableData} />
              <EditRolDialog open={openEditRolDialog} onClose={handleCloseEditRolDialog} sucursales={sucursales} setTableData={setTableData} sucursalId={sucursalId} sucursalNombre={sucursalNombre} />
              <DeleteRolDialog open={openDeleteRolDialog} onClose={handleCloseDeleteRolDialog} sucursales={sucursales} setTableData={setTableData} roleId={sucursalId} />
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
                      tableData.map((row) => row.sucu_Id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <SucursalTableRow
                          key={row.sucu_Id}
                          row={row}
                          selected={selected.includes(row.sucu_Id)}
                          onSelectRow={() => onSelectRow(row.sucu_Id)}
                          onDeleteRow={() => handleDeleteRow(row.sucu_Id)}
                          onEditRow={() => handleEditRow(row.sucu_Id, row.sucu_Descripcion)}
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
      item.sucu_Id.toString().indexOf(filterName.toLowerCase()) !== -1 ||
      item.sucu_Descripcion.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }


  return tableData;
}