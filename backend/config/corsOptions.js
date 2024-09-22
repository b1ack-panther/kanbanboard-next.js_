const allowedOrigins = require("./allowedOrigins.js")

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("not allowed by cors"));
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: "include",
	optionsSuccessStatus: 200,
};

module.exports = corsOptions
