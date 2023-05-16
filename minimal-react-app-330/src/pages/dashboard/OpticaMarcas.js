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
import { getMarcas } from '../../redux/slices/marca';
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
import { MarcasTableRow, TableToolbar } from '../../sections/@dashboard/optica/marcas-list';
import AddMarcaDialog from './OpticaMarcasModales/ModalInsertMarcas';
import EditMarcaDialog from './OpticaMarcasModales/ModalEditMarcas';
import DeleteMarcaDialog from './OpticaMarcasModales/ModalDeleteMarcas';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'marc_Id', label: 'Nombre', align: 'left' },
  { id: 'marc_Nombre', label: 'Nombre', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function OpticaMarcas() {
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
    defaultOrderBy: 'marc_Id',
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { marcas, isLoading } = useSelector((state) => state.marca);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [marcaId, setmarcaId] = useState('');
  const [marcaNombre, setmarcaNombre] = useState('');

  const [openAddMarcaDialog, setOpenAddMarcaDialog] = useState(false);
  const [openEditMarcaDialog, setOpenEditMarcaDialog] = useState(false);
  const [openDeleteMarcaDialog, setOpenDeleteMarcaDialog] = useState(false);

  const [isLoadingPage, setIsLoadingPage] = useState(true);


  // ----------------------------------------------------------------------

  useEffect(() => {
    fetch(`https://localhost:44362/api/Pantallas/PantallasAccesos?role_Id=${JSON.parse(localStorage.getItem('usuario')).role_Id}&esAdmin=${JSON.parse(localStorage.getItem('usuario')).usua_EsAdmin}&pant_Nombre=marcas`)
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


  const handleOpenAddMarcaDialog = () => {
    setOpenAddMarcaDialog(true)
  }

  const handleCloseAddMarcaDialog = () => {
    setOpenAddMarcaDialog(false);
  }

  const handleOpenEditMarcaDialog = () => {
    setOpenEditMarcaDialog(true);
  }

  const handleCloseEditMarcaDialog = () => {
    setOpenEditMarcaDialog(false);
  }

  const handleOpenDeleteMarcaDialog = () => {
    setOpenDeleteMarcaDialog(true);
  }

  const handleCloseDeleteMarcaDialog = () => {
    setOpenDeleteMarcaDialog(false);
  }

  useEffect(() => {
    dispatch(getMarcas());
  }, [dispatch]);

  useEffect(() => {
    if (marcas.length) {
      setTableData(marcas);
    }
  }, [marcas]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };


  const handleDeleteRow = (id) => {
    setmarcaId(id);
    handleOpenDeleteMarcaDialog();
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.marc_Id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id, nombre) => {
    setmarcaId(id);
    setmarcaNombre(nombre);
    handleOpenEditMarcaDialog();
  };






  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  if (isLoadingPage) {
    return null;
  }

  return (
    <Page title="Marcas">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Listado de Marcas"
          links={[
            { name: 'Inicio', href: PATH_DASHBOARD.root },
            { name: 'Marcas' },
          ]}
          action={
            <div>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleOpenAddMarcaDialog}

              >
                Agregar
              </Button>
              <AddMarcaDialog open={openAddMarcaDialog} onClose={handleCloseAddMarcaDialog} marcas={marcas} setTableData={setTableData} />
              <EditMarcaDialog open={openEditMarcaDialog} onClose={handleCloseEditMarcaDialog} marcas={marcas} setTableData={setTableData} marcaId={marcaId} marcaNombre={marcaNombre} />
              <DeleteMarcaDialog open={openDeleteMarcaDialog} onClose={handleCloseDeleteMarcaDialog} marcas={marcas} setTableData={setTableData} marcaId={marcaId} />
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
                      tableData.map((row) => row.marc_Id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <MarcasTableRow
                          key={row.marc_Id}
                          row={row}
                          selected={selected.includes(row.marc_Id)}
                          onSelectRow={() => onSelectRow(row.marc_Id)}
                          onDeleteRow={() => handleDeleteRow(row.marc_Id)}
                          onEditRow={() => handleEditRow(row.marc_Id, row.marc_Nombre,)}
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
      item.marc_Id.toString().indexOf(filterName.toLowerCase()) !== -1 ||
      item.marc_Nombre.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }


  return tableData;
}
