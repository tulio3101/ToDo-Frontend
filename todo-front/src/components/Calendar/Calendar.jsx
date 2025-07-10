import "./Calendar.css"
import { useState } from "react"
import { useTaskContext } from "../Context/TaskContext"

export default function Calendar() {
  const { calendarEvents, addCalendarEvent, lists } = useTaskContext()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventTime, setNewEventTime] = useState("")

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getEventsForDate = (date) => {
    if (!date) return []
    const dateString = date.toDateString()
    return calendarEvents.filter((event) => new Date(event.date).toDateString() === dateString)
  }

  const getTasksForDate = (date) => {
    if (!date) return []
    const dateString = date.toDateString()
    const allTasks = Object.values(lists).flatMap((list) =>
      list.tasks.filter((task) => task.dueDate && new Date(task.dueDate).toDateString() === dateString),
    )
    return allTasks
  }

  const handleAddEvent = (e) => {
    e.preventDefault()
    if (newEventTitle.trim() && selectedDate) {
      addCalendarEvent(newEventTitle.trim(), selectedDate, newEventTime || null)
      setNewEventTitle("")
      setNewEventTime("")
      setShowAddEvent(false)
    }
  }

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>📅 Calendar</h1>
      </div>

      <div className="calendar-content">
        <div className="calendar-main">
          <div className="calendar-nav">
            <button onClick={() => navigateMonth(-1)} className="nav-btn">
              ‹
            </button>
            <h2>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={() => navigateMonth(1)} className="nav-btn">
              ›
            </button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {daysOfWeek.map((day) => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-days">
              {days.map((day, index) => {
                const events = getEventsForDate(day)
                const tasks = getTasksForDate(day)
                const isToday = day && day.toDateString() === today.toDateString()
                const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString()

                return (
                  <div
                    key={index}
                    className={`calendar-day ${!day ? "empty" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day && (
                      <>
                        <span className="day-number">{day.getDate()}</span>
                        {(events.length > 0 || tasks.length > 0) && (
                          <div className="day-indicators">
                            {events.length > 0 && <div className="event-dot" />}
                            {tasks.length > 0 && <div className="task-dot" />}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="calendar-sidebar">
          {selectedDate && (
            <div className="selected-date-info">
              <h3>
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>

              <div className="date-events">
                <h4>Events</h4>
                {getEventsForDate(selectedDate).map((event) => (
                  <div key={event.id} className="event-item">
                    <span className="event-title">{event.title}</span>
                    {event.time && <span className="event-time">{event.time}</span>}
                  </div>
                ))}

                <h4>Tasks Due</h4>
                {getTasksForDate(selectedDate).map((task) => (
                  <div key={task.id} className="task-item">
                    <span className={`task-title ${task.completed ? "completed" : ""}`}>{task.text}</span>
                  </div>
                ))}

                {showAddEvent ? (
                  <form onSubmit={handleAddEvent} className="add-event-form">
                    <input
                      type="text"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="Event title..."
                      className="event-input"
                      autoFocus
                    />
                    <input
                      type="time"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="time-input"
                    />
                    <div className="form-buttons">
                      <button type="submit" className="save-btn">
                        Add
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => {
                          setShowAddEvent(false)
                          setNewEventTitle("")
                          setNewEventTime("")
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button className="add-event-btn" onClick={() => setShowAddEvent(true)}>
                    + Add Event
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
