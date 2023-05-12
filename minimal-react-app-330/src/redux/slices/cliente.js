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
  clientes: [],
  cliente: null,
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
  name: 'cliente',
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

    // GET CLIENTES
    getClientesSuccess(state, action) {
      state.isLoading = false;
      state.clientes = action.payload;
    },

    // GET CLIENTE
    getClienteSuccess(state, action) {
      state.isLoading = false;
      state.cliente = action.payload;
    },

    //  SORT & FILTER CLIENTES
    sortByClientes(state, action) {
      state.sortBy = action.payload;
    },

    filterClientes(state, action) {
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
    sortByClientes,
    filterClientes,
} = slice.actions;

// ----------------------------------------------------------------------

export function getClientes() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('https://localhost:44362/api/Clientes/Listado');
      dispatch(slice.actions.getClientesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------


export function getCliente(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(id);
      const response = await axios.get(`https://localhost:44362/api/Clientes/Find?id=${id}`);
      
      dispatch(slice.actions.getClienteSuccess(response.data.data));
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
