import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  ordendetalles: [],
  ordendetalle: null,
  sortBy: null,
  filters: {
    orde_Id: 0,
    clie_Id: '',
    clie_NombreCompleto: '',
    orde_Fecha: '',
    orde_FechaEntrega: '',
    orde_FechaEntregaReal: '',
    sucu_Id: '',
    sucu_Descripcion: ''
  },
};

const slice = createSlice({
  name: 'ordendetalle',
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
    getOrdenesDetallesSuccess(state, action) {
      state.isLoading = false;
      state.ordenedetalles = action.payload;
    },

    // GET cita
    getOrdenDetalleSuccess(state, action) {
      state.isLoading = false;
      state.orden = action.payload;
    },

    //  SORT & FILTER cita
    sortByOrdenesDetalles(state, action) {
      state.sortBy = action.payload;
    },

    filterOrdenesDetalles(state, action) {
      state.filters.orde_Id = action.payload.orde_Id;
      state.filters.clie_Id = action.payload.clie_Id;
      state.filters.clie_NombreCompleto = action.payload.clie_NombreCompleto;
      state.filters.orde_Fecha = action.payload.orde_Fecha;
      state.filters.orde_FechaEntrega = action.payload.orde_FechaEntrega;
      state.filters.orde_FechaEntregaReal = action.payload.orde_FechaEntregaReal;
      state.filters.sucu_Id = action.payload.sucu_Id;
      state.filters.sucu_Descripcion = action.payload.sucu_Descripcion;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  sortByOrdenesDetalles,
  filterOrdenesDetalles,
} = slice.actions;

// ----------------------------------------------------------------------

export function getOrdenes(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`Ordenes/ListadoDetalles?id=${id}`);
        // console.log(response.data.data);
        dispatch(slice.actions.getOrdenesDetallesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

// export function getOrden(Id) {
//   return async () => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get(`Citas/BuscarCitaPorId/${Id}`);
//       dispatch(slice.actions.getcitaSuccess(response.data.data));
//     } catch (error) {
//       console.error(error);
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }
