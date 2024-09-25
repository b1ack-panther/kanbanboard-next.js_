import { Task } from "@/types-env.d";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const setAuthorizationHeader = (token: string | null) => {
	if (token) {
		api.defaults.headers.Authorization = `Bearer ${token}`;
	} else {
		delete api.defaults.headers.Authorization;
	}
};

export const getToken = () => {
	const token =
		typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : null;
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

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
	const response = await api.get("/task");
	return response.data;
});

export const createTask = createAsyncThunk(
	"tasks/createTask",
	async (newTask: Omit<Task, "_id">) => {
		const response = await api.post("/task", newTask);
		return response.data;
	}
);

export const updateTask = createAsyncThunk(
	"tasks/updateTask",
	async (updatedTask: Partial<Task>) => {
		const { _id, ...taskData } = updatedTask;
		const response = await api.put(`/task/${_id}`, taskData);
		return response.data;
	}
);

export const deleteTask = createAsyncThunk(
	"tasks/deleteTask",
	async (taskId: string) => {
		await api.delete(`/task/${taskId}`);
		return taskId;
	}
);

const taskSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {
		setTasks: (state, action) => {
			state.tasks = action.payload;
		},
	},
	extraReducers: (builder) => {
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

		builder.addCase(createTask.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(
			createTask.fulfilled,
			(state, action: PayloadAction<Task>) => {
				state.loading = false;
				state.tasks.push(action.payload);
			}
		);
		builder.addCase(createTask.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || "Failed to create task";
		});

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
					state.tasks[index] = action.payload;
				}
			}
		);
		builder.addCase(updateTask.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || "Failed to update task";
		});

		builder.addCase(deleteTask.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(
			deleteTask.fulfilled,
			(state, action: PayloadAction<string>) => {
				state.loading = false;
				state.tasks = state.tasks.filter((task) => task._id !== action.payload);
			}
		);
		builder.addCase(deleteTask.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || "Failed to delete task";
		});
	},
});

export default taskSlice.reducer;
export const { setTasks } = taskSlice.actions;
