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
import { getClientes } from '../../redux/slices/cliente';
// routes
import { PATH_DASHBOARD, PATH_OPTICA  } from '../../routes/paths';

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
import { ClienteTableRow, TableToolbar } from '../../sections/@dashboard/optica/cliente-list';
import DeleteClienteDialog from './OpticaClienteModales/ModalDeleteClientes';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'clie_NombreCompleto', label: 'Nombre', align: 'left' },
  { id: 'clie_Identidad', label: 'Identidad', align: 'left' },
  { id: 'clie_Sexo', label: 'Sexo', align: 'left' },
  { id: 'clie_CorreoElectronico', label: 'E-Mail', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function OpticaClientes() {
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
    defaultOrderBy: 'clie_NombreCompleto',
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { clientes, isLoading } = useSelector((state) => state.cliente);

  const [tableData, setTableData] = useState([]);

  const [clienteId, setClienteId] = useState('');

  const [filterName, setFilterName] = useState('');

  const [openDeleteClienteDialog, setOpenDeleteClienteDialog] = useState(false);

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
      item.clie_NombreCompleto.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      item.clie_Identidad.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      item.clie_Sexo.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 
    );
  }
  

  return tableData;
}



  useEffect(() => {
    dispatch(getClientes());
  }, [dispatch]);

  useEffect(() => {
    if (clientes.length) {
      setTableData(clientes);
    }
  }, [clientes]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    setClienteId(id);
    handleOpenDeleteClienteDialog();
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.clie_Id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_OPTICA.clientesEdit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });


  const handleOpenDeleteClienteDialog = () => {
    setOpenDeleteClienteDialog(true);
  }

  const handleCloseDeleteClienteDialog = () => {
    setOpenDeleteClienteDialog(false);
  }



  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="Clientes">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Listado de clientes"
          links={[
            { name: 'Inicio', href: PATH_DASHBOARD.root },
            { name: 'Clientes' },
          ]}
          action={
            <div>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_OPTICA.clientesNew}
            >
              Agregar

            </Button>
            <DeleteClienteDialog open={openDeleteClienteDialog} onClose={handleCloseDeleteClienteDialog} clientes={clientes} setTableData={setTableData} clienteId={clienteId} />
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
                      tableData.map((row) => row.clie_Id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ClienteTableRow
                          key={row.clie_Id}
                          row={row}
                          selected={selected.includes(row.clie_Id)}
                          onSelectRow={() => onSelectRow(row.clie_Id)}
                          onDeleteRow={() => handleDeleteRow(row.clie_Id)}
                          onEditRow={() => handleEditRow(row.clie_Id)}
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


