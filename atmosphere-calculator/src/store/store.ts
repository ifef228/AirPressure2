import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './filtersSlice';
import authReducer from './authSlice';
import ordersReducer from './ordersSlice';
import draftReducer from './draftSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    auth: authReducer,
    orders: ordersReducer,
    draft: draftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
