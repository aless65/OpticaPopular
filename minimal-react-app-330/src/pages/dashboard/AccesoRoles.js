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
import { getRoles } from '../../redux/slices/rol';
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
import { RolTableRow, TableToolbar } from '../../sections/@dashboard/acceso/rol-list';
import AddRolDialog from './AccesoRolesModales/ModalInsertRoles';
import EditRolDialog from './AccesoRolesModales/ModalEditRoles';
import DeleteRolDialog from './AccesoRolesModales/ModalDeleteRoles';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'role_Id', label: 'ID', align: 'left' },
  { id: 'role_Nombre', label: 'Nombre', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function AccesoRoles() {
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
    defaultOrderBy: 'role_Id',
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { roles, isLoading } = useSelector((state) => state.rol);

  const [openAddRolDialog, setOpenAddRolDialog] = useState(false);

  const [openEditRolDialog, setOpenEditRolDialog] = useState(false);

  const [openDeleteRolDialog, setOpenDeleteRolDialog] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [roleId, setRoleId] = useState('');

  const [roleNombre, setRoleNombre] = useState('');

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  useEffect(() => {
    if (roles.length) {
      setTableData(roles);
    }
  }, [roles]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    setRoleId(id);
    handleOpenDeleteRolDialog();
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.role_Id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id, nombre) => {
    setRoleId(id);
    setRoleNombre(nombre);
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

  return (
    <Page title="Roles">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Listado de roles"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Roles' },
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
              <AddRolDialog open={openAddRolDialog} onClose={handleCloseAddRolDialog} roles={roles} setTableData={setTableData} />
              <EditRolDialog open={openEditRolDialog} onClose={handleCloseEditRolDialog} roles={roles} setTableData={setTableData} roleId={roleId} roleNombre={roleNombre} />
              <DeleteRolDialog open={openDeleteRolDialog} onClose={handleCloseDeleteRolDialog} roles={roles} setTableData={setTableData} roleId={roleId} />
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
                      tableData.map((row) => row.role_Id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <RolTableRow
                          key={row.role_Id}
                          row={row}
                          selected={selected.includes(row.role_Id)}
                          onSelectRow={() => onSelectRow(row.role_Id)}
                          onDeleteRow={() => handleDeleteRow(row.role_Id)}
                          onEditRow={() => handleEditRow(row.role_Id, row.role_Nombre)}
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
      item.role_Id.toString().indexOf(filterName.toLowerCase()) !== -1 ||
      item.role_Nombre.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }


  return tableData;
}