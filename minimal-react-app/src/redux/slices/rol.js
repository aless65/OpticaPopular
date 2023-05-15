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
  roles: [],
  rol: null,
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
  name: 'rol',
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

    // GET ROLES
    getRolesSuccess(state, action) {
      state.isLoading = false;
      state.roles = action.payload;
    },

    // GET ROLES
    getRolSuccess(state, action) {
      state.isLoading = false;
      state.rol = action.payload;
    },

    //  SORT & FILTER ROLES
    sortByRoles(state, action) {
      state.sortBy = action.payload;
    },

    filterRoles(state, action) {
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
  sortByRoles,
  filterRoles,
} = slice.actions;

// ----------------------------------------------------------------------

export function getRoles() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://opticapopular.somee.com/api/Roles/Listado');
      dispatch(slice.actions.getRolesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getRol(name) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/products/product', {
        params: { name },
      });
      dispatch(slice.actions.getRolSuccess(response.data.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
