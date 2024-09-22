const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.model.js");

const setCookieOptions = {
	httpOnly: true,
	// secure: process.env.NODE_ENV === "production",
	expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
	path: "/",
};

const createTokens = (user) => {
	const accessToken = jwt.sign(
		{ id: user._id, fullName: user.fullName, email: user.email },
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "1d",
		}
	);
	const refreshToken = jwt.sign(
		{ id: user._id },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: "7d" }
	);
	return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
	const { fullName, email, password } = req.body;

	if ([fullName, email, password].some((field) => !field)) {
		return res.status(401).json({ error: "All fields are required" });
	}
	try {
		const exists = await User.findOne({ email });
		if (exists) return res.status(401).json({ error: "Email already exists" });
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await User.create({
			fullName,
			email,
			password: hashedPassword,
		});

		const { accessToken, refreshToken } = createTokens(user);

		res.cookie("refreshToken", refreshToken, setCookieOptions);

		return res.status(201).json({
			accessToken,
		});
	} catch (error) {
		res.status(400).json({ error: error?.message });
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(401).json({ error: "All fields are required" });
	}

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}
		const isPasswordCorrect = await bcrypt.compare(password, user?.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		const { accessToken, refreshToken } = createTokens(user);

		return res
			.cookie("refreshToken", refreshToken, setCookieOptions)
			.status(200)
			.json({
				accessToken,
			});
	} catch (error) {
		res.status(400).json({ error: error?.message });
	}
};

exports.refreshToken = async (req, res) => {
	console.log(req.cookies);
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) {
		return res.status(401).json({ error: "No refresh token found" });
	}

	try {
		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

		const user = await User.findById(decoded.id);
		if (!user) throw Error;

		const newAccessToken = jwt.sign(
			{ id: user._id, fullName: user.fullName, email: user.email },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "1d" }
		);

		return res.status(200).json({ accessToken: newAccessToken });
	} catch (error) {
		return res.status(403).json({ error: "Invalid or expired refresh token" });
	}
};

exports.logout = (req, res) => {
	try {
		res.clearCookie("refreshToken");
		return res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		return res.status(500).json({ error: "Logout failed" });
	}
};
