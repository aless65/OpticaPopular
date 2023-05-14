import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  ordenes: [],
  orden: null,
  sortBy: null,
  filters: {
    orde_Id: 0,
    orde_Fecha: '',
    orde_FechaEntrega: ''
  },
};

const slice = createSlice({
  name: 'ordenes',
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

    // GET ordenes
    getOrdenesSuccess(state, action) {
      state.isLoading = false;
      state.citas = action.payload;
    },

    // GET orden
    getOrdenSuccess(state, action) {
      state.isLoading = false;
      state.cita = action.payload;
    },

    //  SORT & FILTER ORDEN
    sortByOrdenes(state, action) {
      state.sortBy = action.payload;
    },

    filterOrdenes(state, action) {
      state.filters.orde_Id = action.payload.orde_Id;
      state.filters.orde_Fecha = action.payload.orde_Fecha;
      state.filters.orde_FechaEntrega = action.payload.orde_FechaEntrega;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
    sortByOrdenes,
    filterOrdenes,
} = slice.actions;

// ----------------------------------------------------------------------

export function getOrdenes() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('Ordenes/ListadoXSucursales?id=1');
      dispatch(slice.actions.getOrdenesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getOrden(Id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`Citas/BuscarCitaPorId/${Id}`);
      dispatch(slice.actions.getOrdenSuccess(response.data.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
