import './TaskBar.css'
import { useState } from 'react';

export default function TaskBar({ onAddTask }) {
  const [newTaskText, setNewTaskText] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim())
      setNewTaskText("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="taskBar">
      <input
        type="text"
        placeholder="Add a new task..."
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
        className="task-input"
      />
      <button type="submit" disabled={!newTaskText.trim()} className="add-button">
        +
      </button>
    </form>
  )
}