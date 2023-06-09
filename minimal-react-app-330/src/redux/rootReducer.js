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
import proveedorReducer from './slices/proveedor';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import citaReducer from './slices/citas';
import marcaReducer from './slices/marca';
import categoriaReducer from './slices/categoria';
import sucursalReducer from './slices/sucursal';
import consultorioReducer from './slices/consultorio';
import ordenReducer from './slices/orden';
import ordenDetalleReducer from './slices/ordendetalles';
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

const citaPersistConfig = {
    key: 'cita',
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

const proveedorPersistConfig = {
  key: 'proveedor',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const marcaPersistConfig = {
  key: 'marca',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const categoriaPersistConfig = {
  key: 'categoria',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const sucursalPersistConfig = {
  key: 'sucursal',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const consultorioPersistConfig = {
  key: 'consultorio',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const ordenPersistConfig = {
  key: 'orden',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const ordenDetallePersistConfig = {
  key: 'ordendetalle',
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
  cita: persistReducer(citaPersistConfig, citaReducer),
  rol: persistReducer(rolPersistConfig, rolReducer),
  cliente: persistReducer(clientePersistConfig, clienteReducer),
  empleado: persistReducer(empleadoPersistConfig, empleadoReducer),
  proveedor: persistReducer(proveedorPersistConfig, proveedorReducer),
  marca: persistReducer(marcaPersistConfig, marcaReducer),
  categoria: persistReducer(categoriaPersistConfig, categoriaReducer),
  sucursal: persistReducer(sucursalPersistConfig, sucursalReducer),
  consultorio: persistReducer(consultorioPersistConfig, consultorioReducer),
  orden: persistReducer(ordenPersistConfig, ordenReducer),
  ordendetalle: persistReducer(ordenDetallePersistConfig, ordenDetalleReducer),
});

export { rootPersistConfig, rootReducer };
