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
import { getProveedores } from '../../redux/slices/proveedor';      
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
import { ProveedorTableRow, TableToolbar } from '../../sections/@dashboard/optica/proveedores-list';
import DeleteProveedorDialog from './OpticaProveedoresModales/ModalDeleteProveedores';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'prov_Nombre', label: 'Nombre', align: 'left' },           
  { id: 'prov_Telefono', label: 'Telefono', align: 'left' },
  { id: 'prov_CorreoElectronico', label: 'E-Mail', align: 'left' },
  { id: 'dire_DireccionExacta', label: 'Dirección', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function OpticaProveedores() {
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
    defaultOrderBy: 'prov_Nombre',           
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { proveedores, isLoading } = useSelector((state) => state.proveedor);   

  const [tableData, setTableData] = useState([]);

  const [proveedorId, setproveedorId] = useState('');

  const [filterName, setFilterName] = useState('');

  const [openDeleteProveedorDialog, setOpenDeleteProveedorDialog] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  // ----------------------------------------------------------------------

  useEffect(() => {
    fetch(`https://localhost:44362/api/Pantallas/PantallasAccesos?role_Id=${JSON.parse(localStorage.getItem('usuario')).role_Id}&esAdmin=${JSON.parse(localStorage.getItem('usuario')).usua_EsAdmin}&pant_Nombre=proveedores`)
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
      item.prov_Nombre.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      item.prov_Telefono.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      item.prov_CorreoElectronico.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 
    );
  }
  

  return tableData;
}

  useEffect(() => {
    dispatch(getProveedores());                     
  }, [dispatch]);

  useEffect(() => {
    if (proveedores.length) {              
      setTableData(proveedores);
    }
  }, [proveedores]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    setproveedorId(id);
    handleOpenDeleteProveedorDialog();
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.prov_Id));
    setSelected([]);
    setTableData(deleteRows);
  };


  const handleEditRow = (id) => {
    navigate(PATH_OPTICA.proveedoresEdit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleOpenDeleteProveedorDialog = () => {
    setOpenDeleteProveedorDialog(true);
  }

  const handleCloseDeleteProveedorDialog = () => {
    setOpenDeleteProveedorDialog(false);
  }

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  if(isLoadingPage){
    return null;
  }

  return (
    <Page title="Proveedores">                                 
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Listado de Proveedores"
          links={[
            { name: 'Optica', href: PATH_DASHBOARD.root },
            { name: 'Proveedores' },
          ]}
          action={
            <div>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_OPTICA.proveedoresNew}
            >
              Agregar
            </Button>
            <DeleteProveedorDialog open={openDeleteProveedorDialog} onClose={handleCloseDeleteProveedorDialog} proveedores={proveedores} setTableData={setTableData} proveedorId={proveedorId} />
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
                      tableData.map((row) => row.prov_Id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)                
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ProveedorTableRow
                          key={row.prov_Id}
                          row={row}
                          selected={selected.includes(row.prov_Id)}
                          onSelectRow={() => onSelectRow(row.prov_Id)}
                          onDeleteRow={() => handleDeleteRow(row.prov_Id)}
                          onEditRow={() => handleEditRow(row.prov_Id)}
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


