import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import loaderReducer from "./slices/loaderSlice";
import { server } from "./server";

export const store = configureStore({
  reducer: {
    [server.reducerPath]: server.reducer,
    auth: authReducer,
    loader: loaderReducer,
    devTools: true,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(server.middleware),
});
