"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { Priority, Status, Task } from "@/types-env";
import { useAppDispatch } from "@/store/hooks";
import { createTask, updateTask } from "@/store/taskSlice";

export const taskSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	status: z.enum(["To Do", "In Progress", "Completed"]),
	priority: z.enum(["Low", "Medium", "High"]),
	dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	task: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
	const form = useForm<TaskFormData>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			title: "",
			description: "",
			status: "To Do",
			priority: "Low",
			dueDate: new Date().toISOString().split("T")[0],
		},
	});

	useEffect(() => {
		if (task) {
			if (task.title) form.setValue("title", task.title);
			if (task.description) form.setValue("description", task.description);
			if (task.status) form.setValue("status", task.status);
			if (task.priority) form.setValue("priority", task.priority);
			if (task.dueDate)
				form.setValue(
					"dueDate",
					new Date(task.dueDate).toISOString().split("T")[0]
				);
		}
	}, [form, task]);

	const dispatch = useAppDispatch();

	const handleFormSubmit = async (data: TaskFormData) => {
		if (task)
			dispatch(
				updateTask({
					...data,
					_id: task._id,
					dueDate: new Date(data?.dueDate ?? ""),
				} as Task)
			);
		else dispatch(createTask(task as Omit<Task, "_id">));
		form.reset();
		onClose();
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={() => {
				form.reset();
				onClose();
			}}
		>
			<DialogContent className=" text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl font-bold text-center">
						{task ? "Edit Task" : "Create Task"}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						autoComplete="off"
						onSubmit={form.handleSubmit(handleFormSubmit)}
						className="space-y-6 px-6"
					>
						{/* Title Field */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Task Title</FormLabel>
									<FormControl>
										<Input
											{...field}
											defaultValue={task?.title}
											placeholder="Enter task title"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Description Field */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Task Description</FormLabel>
									<FormControl>
										<Input
											{...field}
											defaultValue={task?.description}
											placeholder="Enter task description"
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						{/* Status Select */}
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={task ? task?.status : field.value}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select Status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="To Do">To Do</SelectItem>
											<SelectItem value="In Progress">In Progress</SelectItem>
											<SelectItem value="Completed">Completed</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Priority Select */}
						<FormField
							control={form.control}
							name="priority"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Priority</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={task ? task.priority : field.value}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select Priority" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Low">Low</SelectItem>
											<SelectItem value="Medium">Medium</SelectItem>
											<SelectItem value="High">High</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="dueDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Due Date</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="date"
											value={field?.value?.split("T")[0]}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button className="mb-5" type="submit" variant="default">
								{task ? "Save Changes" : "Create Task"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default TaskModal;
