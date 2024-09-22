"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { logout } from "@/store/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { useAxios } from "@/hooks/axios";
import { useDispatch } from "react-redux";

export default function Navbar() {
	const router = useRouter();
	const dispatch = useDispatch();
	const view = useSearchParams().get("view");
	const axios = useAxios();

	const token = useAuth();
	if (!token) {
		router.push("/sign-in");
	}

	const handleLogout = async () => {
		try {
			dispatch(logout());
			await axios.post("/auth/logout");
			router.push("/sign-in");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<nav className="flex sticky top-0 items-center justify-between p-4 bg-background border-b drop-shadow-md">
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
