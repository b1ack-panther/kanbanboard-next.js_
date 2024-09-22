import { Task } from "@/types-env.d";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { makeStore } from "./store";

const store = makeStore();
store.subscribe(listener);

function listener() {
	const token = store.getState().auth.token;
	api.defaults.headers.common["Authorization"] = token;
}

export const getToken = () => {
	const token = localStorage.getItem("token")
		? localStorage.getItem("token") ?? ""
		: null;
	return token;
};

export const getAuthorizationHeader = () => `Bearer ${getToken()}`;

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN,
	headers: { Authorization: getAuthorizationHeader() },
});

interface TaskState {
	tasks: Task[];
	loading: boolean;
	error: string | null;
}

const initialState: TaskState = {
	tasks: [],
	loading: false,
	error: null,
};

// Async thunk to fetch tasks from the API
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
	const response = await api.get("/task");
	return response.data; // The data should be an array of tasks
});

// Async thunk to create a new task in the database
export const createTask = createAsyncThunk(
	"tasks/createTask",
	async (newTask: Omit<Task, "_id">) => {
		const response = await api.post("/task", newTask);
		return response.data; // Return the created task
	}
);

// Async thunk to update a task in the database
export const updateTask = createAsyncThunk(
	"tasks/updateTask",
	async (updatedTask: Partial<Task>) => {
		const { _id, ...taskData } = updatedTask;
		const response = await api.put(`/task/${_id}`, taskData);
		return response.data; // Return the updated task
	}
);

// Async thunk to delete a task from the database
export const deleteTask = createAsyncThunk(
	"tasks/deleteTask",
	async (taskId: string) => {
		await api.delete(`/task/${taskId}`);
		return taskId; // Return the deleted task ID
	}
);

const taskSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Handle fetchTasks actions
		builder.addCase(fetchTasks.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(
			fetchTasks.fulfilled,
			(state, action: PayloadAction<Task[]>) => {
				state.loading = false;
				state.tasks = action.payload;
			}
		);
		builder.addCase(fetchTasks.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || "Failed to fetch tasks";
		});

		// Handle createTask actions
		builder.addCase(createTask.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(
			createTask.fulfilled,
			(state, action: PayloadAction<Task>) => {
				state.loading = false;
				state.tasks.push(action.payload); // Add the new task to the state
			}
		);
		builder.addCase(createTask.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || "Failed to create task";
		});

		// Handle updateTask actions
		builder.addCase(updateTask.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(
			updateTask.fulfilled,
			(state, action: PayloadAction<Task>) => {
				state.loading = false;
				const index = state.tasks.findIndex(
					(task) => task._id === action.payload._id
				);
				if (index !== -1) {
					state.tasks[index] = action.payload; // Update the task in the state
				}
			}
		);
		builder.addCase(updateTask.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || "Failed to update task";
		});

		// Handle deleteTask actions
		builder.addCase(deleteTask.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(
			deleteTask.fulfilled,
			(state, action: PayloadAction<string>) => {
				state.loading = false;
				state.tasks = state.tasks.filter((task) => task._id !== action.payload); // Remove the task
			}
		);
		builder.addCase(deleteTask.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || "Failed to delete task";
		});
	},
});

export default taskSlice.reducer;
