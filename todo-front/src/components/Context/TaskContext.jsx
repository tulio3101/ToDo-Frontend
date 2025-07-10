import { createContext, useContext, useState } from "react"

const TaskContext = createContext()

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}

export function TaskProvider({ children }) {
  const [currentView, setCurrentView] = useState("my-day") 
  const [lists, setLists] = useState({
    "my-day": {
      id: "my-day",
      name: "🌞 My Day",
      type: "system",
      tasks: [
        { id: 1, text: "Review emails", completed: false, createdAt: new Date() },
        { id: 2, text: "Do poob project", completed: true, createdAt: new Date() },
      ],
    },
    important: {
      id: "important",
      name: "⭐ Important",
      type: "system",
      tasks: [{ id: 3, text: "Finish calculus homework", completed: false, createdAt: new Date() }],
    },
    planned: {
      id: "planned",
      name: "🗓️ Planned",
      type: "system",
      tasks: [],
    },
    assigned: {
      id: "assigned",
      name: "📌 Assigned to me",
      type: "system",
      tasks: [],
    },
    "flagged-email": {
      id: "flagged-email",
      name: "📬 Flagged Email",
      type: "custom",
      tasks: [],
    },
    tasks: {
      id: "tasks",
      name: "📋 Tasks",
      type: "custom",
      tasks: [
        { id: 4, text: "Read mbda", completed: false, createdAt: new Date() },
        { id: 5, text: "Review code changes", completed: true, createdAt: new Date() },
      ],
    },
    "getting-started": {
      id: "getting-started",
      name: "✔️ Getting Started",
      type: "custom",
      tasks: [],
    },
    groceries: {
      id: "groceries",
      name: "🛒 Groceries",
      type: "custom",
      tasks: [
        { id: 6, text: "Buy milk and bread", completed: false, createdAt: new Date() },
        { id: 7, text: "Buy vegetables", completed: false, createdAt: new Date() },
      ],
    },
  })

  const [taskHistory, setTaskHistory] = useState([])
  const [pomodoroSessions, setPomodoroSessions] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])

  const addTask = (text, dueDate = null) => {
    if (!lists[currentView]) return 

    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date(),
      dueDate,
      listId: currentView,
    }

    setLists((prev) => ({
      ...prev,
      [currentView]: {
        ...prev[currentView],
        tasks: [...prev[currentView].tasks, newTask],
      },
    }))

    setTaskHistory((prev) => [
      {
        id: Date.now() + 1,
        action: "created",
        task: newTask,
        timestamp: new Date(),
        listName: lists[currentView].name,
      },
      ...prev,
    ])
  }

  const toggleTask = (taskId) => {
    if (!lists[currentView]) return

    const task = lists[currentView].tasks.find((t) => t.id === taskId)
    if (!task) return

    setLists((prev) => ({
      ...prev,
      [currentView]: {
        ...prev[currentView],
        tasks: prev[currentView].tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        ),
      },
    }))

    setTaskHistory((prev) => [
      {
        id: Date.now(),
        action: task.completed ? "uncompleted" : "completed",
        task: { ...task, completed: !task.completed },
        timestamp: new Date(),
        listName: lists[currentView].name,
      },
      ...prev,
    ])
  }

  const deleteTask = (taskId) => {
    if (!lists[currentView]) return

    const task = lists[currentView].tasks.find((t) => t.id === taskId)
    if (!task) return

    setLists((prev) => ({
      ...prev,
      [currentView]: {
        ...prev[currentView],
        tasks: prev[currentView].tasks.filter((task) => task.id !== taskId),
      },
    }))

    setTaskHistory((prev) => [
      {
        id: Date.now(),
        action: "deleted",
        task,
        timestamp: new Date(),
        listName: lists[currentView].name,
      },
      ...prev,
    ])
  }

  const addList = (name, emoji = "📝") => {
    const id = name.toLowerCase().replace(/\s+/g, "-")
    const newList = {
      id,
      name: `${emoji} ${name}`,
      type: "custom",
      tasks: [],
    }

    setLists((prev) => ({
      ...prev,
      [id]: newList,
    }))
  }

  const deleteList = (listId) => {
    if (lists[listId]?.type === "system") return

    setLists((prev) => {
      const newLists = { ...prev }
      delete newLists[listId]
      return newLists
    })

    if (currentView === listId) {
      setCurrentView("my-day")
    }
  }

  const addPomodoroSession = (duration, taskText = null) => {
    setPomodoroSessions((prev) => [
      {
        id: Date.now(),
        duration,
        taskText,
        completedAt: new Date(),
        listId: currentView,
      },
      ...prev,
    ])
  }

  const addCalendarEvent = (title, date, time = null) => {
    setCalendarEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        date,
        time,
        createdAt: new Date(),
      },
    ])
  }

  const getCurrentTasks = () => {
    return lists[currentView]?.tasks || []
  }

  const getCurrentListName = () => {
    return lists[currentView]?.name || "My Tasks"
  }

  const getTaskCount = (listId) => {
    return lists[listId]?.tasks.length || 0
  }

  const getCompletedCount = (listId) => {
    return lists[listId]?.tasks.filter((task) => task.completed).length || 0
  }

  const getStatistics = () => {
    const allTasks = Object.values(lists).flatMap((list) => list.tasks)
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter((task) => task.completed).length
    const pendingTasks = totalTasks - completedTasks

    const today = new Date()
    const todayTasks = allTasks.filter((task) => {
      const taskDate = new Date(task.createdAt)
      return taskDate.toDateString() === today.toDateString()
    })

    const thisWeekTasks = allTasks.filter((task) => {
      const taskDate = new Date(task.createdAt)
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      return taskDate >= weekAgo
    })

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      todayTasks: todayTasks.length,
      thisWeekTasks: thisWeekTasks.length,
      pomodoroSessions: pomodoroSessions.length,
      totalPomodoroTime: pomodoroSessions.reduce((total, session) => total + session.duration, 0),
    }
  }

  return (
    <TaskContext.Provider
      value={{
        currentView,
        setCurrentView,
        lists,
        addTask,
        toggleTask,
        deleteTask,
        addList,
        deleteList,
        getCurrentTasks,
        getCurrentListName,
        getTaskCount,
        getCompletedCount,
        taskHistory,
        pomodoroSessions,
        addPomodoroSession,
        calendarEvents,
        addCalendarEvent,
        getStatistics,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
