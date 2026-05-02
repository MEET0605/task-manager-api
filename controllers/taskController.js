const mongoose = require("mongoose");
const Task = require("../models/taskModel");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, category } = req.body;

    //  Title validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    //  Due date validation (NEW)
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const inputDate = new Date(dueDate);
      inputDate.setHours(0, 0, 0, 0);


      if (inputDate < today) {
        return res.status(400).json({
          success: false,
          message: "Due date cannot be in the past"
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      category
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL TASKS
exports.getTasks = async (req, res) => {
  try {
    const { completed, page = 1, limit = 5 } = req.query;

    let query = {};

    if (completed !== undefined) {
      query.completed = completed === "true";
    }

    const tasks = await Task.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.json({
        success: true,
        count: total,
        data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    //  CHECK INVALID ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Task ID",
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { dueDate } = req.body;

    // title validation
    if (req.body.title === "") {
  return res.status(400).json({
    success: false,
    message: "Title cannot be empty"
  });
}

    // ID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Task ID",
      });
    }

    // Due date validation
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const inputDate = new Date(dueDate);
      inputDate.setHours(0, 0, 0, 0);

      if (inputDate < today) {
        return res.status(400).json({
          success: false,
          message: "Due date cannot be in the past"
        });
      }
    }

    const task = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.json({
      success: true,
      data: task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// MARK COMPLETE
exports.markComplete = async (req, res) => {
  try {
    const { id } = req.params;

    // ID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Task ID",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    if (task.completed) {
      return res.status(400).json({
        success: false,
        message: "Task already completed"
      });
    }

    task.completed = true;
    await task.save();

    res.json({
      success: true,
      data: task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};