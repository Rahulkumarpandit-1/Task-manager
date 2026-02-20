const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task=require("./models/task");  
const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb://127.0.0.1:27017/taskmanager";
const PORT = 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch(err => {
    console.error("Connection Failed ❌", err);
  });
  app.get("/api/tasks", async (req, res) => {
   const tasks=await Task.find();
   res.json(tasks);
  })

app.post("/api/tasks", async (req, res) => {
  try {
    const task = new Task({ title: req.body.title });
    const savedTask = await task.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 app.put("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.status = req.body.status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});