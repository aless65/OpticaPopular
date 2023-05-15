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
    deor_Id: 0,
    orde_Id: '',
    aros_Id: '',
    deor_GraduacionLeft: '',
    deor_GraduacionRight: '',
    deor_Precio: '',
    deor_Cantidad: '',
    deor_Total: ''
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
      state.ordendetalles = action.payload;
    },

    // GET cita
    getOrdenDetalleSuccess(state, action) {
      state.isLoading = false;
      state.ordendetalle = action.payload;
    },

    //  SORT & FILTER cita
    sortByOrdenesDetalles(state, action) {
      state.sortBy = action.payload;
    },

    filterOrdenesDetalles(state, action) {
      state.filters.deor_Id = action.payload.deor_Id;
      state.filters.orde_Id = action.payload.orde_Id;
      state.filters.aros_Id = action.payload.aros_Id;
      state.filters.deor_GraduacionLeft = action.payload.deor_GraduacionLeft;
      state.filters.deor_GraduacionRight = action.payload.deor_GraduacionRight;
      state.filters.deor_Precio = action.payload.deor_Precio;
      state.filters.deor_Cantidad = action.payload.deor_Cantidad;
      state.filters.deor_Total = action.payload.deor_Total;
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

export function getOrdenesDetalles(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      console.log("entra");
      const response = await axios.get(`Ordenes/ListadoDetalles?id=${id}`);
        console.log(response.data.data);
        dispatch(slice.actions.getOrdenesDetallesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

// export function getOrdenDetalle(Id) {
//   return async () => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get(`Citas/BuscarCitaPorId/${Id}`);
//       dispatch(slice.actions.getOrdenDetalleSuccess(response.data.data));
//     } catch (error) {
//       console.error(error);
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }
