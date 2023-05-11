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
  categorias: [],
  categoria: null,
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
  name: 'categoria',
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

    // GET CATEGORIAS
    getCategoriasSuccess(state, action) {
      state.isLoading = false;
      state.categorias = action.payload;
    },

    // GET CATEGORIA
    getCategoriaSuccess(state, action) {
      state.isLoading = false;
      state.categoria = action.payload;
    },

    //  SORT & FILTER CATEGORIAS
    sortByCategorias(state, action) {
      state.sortBy = action.payload;
    },

    filterCategorias(state, action) {
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
    sortByCategorias,
    filterCategorias,
} = slice.actions;

// ----------------------------------------------------------------------

export function getCategorias() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://opticapopular.somee.com/api/Categorias/Listado');
      dispatch(slice.actions.getCategoriasSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getCategoria(name) {
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
