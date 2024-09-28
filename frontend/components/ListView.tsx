"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableHeader,
	TableRow,
	TableCell,
	TableBody,
} from "@/components/ui/table";
import TaskModal from "./TaskModal";
import ListViewItem from "./ListViewItem";
import { Task } from "@/types-env";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTasks } from "@/store/taskSlice";

export default function TaskListView() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [filterStatus, setFilterStatus] = useState<string>("none");
	const [filterPriority, setFilterPriority] = useState<string>("none");
	const [sortByDate, setSortByDate] = useState<string>("");

	const dispatch = useAppDispatch();

	const sliceTasks = useAppSelector((state) => state.task.tasks);

	useEffect(() => {
		dispatch(fetchTasks());
	}, []);

	useEffect(() => {
		setTasks(sliceTasks);
	}, [sliceTasks]);

	const filteredTasks = tasks
		.filter((task) =>
			filterStatus !== "none" ? task.status === filterStatus : true
		)
		.filter((task) =>
			filterPriority !== "none" ? task.priority === filterPriority : true
		)
		.sort((a, b) => {
			if (sortByDate === "asc")
				return (a.dueDate || "") > (b.dueDate || "") ? 1 : -1;
			if (sortByDate === "desc")
				return (a.dueDate || "") < (b.dueDate || "") ? 1 : -1;
			return 0;
		});

	return (
		<div className="container mx-auto py-10 ">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold mx-2">Task List</h1>
				<Button
					onClick={() => {
						setSelectedTask(null);
						setDialogOpen(true);
					}}
				>
					Add Task
				</Button>
			</div>

			{/* Filters */}
			<div className="mb-4 flex gap-4 max-md:gap-2 mx-2 ">
				{/* Filter by Status */}
				<Select  onValueChange={setFilterStatus}>
					<SelectTrigger className="max-w-[180px] bg-white">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Status</SelectLabel>
							<SelectItem value="none">All</SelectItem>
							<SelectItem value="To Do">To Do</SelectItem>
							<SelectItem value="In Progress">In Progress</SelectItem>
							<SelectItem value="Completed">Completed</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>

				{/* Filter by Priority */}
				<Select onValueChange={setFilterPriority}>
					<SelectTrigger className="max-w-[180px] bg-white">
						<SelectValue placeholder="Priority" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Priority</SelectLabel>
							<SelectItem value="none">All</SelectItem>
							<SelectItem value="Low">Low</SelectItem>
							<SelectItem value="Medium">Medium</SelectItem>
							<SelectItem value="High">High</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>

				{/* Sort by Due Date */}
				<Select onValueChange={setSortByDate}>
					<SelectTrigger className="max-w-[180px] bg-white">
						<SelectValue placeholder="Due Date" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Due Date</SelectLabel>
							<SelectItem value="asc">Ascending</SelectItem>
							<SelectItem value="desc">Descending</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			{/* Task Table */}
			<Table className="text-center capitalize">
				<TableHeader className="font-semibold text-lg text-center">
					<TableRow>
						<TableCell>Title</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Priority</TableCell>
						<TableCell className="max-md:hidden">Due Date</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredTasks.map((task) => (
						<ListViewItem
							key={task._id}
							task={task}
							handleEdit={() => {
								setSelectedTask(task);
								setDialogOpen(true);
							}}
						/>
					))}
				</TableBody>
			</Table>

			{/* Task Modal */}
			<TaskModal
				isOpen={isDialogOpen}
				onClose={() => {
					setSelectedTask(null);
					setDialogOpen(false);
				}}
				task={selectedTask}
			/>
		</div>
	);
}
