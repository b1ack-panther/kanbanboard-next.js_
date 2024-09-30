"use client";

import React, { useEffect, useState } from "react";
import { Status, Task } from "@/types-env.d";
import Loader from "./Loader";
import CardColumn from "./CardColumn";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTasks } from "@/store/taskSlice";

export default function CardView() {
	const [cards, setCards] = useState<Task[]>(null);

	const dispatch = useAppDispatch();
	const tasks = useAppSelector((state) => state.task.tasks);

	useEffect(() => {
		dispatch(fetchTasks());
	}, []);

	useEffect(() => {
		setCards(tasks);
	}, [tasks]);

	
	if (!cards) return <Loader className="w-12 h-12 mx-auto mt-7" />;
	if(!cards?.length)return <h1 className=" w-full text-center text-3xl mt-5 p-5 bg-muted-foreground/20 font-mono">No Task found</h1>

	return (
		<div className="min-h-[calc(100vh-78px)] card-view  w-full  text-neutral-50">
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
