import React from "react";
import { TableCell, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { getDate } from "@/lib/getDate";
import { useAppDispatch } from "@/store/hooks";
import { deleteTask } from "@/store/taskSlice";
import { Task } from "@/types-env.d";

type ListViewItemProps = {
	task: Task;
	handleEdit: () => void;
};

const ListViewItem = ({ task, handleEdit }: ListViewItemProps) => {
	const dispatch = useAppDispatch();
	const handleDelete = (id: string) => {
		dispatch(deleteTask(id));
	};

	return (
		<TableRow key={task._id}>
			<TableCell className="line-clamp-1">{task.title}</TableCell>
			<TableCell>{task.status}</TableCell>
			<TableCell>{task.priority}</TableCell>
			<TableCell className="max-md:hidden">{getDate(task.dueDate)}</TableCell>
			<TableCell className="whitespace-nowrap">
				<Button
					onClick={handleEdit}
					className="mr-2 md:h-10 md:rounded-md md:px-5 md:text-sm"
					size="sm"
				>
					Edit
				</Button>
				<Button
					variant="destructive"
					onClick={() => handleDelete(task._id)}
					className="md:h-10 md:rounded-md md:px-5 md:text-sm"
					size="sm"
				>
					Delete
				</Button>
			</TableCell>
		</TableRow>
	);
};

export default ListViewItem;
