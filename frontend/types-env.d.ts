export enum Status {
	TODO = "To Do",
	IN_PROGRESS = "In Progress",
	COMPLETED = "Completed",
}

export enum Priority {
	LOW = "Low",
	MEDIUM = "Medium",
	HIGH = "High",
}

export type Task = {
	_id: string;
	title: string;
	description?: string;
	status: Status;
	priority: Priority;
	dueDate?: Date;
};
