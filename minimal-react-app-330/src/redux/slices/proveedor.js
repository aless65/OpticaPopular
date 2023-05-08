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
  proveedores: [],
  proveedor: null,
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
  name: 'proveedor',
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

    // GET PROVEEDORES
    getProveedoresSuccess(state, action) {
      state.isLoading = false;
      state.proveedores = action.payload;
    },

    // GET PROVEEDOR
    getProveedorSuccess(state, action) {
      state.isLoading = false;
      state.proveedor = action.payload;
    },

    //  SORT & FILTER PROVEEDORES
    sortByProveedores(state, action) {
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
    sortByProveedores,
    filterProveedores,
} = slice.actions;

// ----------------------------------------------------------------------

export function getProveedores() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('https://localhost:44362/api/Proveedores/Listado');
      dispatch(slice.actions.getProveedoresSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProveedor(name) {                 
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
