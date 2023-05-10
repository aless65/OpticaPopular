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
  marcas: [],
  marca: null,
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
  name: 'marca',
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

    // GET MARCAS
    getMarcasSuccess(state, action) {
      state.isLoading = false;
      state.marcas = action.payload;
    },

    // GET MARCA
    getMarcaSuccess(state, action) {
      state.isLoading = false;
      state.marca = action.payload;
    },

    //  SORT & FILTER MARCAS
    sortByMarcas(state, action) {
      state.sortBy = action.payload;
    },

    filterMarcas(state, action) {
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
    sortByMarcas,
    filterMarcas    ,
} = slice.actions;

// ----------------------------------------------------------------------

export function getMarcas() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('https://localhost:44362/api/Marcas/Listado');
      dispatch(slice.actions.getMarcasSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getMarca(name) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/products/product', {
        params: { name },
      });
      dispatch(slice.actions.getClienteSuccess(response.data.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
