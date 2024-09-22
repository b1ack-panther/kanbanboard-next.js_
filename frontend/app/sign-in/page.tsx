"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCredentials } from "@/store/authSlice";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription,
} from "@/components/ui/card";
import { useDispatch } from "react-redux";
import axios from "axios";

const signInSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(3, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
	const dispatch = useDispatch();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema),
	});

	const onSubmit = async (formData: SignInFormData) => {
		try {
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/sign-in`,
				formData
			);
			const accessToken = res?.data?.accessToken;
			dispatch(setCredentials({ accessToken }));
			router.push("/?view=list");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen">
			<Card className="w-full max-w-md">
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle className="text-2xl font-bold">Sign In</CardTitle>
						<CardDescription>
							Create your account for Kanban Board
						</CardDescription>
					</CardHeader>

					<CardContent>
						{/* Email Field */}
						<div className="mb-4">
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

						{/* Password Field */}
						<div className="mb-4">
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
							<p>Sign in</p>
							{isSubmitting && <Loader />}
						</Button>
						<p className="text-sm">
							Don&apos;t have account,{" "}
							<Link href="/register" className="underline">
								Register here
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
