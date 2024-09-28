"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { logout } from "@/store/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Suspense } from "react";
import Loader from "./Loader";

function Navbar() {
	const router = useRouter();
	const dispatch = useDispatch();
	const view = useSearchParams().get("view");

	const token = useAuth();
	if (!token) {
		router.push("/sign-in");
	}

	const handleLogout = async () => {
		try {
			dispatch(logout());
			await axios.post(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/logout`);
			setTimeout(() => {
				router.push("/sign-in");
			}, 500);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<nav className="flex sticky top-0 items-center justify-between p-4 bg-zinc-200/90 border-b drop-shadow-md">
			<Link href="#" className="flex max-h-20 items-center">
				<Image
					src="/logo.png"
					alt=""
					height={50}
					width={150}
					className="mix-blend-plus-darker"
				/>
			</Link>
			<div className="flex items-center space-x-3">
				<div className="bg-muted p-1 rounded-md">
					<Button
						variant={view === "card" ? "default" : "secondary"}
						size="icon"
						onClick={() => router.push("/?view=card")}
						aria-label="Card View"
					>
						<LayoutGrid className="h-4 w-4" />
					</Button>
					<Button
						variant={view === "list" ? "default" : "secondary"}
						size="icon"
						onClick={() => router.push("/?view=list")}
						aria-label="List View"
					>
						<List className="h-4 w-4" />
					</Button>
				</div>
				<Button
					variant="secondary"
					onClick={handleLogout}
					aria-label="Logout"
					className="h-10 w-10 p-1 hover:bg-transparent"
				>
					<LogOut className="h-4 w-4" />
				</Button>
			</div>
		</nav>
	);
}


export default function SuspenseNavbar() {
	return (
		<Suspense fallback={<Loader className="mx-auto w-12 h-12 mt-10 " />}>
			<Navbar />
		</Suspense>
	);
}