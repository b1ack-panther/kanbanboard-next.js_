// import { useAuth } from "@/hooks/useAuth";
// import axios from "axios";
// import toast from "react-hot-toast";

// const axiosInstance = axios.create({
// 	baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN,
// });

// // const token = useAuth()?.token

// axios.defaults.headers.common[
// 	"Authorization"
// ] = `Bearer ${res?.data?.access_token}`;

// axiosInstance.interceptors.response.use(
// 	(response) => response,
// 	(error) => {
// 		if (axios.isAxiosError(error)) {
// 			toast.error(JSON.stringify(error?.response?.data?.error));
// 		} else {
// 			console.error("Unexpected error:", error);
// 			toast.error("An unexpected error occurred.");
// 		}
// 		return Promise.reject(error);
// 	}
// );

import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { setCredentials } from "@/store/authSlice";
import { useDispatch } from "react-redux";

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN,
});

export const useAxios = () => {
	const token = useAuth()?.token;
	const dispatch = useDispatch();

	useEffect(() => {
		const requestInterceptor = axiosInstance.interceptors.request.use(
			(config) => {
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseInterceptor = axiosInstance.interceptors.response.use(
			(response) => response,
			async (error: AxiosError<{ error: string }>) => {
				const originalRequest = error.config;

				if (error.status === 403 || error.response?.status === 403) {
					const {
						data: { accessToken },
					} = await axiosInstance.get("/auth/refresh-token");
					dispatch(setCredentials({ accessToken }));
					if (originalRequest && originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
						return axiosInstance(originalRequest);
					}
				} else {
					toast.error(JSON.stringify(error?.response?.data?.error));
					return Promise.reject(error);
				}
			}
		);

		return () => {
			axiosInstance.interceptors.request.eject(requestInterceptor);
			axiosInstance.interceptors.response.eject(responseInterceptor);
		};
	}, [token]);

	return axiosInstance;
};
