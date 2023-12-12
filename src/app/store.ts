import { configureStore } from '@reduxjs/toolkit';
import { builderSlice } from '~/pages/builder';

export const store = configureStore({
  reducer: {
    [builderSlice.name]: builderSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
