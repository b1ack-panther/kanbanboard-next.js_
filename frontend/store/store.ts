import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import taskSlice from "./taskSlice";

export const makeStore = () => {
	return configureStore({
		reducer: {
			auth: authReducer,
			task: taskSlice,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
