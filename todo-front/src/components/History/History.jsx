import "./History.css"
import { useTaskContext } from "../Context/TaskContext"

export default function History() {
  const { taskHistory } = useTaskContext()

  const getActionIcon = (action) => {
    switch (action) {
      case "created":
        return "➕"
      case "completed":
        return "✅"
      case "uncompleted":
        return "↶"
      case "deleted":
        return "🗑️"
      default:
        return "📝"
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case "created":
        return "#22c55e"
      case "completed":
        return "#3b82f6"
      case "uncompleted":
        return "#f59e0b"
      case "deleted":
        return "#dc2626"
      default:
        return "#6b7280"
    }
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>📜 Task History</h1>
      </div>

      <div className="history-content">
        {taskHistory.length === 0 ? (
          <div className="empty-history">
            <p>No activity yet...</p>
          </div>
        ) : (
          <div className="history-timeline">
            {taskHistory.map((entry) => (
              <div key={entry.id} className="history-item">
                <div className="history-icon" style={{ backgroundColor: getActionColor(entry.action) }}>
                  {getActionIcon(entry.action)}
                </div>
                <div className="history-details">
                  <div className="history-main">
                    <span className="history-action">{entry.action}</span>
                    <span className="history-task">"{entry.task.text}"</span>
                    <span className="history-list">in {entry.listName}</span>
                  </div>
                  <div className="history-time">{formatTime(entry.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
