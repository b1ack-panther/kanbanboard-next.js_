"use client";
import CardView from "@/components/CardView";
import ListView from "@/components/ListView";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Home() {
	const view = useSearchParams().get("view");
	const router = useRouter();
	const auth = useAuth();

	if (!auth || !auth.token) router.push("/sign-in");

	if (view !== "card" && view !== "list") router.push("/sign-in");
	else if (view == "card") return <CardView />;
	return <ListView />;
}

export default function SuspenseHome() {
	return (
		<Suspense>
			<Home />
		</Suspense>
	);
}
