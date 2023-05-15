import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { store, useSelector, dispatch } from "../store"


// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  sucursales: [],
  sucursal: null,
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
  name: 'sucursal',
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

    // GET SUCURSALES
    getSucursalesSuccess(state, action) {
      state.isLoading = false;
      state.sucursales = action.payload;
    },

    // GET SUCURSALES
    getSucursalSuccess(state, action) {
      state.isLoading = false;
      state.sucursal = action.payload;
    },

    //  SORT & FILTER SUCURSALES
    sortBySucursales(state, action) {
      state.sortBy = action.payload;
    },

    filterSucursales(state, action) {
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
  sortBySucursales,
  filterSucursales,
} = slice.actions;

// ----------------------------------------------------------------------

export function getSucursales() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://opticapopular.somee.com/api/Sucursales/Listado');
      dispatch(slice.actions.getSucursalesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------



export function getSucursal(id) {
  return async () => {
    // Usa `store.dispatch` en lugar de `dispatch`
    store.dispatch(slice.actions.startLoading());
    try {
      console.log(id);
      const response = await axios.get(`http://opticapopular.somee.com/api/Sucursales/Find?id=${id}`);
      store.dispatch(slice.actions.getSucursalSuccess(response.data.data));
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
      store.dispatch(slice.actions.hasError(error));
    }
  };
}
