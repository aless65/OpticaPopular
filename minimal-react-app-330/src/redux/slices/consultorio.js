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
  consultorios: [],
  consultorio: null,
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
  name: 'consultorio',
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

    // GET CONSULTORIOS
    getConsultoriosSuccess(state, action) {
      state.isLoading = false;
      state.consultorios = action.payload;
    },

    // GET CONSULTORIO
    getConsultorioSuccess(state, action) {
      state.isLoading = false;
      state.consultorio = action.payload;
    },

    //  SORT & FILTER CONSULTORIOS
    sortByConsultorios(state, action) {
      state.sortBy = action.payload;
    },

    filterConsultorios(state, action) {
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
    sortByConsultorios,
    filterConsultorios,
} = slice.actions;

// ----------------------------------------------------------------------

export function getConsultorios() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('https://localhost:44362/api/Consultorios/ListadoConsultoriosPorIdSucursal/0');
      dispatch(slice.actions.getConsultoriosSuccess(response.data.data));
      console.log(response.data.data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConsultorio(name) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('https://localhost:44362/api/Consultorios/ListadoConsultoriosPorIdSucursal/0', {
        params: { name },
      });
      dispatch(slice.actions.getConsultorioSuccess(response.data.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
