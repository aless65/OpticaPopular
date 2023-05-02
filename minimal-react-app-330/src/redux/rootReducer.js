import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import usuarioReducer from './slices/usuario';
import rolReducer from './slices/rol';
import clienteReducer from './slices/cliente';
import empleadoReducer from './slices/empleado';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const usuarioPersistConfig = {
  key: 'usuario',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rolPersistConfig = {
  key: 'rol',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const clientePersistConfig = {
  key: 'cliente',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const empleadoPersistConfig = {
  key: 'empleado',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: persistReducer(productPersistConfig, productReducer),
  usuario: persistReducer(usuarioPersistConfig, usuarioReducer),
  rol: persistReducer(rolPersistConfig, rolReducer),
  cliente: persistReducer(clientePersistConfig, clienteReducer),
  empleado: persistReducer(empleadoPersistConfig, empleadoReducer),
});

export { rootPersistConfig, rootReducer };
