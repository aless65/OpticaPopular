import { createSlice } from '@reduxjs/toolkit';
// import sum from 'lodash/sum';
// import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  usuarios: [],
  usuario: null,
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
  name: 'usuario',
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

    // GET USUARIOS
    getUsuariosSuccess(state, action) {
      state.isLoading = false;
      state.usuarios = action.payload;
    },

    // GET USUARIO
    getUsuarioSuccess(state, action) {
      state.isLoading = false;
      state.usuario = action.payload;
      // console.log('User data:', action.payload);
    },

    //  SORT & FILTER USUARIOS
    sortByUsuarios(state, action) {
      state.sortBy = action.payload;
    },

    filterUsuarios(state, action) {
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
  sortByUsuarios,
  filterUsuarios,
} = slice.actions;

// ----------------------------------------------------------------------

export function getUsuarios() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://opticapopular.somee.com/api/Usuarios/Listado');
      dispatch(slice.actions.getUsuariosSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getUsuario(id) {
  return async (dispatch) => { // add dispatch parameter
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`http://opticapopular.somee.com/api/Usuarios/Find?id=${id}`);
      dispatch(slice.actions.getUsuarioSuccess(response.data.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
