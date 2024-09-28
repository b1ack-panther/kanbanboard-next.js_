import { Status, Task } from "@/types-env.d";
import CustomSeperator from "./ui/CustomSeperator";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getDate } from "@/lib/getDate";

type CardProps = {
	card: Task;
	handleDragStart: (e: React.DragEvent, card: Task) => void;
	column: Status;
};

const TaskCard = ({ handleDragStart, column, card }: CardProps) => {
	return (
		<>
			<CustomSeperator beforeId={card._id} column={column} />
			<div
				draggable="true"
				onDragStart={(e: React.DragEvent) => handleDragStart(e, card)}
				className="cursor-grab  active:cursor-grabbing"
			>
				<Card className=" border-none bg-neutral-800/50 backdrop-blur-[2px]  p-3 md:p-6 font-mono border-neutral-700 rounded border">
					<CardHeader className="text-xl md:text-3xl font-mono font-bold text-white capitalize p-0 pb-5">
						<CardTitle>{card.title}</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-neutral-100/10 px-0">
						<CardDescription className="text-neutral-100 capitalize font-mono">
							{card.description}
						</CardDescription>
					</CardContent>
					<CardFooter className="p-0 flex justify-between text-neutral-300">
						<span>{card.priority}</span>
						<span>{getDate(card.dueDate)}</span>
					</CardFooter>
				</Card>
			</div>
		</>
	);
};

export default TaskCard;

// components/TaskCard.tsx
// "use client";

// import {
// 	Card,
// 	CardHeader,
// 	CardTitle,
// 	CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { PlusIcon } from "lucide-react";
// import { motion } from "framer-motion";
// import CustomSeperator from "./ui/CustomSeperator";
// import { Task } from "@/types-env.d";

// interface TaskCardProps {
// 	// _id: string;
// 	// title: string;
// 	// description?: string;
// 	// status: "To Do" | "In Progress" | "Completed";
// 	// priority: "Low" | "Medium" | "High";
// 	// dueDate?: Date;
// 	card: Task;
// 	column: string;
// 	handleDragStart: (event: React.DragEvent, card: Task) => void;
// }

// const TaskCard: React.FC<TaskCardProps> = ({
// 	card,
// 	column,
// 	handleDragStart,
// }) => {
// 	return (
// 		<>
// 			<CustomSeperator beforeId={card._id} column={column} />
// 			<Card
// 				draggable
// 				onDragStart={(e) => handleDragStart(e, card)}
// 				className="mb-3 cursor-grab bg-neutral-800 hover:bg-neutral-700 text-neutral-50"
// 			>
// 				<CardHeader>
// 					<CardTitle>{card.title}</CardTitle>
// 					{card?.description && (
// 						<CardDescription>{card.description}</CardDescription>
// 					)}
// 				</CardHeader>
// 				<div className="px-4 pb-4">
// 					<p className="text-xs text-neutral-400">
// 						Status: <span className="capitalize">{card.status}</span>
// 					</p>
// 					<p className="text-xs text-neutral-400">
// 						Priority: <span className="capitalize">{card.priority}</span>
// 					</p>
// 					{card.dueDate && (
// 						<p className="text-xs text-neutral-400">
// 							Due Date: {new Date(card.dueDate).toLocaleDateString()}
// 						</p>
// 					)}
// 				</div>
// 			</Card>
// 		</>
// 	);
// };

// export default TaskCard;
