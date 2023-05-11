import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  detallesCitas: [],
  detallesCita: null,
  sortBy: null,
  filters: {
    deci_Id: 0,
    deci_Costo: 0,
    deci_HoraInicio: '',
    deci_HoraFin: '',
  },
};

const slice = createSlice({
  name: 'DetallesCitas',
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

    // GET DetallesCitass
    getDetallesCitasSuccess(state, action) {
      state.isLoading = false;
      state.detallesCitas = action.payload;
    },

    // GET DetallesCitas
    getDetallesCitaSuccess(state, action) {
      state.isLoading = false;
      state.detallesCita = action.payload;
    },

    //  SORT & FILTER DetallesCitas
    sortByDetallesCitas(state, action) {
      state.sortBy = action.payload;
    },

    filterDetallesCitas(state, action) {
      state.filters.deci_Id = action.payload.deci_Id;
      state.filters.deci_Costo = action.payload.deci_Costo;
      state.filters.deci_HoraInicio = action.payload.deci_HoraInicio;
      state.filters.deci_HoraFin = action.payload.deci_HoraFin;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
    sortByDetallesCitas,
    filterDetallesCitas,
} = slice.actions;

// ----------------------------------------------------------------------

export function getDetallesCitas() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`DetallesCitas/ListadoDetallesCitassPorIdSucursal/${JSON.parse(localStorage.getItem('usuario')).usua_EsAdmin === true ? 0 : localStorage.getItem('sucu_Id')}`);
      dispatch(slice.actions.getDetallesCitasSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getDetallesCita(Id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`DetallesCitas/BuscarDetalleCitaPorIdCita/${Id}`);
      dispatch(slice.actions.getDetallesCitaSuccess(response.data.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
