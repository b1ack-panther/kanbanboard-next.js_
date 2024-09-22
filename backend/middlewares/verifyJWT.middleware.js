const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ error: "Access denied" });

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.id = decoded.id;
		next();
	} catch (error) {
		res.status(403).json({ error: "Forbidden" });
	}
};

module.exports = verifyJWT;
