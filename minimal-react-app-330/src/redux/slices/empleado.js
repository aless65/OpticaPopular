import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  empleados: [],
  empleado: null,
  sortBy: null,
  filters: {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: '',
  },
};

const slice = createSlice({
  name: 'empleado',
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

    // GET EMPLEADOS
    getEmpleadosSuccess(state, action) {
      state.isLoading = false;
      state.empleados = action.payload;
    },

    // GET EMPLEADO
    getEmpleadoSuccess(state, action) {
      state.isLoading = false;
      state.empleado = action.payload;
    },

    //  SORT & FILTER EMPLEADOS
    sortByEmpleados(state, action) {
      state.sortBy = action.payload;
    },

    filterEmpleados(state, action) {
      state.filters.gender = action.payload.gender;
      state.filters.category = action.payload.category;
      state.filters.colors = action.payload.colors;
      state.filters.priceRange = action.payload.priceRange;
      state.filters.rating = action.payload.rating;
    },
    
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  sortByEmpleados,
  filterEmpleados,
} = slice.actions;

// ----------------------------------------------------------------------

export function getEmpleados() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('Empleados/Listado');
      dispatch(slice.actions.getEmpleadosSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getEmpleado(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://opticapopular.somee.com/api/Empleados/Find?id=2');
      dispatch(slice.actions.getEmpleadoSuccess(response.data.data));
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
