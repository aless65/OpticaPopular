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
import { getConsultorios } from '../../redux/slices/consultorio';
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
import { ConsultorioTableRow, TableToolbar } from '../../sections/@dashboard/optica/consultorio-list';
import AddConsultorioDialog from './OpticaConsultorioModales/ModalInsertConsultorios';
import EditUserDialog from './OpticaConsultorioModales/ModalEditConsultorios';
import DeleteUserDialog from './OpticaConsultorioModales/ModalDeleteConsultorios';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'cons_Id', label: 'ID', align: 'left' },
  { id: 'cons_Nombre', label: 'Nombre', align: 'left' },
  { id: 'empe_Nombres', label: 'Empleado', align: 'left' },
  { id: '', label: 'Acciones', align: 'right' },
];

// ----------------------------------------------------------------------

export default function OpticaConsultorio() {
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
    defaultOrderBy: 'cons_Id',
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { consultorios, isLoading } = useSelector((state) => state.consultorio);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');
    
  const [consultorioId, setConsultorioId] = useState(''); 

  const [consultorioNombre, setConsultorioNombre] = useState(''); 

  const [consultorioEmpleado, setConsultorioEmpleado] = useState(''); 

  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);

  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);

  const [openDeleteUserDialog, setOpenDeleteUserDialog] = useState(false);

  const [insertSuccess, setInsertSuccess] = useState(false);
  
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  // ----------------------------------------------------------------------
  
  useEffect(() => {
    fetch(`http://opticapopular.somee.com/api/Pantallas/PantallasAccesos?role_Id=${JSON.parse(localStorage.getItem('usuario')).role_Id}&esAdmin=${JSON.parse(localStorage.getItem('usuario')).usua_EsAdmin}&pant_Nombre=consultorios`)
      .then(response => response.json())
      .then(data => {
        if(data === 0){
          console.log("nooooo");
          navigate(PATH_DASHBOARD.general.app);
        } else{
          setIsLoadingPage(false);
        }
      })
      .catch(error => console.error(error));
  
  }, [])

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
      item.cons_Id.toString().indexOf(filterName.toLowerCase()) !== -1 ||
      item.cons_Nombre.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      item.empe_Nombres.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }
  

  return tableData;
}

  useEffect(() => {
    dispatch(getConsultorios());
  }, [dispatch]); 

  useEffect(() => {
    if (consultorios.length) {
      setTableData(consultorios);
    }
  }, [consultorios]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    setConsultorioId(id);
    handleOpenDeleteUserDialog();
  };
  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.cons_Id));
    setSelected([]);
    setTableData(deleteRows);
  };

  // useEffect(() => {
  //   console.log(usuaId);
  // }, [usuaId]);

  const handleEditRow = (id,Nombre) => {
    setConsultorioId(id);
    setConsultorioNombre(Nombre);
    handleOpenEditUserDialog();
  };



  const handleOpenAddUserDialog = () => {
    setOpenAddUserDialog(true)
  }

  const handleCloseAddUserDialog = () => {
    setOpenAddUserDialog(false);
  }

  const handleOpenEditUserDialog = () => {
    setOpenEditUserDialog(true);
  }

  const handleCloseEditUserDialog = () => {
    setOpenEditUserDialog(false);
  }

  const handleOpenDeleteUserDialog = () => {
    setOpenDeleteUserDialog(true);
  }

  const handleCloseDeleteUserDialog = () => {
    setOpenDeleteUserDialog(false);
  }
  
  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  if(isLoadingPage){
    return null;
  }

  return (
    <Page title="Consultorios">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Listado de consultorios"
          links={[
            { name: 'Inicio', href: PATH_DASHBOARD.root },
            { name: 'consultorios' },
          ]}
          action={
            <div>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleOpenAddUserDialog}

              >
                Agregar
              </Button>
              <AddConsultorioDialog open={openAddUserDialog} onClose={handleCloseAddUserDialog} consultorios={consultorios} setTableData={setTableData} />
              <EditUserDialog open={openEditUserDialog} onClose={handleCloseEditUserDialog} consultorios={consultorios} setTableData={setTableData} consultorioId={consultorioId} consultorioNombre={consultorioNombre} consultorioEmpleado={consultorioEmpleado} />
              <DeleteUserDialog open={openDeleteUserDialog} onClose={handleCloseDeleteUserDialog} consultorios={consultorios} setTableData={setTableData} consultorioId={consultorioId} />
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
                      tableData.map((row) => row.cons_Id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ConsultorioTableRow
                          key={row.cons_Id}
                          row={row}
                          selected={selected.includes(row.cons_Id)}
                          onSelectRow={() => onSelectRow(row.cons_Id)}
                          onDeleteRow={() => handleDeleteRow(row.cons_Id)}
                          onEditRow={() => handleEditRow(row.cons_Id, row.cons_Nombre, row.empe_Id )}
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
              control={<Switch checked={dense} onChange={onChangeDense}  />}
              label="Denso"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}