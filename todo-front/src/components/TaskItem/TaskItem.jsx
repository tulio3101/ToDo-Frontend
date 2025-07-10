import "./TaskItem.css"
import { useState } from "react"

export default function TaskItem({ task, onToggle, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-content">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} className="task-checkbox" />
        <span className="task-text">{task.text}</span>
      </div>

      <div className="task-menu">
        <button className="menu-button" onClick={() => setShowMenu(!showMenu)}> ⋮ </button>
        {showMenu && (
          <div className="menu-dropdown">
            <button
              onClick={() => {
                onToggle(task.id)
                setShowMenu(false)
              }}
            >
              {task.completed ? "↶ Mark incomplete" : "✓ Mark complete"}
            </button>
            <button onClick={() => { onDelete(task.id), setShowMenu(false)}} className="delete-option">
              🗑 Delete task
            </button>
          </div>
        )}
      </div>
    </div>
  )
}