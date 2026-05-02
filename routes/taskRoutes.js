const { updateTask } = require("../controllers/taskController");

const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  deleteTask,
  markComplete
} = require("../controllers/taskController");

router.put("/:id", updateTask);
router.post("/", createTask);
router.get("/", getTasks);
router.delete("/:id", deleteTask);
router.patch("/:id/complete", markComplete);

module.exports = router;