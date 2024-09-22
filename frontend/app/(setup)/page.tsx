"use client";
import CardView from "@/components/CardView";
import ListView from "@/components/ListView";
import Loader from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Home() {
	const view = useSearchParams().get("view");
	const router = useRouter();
	const auth = useAuth();

	if (!auth || !auth.token) router.push("/sign-in");

	if (view !== "card" && view !== "list") router.push("/?view=list");

	return (
		<Suspense fallback={<Loader className="w-10 h-10 mt-10 mx-auto" />}>
			{view === "card" ? <CardView /> : <ListView />}
		</Suspense>
	);
}
