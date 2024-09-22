const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const corsOptions = require("./config/corsOptions.js");

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/auth", require("./routes/auth.route.js"));
app.use("/task", require("./routes/task.route.js"));

app.get("/", (req, res) => {
	return res.json({ message: "TODO app server is running" });
});

const PORT = process.env.PORT || 5000;

mongoose
	.connect(process.env.MONGO_URI)
	.then(() =>
		app.listen(PORT, () => {
			console.log(`Connected to databse. Server running on port ${PORT}`);
		})
	)
	.catch((err) => console.log(err));
