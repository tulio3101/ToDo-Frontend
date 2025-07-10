import "./TaskContainer.css"
import TaskItem from "../TaskItem/TaskItem"

export default function TaskContainer({ tasks, onToggleTask, onDeleteTask }) {
  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)

  return (
    <div className="taskContainer">
      {pendingTasks.length === 0 && completedTasks.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No tasks yet</p>
          <p className="empty-subtitle">Add a task below to get started</p>
        </div>
      ) : (
        <>
          {pendingTasks.length > 0 && (
            <div className="task-section">
              <h3 className="section-title">Pending ({pendingTasks.length})</h3>
              {pendingTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask} />
              ))}
            </div>
          )}

          {completedTasks.length > 0 && (
            <div className="task-section">
              <h3 className="section-title">Completed ({completedTasks.length})</h3>
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}