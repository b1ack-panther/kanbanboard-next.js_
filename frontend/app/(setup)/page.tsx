"use client";
import CardView from "@/components/CardView";
import ListView from "@/components/ListView";
import Loader from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Home() {
	const view = useSearchParams().get("view");
	const router = useRouter();
	const auth = useAuth();

	if (!auth || !auth.token) router.push("/sign-in");

	if (view !== "card") router.push("/?view=list");

	return (
			view === "card" ? <CardView /> : <ListView />
	);
}

export default function SuspenseHome() {
	return (
		<Suspense fallback={<Loader className="mx-auto w-12 h-12 mt-10 " />}>
			<Home />
		</Suspense>
	);
}
