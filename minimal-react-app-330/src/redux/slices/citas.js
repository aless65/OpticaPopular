import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  citas: [],
  cita: null,
  sortBy: null,
  filters: {
    cita_Id: 0,
    clie_Nombres: '',
    clie_Apellidos: '',
    cons_Nombre: '',
    empe_Nombres: '',
    cita_Fecha: '',
    sucu_Id: ''
  },
};

const slice = createSlice({
  name: 'cita',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET citas
    getcitasSuccess(state, action) {
      state.isLoading = false;
      state.citas = action.payload;
    },

    // GET cita
    getcitaSuccess(state, action) {
      state.isLoading = false;
      state.cita = action.payload;
    },

    //  SORT & FILTER cita
    sortByCitas(state, action) {
      state.sortBy = action.payload;
    },

    filterCitas(state, action) {
      state.filters.cita_Id = action.payload.cita_Id;
      state.filters.clie_Nombres = action.payload.clie_Nombres;
      state.filters.clie_Apellidos = action.payload.clie_Apellidos;
      state.filters.cons_Nombre = action.payload.cons_Nombre;
      state.filters.empe_Nombres = action.payload.empe_Nombres;
      state.filters.cita_Fecha = action.payload.cita_Fecha;
      state.filters.sucu_Id = action.payload.sucu_Id;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
    sortByCitas,
    filterCitas,
} = slice.actions;

// ----------------------------------------------------------------------

export function getCitas() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`citas/ListadoCitasPorIdSucursal/${JSON.parse(localStorage.getItem('usuario')).usua_EsAdmin === true ? 0 : localStorage.getItem('sucu_Id')}`);
      dispatch(slice.actions.getcitasSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getcita(Id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`Citas/BuscarCitaPorId/${Id}`);
      dispatch(slice.actions.getcitaSuccess(response.data.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
