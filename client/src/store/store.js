import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import { authApi } from './api/authApi';
import { productsApi } from './api/productsApi';
import { ordersApi } from './api/ordersApi';
import { dashboardApi } from './api/dashboardApi';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productsApi.middleware,
      ordersApi.middleware,
      dashboardApi.middleware
    ),
});

export default store;
