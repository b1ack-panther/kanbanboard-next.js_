"use client";

import React, { useEffect, useState } from "react";
import { Status, Task } from "@/types-env.d";
import Loader from "./Loader";
import CardColumn from "./CardColumn";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTasks } from "@/store/taskSlice";

export default function CardView() {
	const [cards, setCards] = useState<Task[]>([]);

	const dispatch = useAppDispatch();
	const tasks = useAppSelector((state) => state.task.tasks);

	useEffect(() => {
		dispatch(fetchTasks());
	}, []);

	useEffect(() => {
		setCards(tasks);
	}, [tasks]);

	if (!cards?.length) return <Loader className="w-12 h-12 mx-auto mt-7" />;

	return (
		<div className="min-h-[calc(100vh-78px)]  w-full bg-neutral-900 text-neutral-50">
			<div className="flex max-sm:flex-col max-sm:items-center w-full gap-5 xl:gap-10 max-sm:gap-7 overflow-hidden p-5 md:p-12 justify-center ">
				<CardColumn
					column={Status.TODO}
					headingColor="text-yellow-300"
					cards={cards}
					setCards={setCards}
				/>
				<CardColumn
					column={Status.IN_PROGRESS}
					headingColor="text-blue-300"
					cards={cards}
					setCards={setCards}
				/>
				<CardColumn
					column={Status.COMPLETED}
					headingColor="text-emerald-300"
					cards={cards}
					setCards={setCards}
				/>
			</div>
		</div>
	);
}
