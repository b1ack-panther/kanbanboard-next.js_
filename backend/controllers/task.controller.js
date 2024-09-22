const Task = require("../models/Task.model.js");

exports.getTasks = async (req, res) => {
	try {
		const tasks = await Task.find({ userId: req.id });
		return res.status(200).json(tasks);
	} catch (error) {
		return res.status(400).json({ error: "Failed to fetch tasks" });
	}
};

exports.createTask = async (req, res) => {
	const { title, description, priority, dueDate, status } = req.body;

	if (!title) {
		return res.status(401).json({ error: "Task title is required." });
	}

	const taskData = {
		title,
		userId: req.id,
	};

	if (description) taskData.description = description;
	if (priority) taskData.priority = priority;
	if (dueDate) taskData.dueDate = dueDate;
	if (status) taskData.status = status;

	try {
		const task = await Task.create(taskData);

		return res.status(201).json(task);
	} catch (error) {
		return res.status(400).json({ error: "Failed to create task" });
	}
};

exports.updateTask = async (req, res) => {
	const { taskId } = req.params;
	const task = req.body;

	if (!taskId) {
		return res.status(400).json({ error: "Task id not found" });
	}

	try {
		const updatedTask = await Task.findByIdAndUpdate(taskId, task, {
			new: true,
		});
		return res.status(200).json(updatedTask);
	} catch (error) {
		return res.status(400).json({ error: error?.message });
	}
};

exports.deleteTask = async (req, res) => {
	const { taskId } = req.params;
	try {
		const data = await Task.findByIdAndDelete(taskId);

		return res.status(204).json(data);
	} catch (error) {
		return res.status(400).json({ error: "Failed to delete task" });
	}
};
