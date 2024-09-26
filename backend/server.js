const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const corsOptions = require("./config/corsOptions.js");
const axios = require("axios")

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

const url = "https://kanbanboard-next-js.onrender.com";
const interval = 30000; 

function reloadWebsite() {
	axios
		.get(url)
		.then((response) => {
			console.log(
				`Reloaded at ${new Date().toISOString()}: Status Code ${
					response.status
				}`
			);
		})
		.catch((error) => {
			console.error(
				`Error reloading at ${new Date().toISOString()}:`,
				error.message
			);
		});
}

setInterval(reloadWebsite, interval);

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
