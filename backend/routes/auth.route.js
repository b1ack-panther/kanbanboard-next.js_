const express = require("express");
const {
	register,
	login,
	refreshToken,
	logout,
} = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/register", register);
router.post("/sign-in", login);
router.get("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;
