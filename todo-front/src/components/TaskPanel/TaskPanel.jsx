import './TaskPanel.css';
import TaskBar from '../TaskBar/TaskBar';
import TaskContainer from '../TaskContainer/TaskContainer';
import { useState } from "react";
import { useTaskContext } from "../Context/TaskContext";

export default function TaskPanel() {
  const {
    addTask,
    toggleTask,
    deleteTask,
    getCurrentTasks,
    getCurrentListName,
    currentList,
    getTaskCount,
    getCompletedCount,
  } = useTaskContext()

  const tasks = getCurrentTasks()
  const listName = getCurrentListName()
  const taskCount = getTaskCount(currentList)
  const completedCount = getCompletedCount(currentList)

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="taskPanel">
      <h1>{listName}</h1>
      <p>{date}</p>
      <div className="task-container">
        <TaskContainer tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
      </div>
      <div className="task-bar">
        <TaskBar onAddTask={addTask} />
      </div>
    </div>
  )
}
