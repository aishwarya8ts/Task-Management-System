import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", due_date: "", status: "Pending" });

  // Fetch tasks from Flask API
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/tasks")
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Add new task
  const addTask = async () => {
    if (!newTask.title || !newTask.due_date) {
      alert("Title and Due Date are required!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/task", newTask, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.message === "Task added successfully") {
        setTasks([...tasks, { ...newTask, id: response.data.task_id }]);
        setNewTask({ title: "", description: "", due_date: "", status: "Pending" });
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/task/${id}`);
      if (response.data.message === "Task deleted successfully") {
        setTasks(tasks.filter(task => task.id !== id)); // Update UI
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Task Management System</h2>

      {/* Add Task Form */}
      <div className="mb-3">
        <input type="text" name="title" placeholder="Title" className="form-control mb-2" value={newTask.title} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" className="form-control mb-2" value={newTask.description} onChange={handleChange} />
        <input type="date" name="due_date" className="form-control mb-2" value={newTask.due_date} onChange={handleChange} required />
        <button className="btn btn-success" onClick={addTask}>Add Task</button>
      </div>

      {/* Display Tasks */}
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task.id} className="list-group-item d-flex justify-content-between">
            <span>
              <strong>{task.title}</strong> - {task.description} (Due: {task.due_date}) - <em>{task.status}</em>
            </span>
            <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
