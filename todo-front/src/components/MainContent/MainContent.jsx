import { useTaskContext } from "../Context/TaskContext"
import TaskPanel from "../TaskPanel/TaskPanel"
import History from "../History/History"
import Statistics from "../Statistic/Statistic"
import Calendar from "../Calendar/Calendar"
import Pomodoro from "../Pomodoro/Pomodoro"

export default function MainContent() {
  const { currentView, lists } = useTaskContext()

  const renderContent = () => {
    switch (currentView) {
      case "history":
        return <History />
      case "statistics":
        return <Statistics />
      case "calendar":
        return <Calendar />
      case "pomodoro":
        return <Pomodoro />
      default:
        if (lists[currentView]) {
          return <TaskPanel />
        }
        return <TaskPanel />
    }
  }

  return <div style={{ flex: 1 }}>{renderContent()}</div>
}
