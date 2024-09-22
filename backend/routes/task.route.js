const express = require("express");
const taskController = require("../controllers/task.controller.js");
const verifyJWT = require("../middlewares/verifyJWT.middleware.js")

const router = express.Router();

router.use(verifyJWT);

router.get("/", taskController.getTasks);
router.post("/", taskController.createTask);
router.put("/:taskId", taskController.updateTask);
router.delete("/:taskId", taskController.deleteTask);

module.exports = router;
