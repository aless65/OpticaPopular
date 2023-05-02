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
import { getUsuarios } from '../../redux/slices/usuario';
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
import { UsuarioTableRow, TableToolbar } from '../../sections/@dashboard/acceso/usuario-list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'usua_NombreUsuario', label: 'Usuario', align: 'left' },
  { id: 'empe_NombreCompleto', label: 'Empleado', align: 'left' },
  { id: 'usua_EsAdmin', label: 'Es admin', align: 'center', width: 180 },
  { id: 'role_Nombre', label: 'Rol', align: 'right' },
  { id: '', label: 'Acciones', align: 'right' },
];

// ----------------------------------------------------------------------

export default function AccesoUsuarios() {
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
    defaultOrderBy: 'usua_NombreUsuario',
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { usuarios, isLoading } = useSelector((state) => state.usuario);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    dispatch(getUsuarios());
  }, [dispatch]);

  useEffect(() => {
    if (usuarios.length) {
      setTableData(usuarios);
    }
  }, [usuarios]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.usua_Id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.usua_Id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.eCommerce.edit(paramCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="Usuarios">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Listado de usuarios"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Usuarios' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.eCommerce.new}
            >
              Agregar
            </Button>
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
                      tableData.map((row) => row.usua_Id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <UsuarioTableRow
                          key={row.usua_Id}
                          row={row}
                          selected={selected.includes(row.usua_Id)}
                          onSelectRow={() => onSelectRow(row.usua_Id)}
                          onDeleteRow={() => handleDeleteRow(row.usua_Id)}
                          onEditRow={() => handleEditRow(row.usua_NombreUsuario)}
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
      item.usua_NombreUsuario.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      item.empe_NombreCompleto.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      item.role_Nombre.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }
  

  return tableData;
}
