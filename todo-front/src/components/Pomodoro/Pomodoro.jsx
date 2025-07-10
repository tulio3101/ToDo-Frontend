import "./Pomodoro.css"
import { useState, useEffect, useRef } from "react"
import { useTaskContext } from "../Context/TaskContext"

export default function Pomodoro() {
  const { addPomodoroSession, getCurrentTasks } = useTaskContext()

  const [timeLeft, setTimeLeft] = useState(25 * 60) 
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState("work")
  const [sessions, setSessions] = useState(0)
  const [selectedTask, setSelectedTask] = useState("")
  const [customTime, setCustomTime] = useState(25)

  const intervalRef = useRef(null)
  const tasks = getCurrentTasks()

  const modes = {
    work: { duration: customTime * 60, label: "Work Time", emoji: "🍅" },
    shortBreak: { duration: 5 * 60, label: "Short Break", emoji: "☕" },
    longBreak: { duration: 15 * 60, label: "Long Break", emoji: "🛋️" },
  }

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)

    if (mode === "work") {
      setSessions((prev) => prev + 1)
      addPomodoroSession(customTime, selectedTask || null)

      const newMode = (sessions + 1) % 4 === 0 ? "longBreak" : "shortBreak"
      setMode(newMode)
      setTimeLeft(modes[newMode].duration)
    } else {
      setMode("work")
      setTimeLeft(modes.work.duration)
    }

    if (Notification.permission === "granted") {
      new Notification(`${modes[mode].label} completed!`, {
        body: mode === "work" ? "Time for a break!" : "Ready to work?",
        icon: "/placeholder.svg?height=64&width=64",
      })
    }
  }

  const startTimer = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission()
    }
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(modes[mode].duration)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setTimeLeft(modes[newMode].duration)
    setIsRunning(false)
  }

  const updateCustomTime = (minutes) => {
    setCustomTime(minutes)
    if (mode === "work") {
      setTimeLeft(minutes * 60)
      modes.work.duration = minutes * 60
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    const totalTime = modes[mode].duration
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-header">
        <h1>🍅 Pomodoro Timer</h1>
      </div>

      <div className="pomodoro-content">
        <div className="timer-main">
          <div className="mode-selector">
            {Object.entries(modes).map(([key, modeData]) => (
              <button key={key} className={`mode-btn ${mode === key ? "active" : ""}`} onClick={() => switchMode(key)}>
                {modeData.emoji} {modeData.label}
              </button>
            ))}
          </div>

          <div className="timer-circle">
            <svg className="progress-ring" width="300" height="300">
              <circle className="progress-ring-background" cx="150" cy="150" r="140" />
              <circle
                className="progress-ring-progress"
                cx="150"
                cy="150"
                r="140"
                style={{
                  strokeDasharray: `${2 * Math.PI * 140}`,
                  strokeDashoffset: `${2 * Math.PI * 140 * (1 - getProgress() / 100)}`,
                }}
              />
            </svg>
            <div className="timer-display">
              <div className="time-text">{formatTime(timeLeft)}</div>
              <div className="mode-text">{modes[mode].label}</div>
            </div>
          </div>

          <div className="timer-controls">
            {!isRunning ? (
              <button className="control-btn start" onClick={startTimer}>
                ▶️ Start
              </button>
            ) : (
              <button className="control-btn pause" onClick={pauseTimer}>
                ⏸️ Pause
              </button>
            )}
            <button className="control-btn reset" onClick={resetTimer}>
              🔄 Reset
            </button>
          </div>

          {mode === "work" && (
            <div className="task-selector">
              <label htmlFor="task-select">Working on:</label>
              <select
                id="task-select"
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="task-select"
              >
                <option value="">Select a task (optional)</option>
                {tasks
                  .filter((task) => !task.completed)
                  .map((task) => (
                    <option key={task.id} value={task.text}>
                      {task.text}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        <div className="pomodoro-sidebar">
          <div className="settings-card">
            <h3>⚙️ Settings</h3>
            <div className="setting-item">
              <label>Work Duration (minutes):</label>
              <input
                type="number"
                min="1"
                max="60"
                value={customTime}
                onChange={(e) => updateCustomTime(Number.parseInt(e.target.value) || 25)}
                className="time-input"
              />
            </div>
          </div>

          <div className="stats-card">
            <h3>📊 Today's Stats</h3>
            <div className="stat-item">
              <span className="stat-label">Sessions completed:</span>
              <span className="stat-value">{sessions}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Focus time:</span>
              <span className="stat-value">{sessions * customTime}m</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Current streak:</span>
              <span className="stat-value">{sessions}</span>
            </div>
          </div>

          <div className="tips-card">
            <h3>💡 Pomodoro Tips</h3>
            <ul className="tips-list">
              <li>Focus on one task at a time</li>
              <li>Take breaks seriously</li>
              <li>Eliminate distractions</li>
              <li>Track your progress</li>
              <li>Adjust timing to your needs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
