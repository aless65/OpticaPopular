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
import { getCategorias } from '../../redux/slices/categoria';
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
import { CategoriaTableRow, TableToolbar } from '../../sections/@dashboard/optica/categoria-list';
import AddCategoriaDialog from './OpticaCategoriasModales/ModalInsertCategorias'; 
import EditCategoriaDialog from './OpticaCategoriasModales/ModalEditCategorias';
import DeleteCategoriaDialog from './OpticaCategoriasModales/ModalDeleteCategorias';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'cate_Id', label: 'ID', align: 'left' },
  { id: 'cate_Nombre', label: 'Nombre', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function OpticaCategorias() {
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
    defaultOrderBy: 'cate_Id',
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { categorias, isLoading } = useSelector((state) => state.categoria);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [categoriaId, setcategoriaId] = useState('');
  const [categoriaNombre, setcategoriaNombre] = useState('');

  const [openAddCategoriaDialog, setOpenAddCategoriaDialog] = useState(false);
  const [openEditCategoriaDialog, setOpenEditCategoriaDialog] = useState(false);
  const [openDeleteCategoriaDialog, setOpenDeleteCategoriaDialog] = useState(false);

  const handleOpenAddCategoriaDialog = () => {
    setOpenAddCategoriaDialog(true)
  }

  const handleCloseAddCategoriaDialog = () => {
    setOpenAddCategoriaDialog(false);
  }

  const handleOpenEditCategoriaDialog = () => {
    setOpenEditCategoriaDialog(true);
  }

  const handleCloseEditCategoriaDialog = () => {
    setOpenEditCategoriaDialog(false);
  }

  const handleOpenDeleteCategoriaDialog = () => {
    setOpenDeleteCategoriaDialog(true);
  }

  const handleCloseDeleteCategoriaDialog = () => {
    setOpenDeleteCategoriaDialog(false);
  }

  useEffect(() => {
    dispatch(getCategorias());
  }, [dispatch]);

  useEffect(() => {
    if (categorias.length) {
      setTableData(categorias);
    }
  }, [categorias]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    setcategoriaId(id);
    handleOpenDeleteCategoriaDialog();
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.cate_Id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id, nombre) => {
    setcategoriaId(id);
    setcategoriaNombre(nombre);
    handleOpenEditCategoriaDialog();
  };



  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="Categorias">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Listado de Categorias"
          links={[
            { name: 'Inicio', href: PATH_DASHBOARD.root },
            { name: 'categorias' },
          ]}
          action={
            <div>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleOpenAddCategoriaDialog}

              >
                Agregar
              </Button>
              <AddCategoriaDialog open={openAddCategoriaDialog} onClose={handleCloseAddCategoriaDialog} categorias={categorias} setTableData={setTableData} />
              <EditCategoriaDialog open={openEditCategoriaDialog} onClose={handleCloseEditCategoriaDialog} categorias={categorias} setTableData={setTableData} categoriaId={categoriaId} categoriaNombre={categoriaNombre} />
              <DeleteCategoriaDialog open={openDeleteCategoriaDialog} onClose={handleCloseDeleteCategoriaDialog} categorias={categorias} setTableData={setTableData} categoriaId={categoriaId} />
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
                      tableData.map((row) => row.cate_Id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <CategoriaTableRow
                          key={row.cate_Id}
                          row={row}
                          selected={selected.includes(row.cate_Id)}
                          onSelectRow={() => onSelectRow(row.cate_Id)}
                          onDeleteRow={() => handleDeleteRow(row.cate_Id)}
                          onEditRow={() => handleEditRow(row.cate_Id, row.cate_Nombre)}
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
      item.cate_Id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      item.cate_Nombre.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 
      
    );
  }
  

  return tableData;
}
