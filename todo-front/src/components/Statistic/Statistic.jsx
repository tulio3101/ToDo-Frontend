import "./Statistic.css"
import { useTaskContext } from '../Context/TaskContext'

export default function Statistics() {
  const { getStatistics, lists, pomodoroSessions } = useTaskContext()
  const stats = getStatistics()

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getListStats = () => {
    return Object.values(lists).map((list) => ({
      name: list.name,
      total: list.tasks.length,
      completed: list.tasks.filter((task) => task.completed).length,
      completion:
        list.tasks.length > 0
          ? Math.round((list.tasks.filter((task) => task.completed).length / list.tasks.length) * 100)
          : 0,
    }))
  }

  const listStats = getListStats()

  return (
    <div className="statistics-container">
      <div className="statistics-header">
        <h1>📊 Statistics</h1>
        <p>Your productivity insights</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.completedTasks}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingTasks}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>{stats.completionRate}%</h3>
            <p>Completion Rate</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌅</div>
          <div className="stat-info">
            <h3>{stats.todayTasks}</h3>
            <p>Today's Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🍅</div>
          <div className="stat-info">
            <h3>{stats.pomodoroSessions}</h3>
            <p>Pomodoro Sessions</p>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Lists Overview</h3>
          <div className="list-stats">
            {listStats.map((list, index) => (
              <div key={index} className="list-stat-item">
                <div className="list-stat-header">
                  <span className="list-name">{list.name}</span>
                  <span className="list-percentage">{list.completion}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${list.completion}%` }} />
                </div>
                <div className="list-numbers">
                  {list.completed}/{list.total} tasks completed
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Pomodoro Summary</h3>
          <div className="pomodoro-stats">
            <div className="pomodoro-total">
              <span className="big-number">{formatTime(stats.totalPomodoroTime)}</span>
              <span className="label">Total Focus Time</span>
            </div>
            <div className="pomodoro-average">
              <span className="medium-number">
                {stats.pomodoroSessions > 0
                  ? formatTime(Math.round(stats.totalPomodoroTime / stats.pomodoroSessions))
                  : "0m"}
              </span>
              <span className="label">Average Session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
