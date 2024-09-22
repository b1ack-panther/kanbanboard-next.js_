"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { setCredentials } from "@/store/authSlice";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useAxios } from "@/hooks/axios";

const registerFormSchema = z.object({
	fullName: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type registerFormData = z.infer<typeof registerFormSchema>;

const RegisterPage = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const axios = useAxios();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<registerFormData>({ resolver: zodResolver(registerFormSchema) });

	const onSubmit = async (formData: registerFormData) => {
		try {
			const res = await axios.post(`/auth/register`, formData);
			const accessToken = res?.data?.accessToken;
			dispatch(setCredentials({ accessToken }));
			toast.success("User created successfully");
			router.push("/sign-in");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen">
			<Card className="w-full max-w-md">
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle className="text-2xl font-bold">Register</CardTitle>
						<CardDescription>
							Enter your details of Kanban Board account
						</CardDescription>
					</CardHeader>

					<CardContent className="flex flex-col gap-4">
						<div>
							<Label htmlFor="fullName">Name</Label>
							<Input
								id="fullName"
								{...register("fullName")}
								placeholder="Your Fullname"
							/>
							{errors.fullName && (
								<p className="text-sm text-red-500 mt-1">
									{errors.fullName.message}
								</p>
							)}
						</div>

						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								{...register("email")}
								placeholder="your-email@example.com"
							/>
							{errors.email && (
								<p className="text-red-500 text-sm mt-1">
									{errors.email.message}
								</p>
							)}
						</div>

						<div>
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								{...register("password")}
								placeholder="Your password"
							/>
							{errors.password && (
								<p className="text-red-500 text-sm mt-1">
									{errors.password.message}
								</p>
							)}
						</div>
					</CardContent>
					<CardFooter className="flex flex-col gap-4 items-start">
						<Button
							disabled={isSubmitting}
							type="submit"
							className="w-full space-x-2"
						>
							<p>Register</p>
							{isSubmitting && <Loader />}
						</Button>
						<p className="text-sm">
							Already have account,{" "}
							<Link href="/sign-in" className="underline">
								Sign-in here
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
};

export default RegisterPage;
