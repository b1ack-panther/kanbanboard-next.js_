"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

interface useAuth {
	fullName: string;
	email: string;
	id: string;
	token: string;
}

export const useAuth = () => {
	const { token } = useSelector((state: RootState) => state.auth);
	if (!token) return null;

	const decodedUser = jwtDecode(token);
	return { token, ...decodedUser };
};
