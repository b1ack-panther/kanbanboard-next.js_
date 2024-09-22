import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialState {
	token: string | null;
}

const isBrower = typeof window !== "undefined";
const initalToken = isBrower ? localStorage.getItem("token") : null;

const initialState: initialState = {
	token: initalToken,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
			state.token = action.payload.accessToken;
			if (isBrower) localStorage.setItem("token", action.payload.accessToken);
		},
		logout: (state) => {
			state.token = null;
			if (isBrower) localStorage.removeItem("token");
		},
	},
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
