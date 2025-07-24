import "./GroupsSideBar.css"
import { useState } from "react"
import { useTaskContext } from "../Context/TaskContext"
import axios from "axios"



export default function GroupsSideBar() {
  const { currentView, setCurrentView, lists, addList, deleteList, getTaskCount, getCompletedCount } = useTaskContext()


  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [name, setName] = useState(usuario?.nombre || "");
  const [email, setEmail] = useState(usuario?.correoElectronico || "");

  const [showAddList, setShowAddList] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const systemLists = Object.values(lists).filter((list) => list.type === "system")
  const customLists = Object.values(lists).filter((list) => list.type === "custom")

  const systemOptions = [
    { id: "history", name: "📜 History", icon: "📜" },
    { id: "statistics", name: "📊 Statistics", icon: "📊" },
    { id: "calendar", name: "📅 Calendar", icon: "📅" },
    { id: "pomodoro", name: "🍅 Pomodoro", icon: "🍅" },
  ]

  const handleAddList = (e) => {
    e.preventDefault()
    if (newListName.trim()) {
      addList(newListName.trim())
      setNewListName("")
      setShowAddList(false)
    }
  }


  function HandleDeleteList(id){
      axios.delete(`http://localhost:8080/usuarios/listadetareas/${id}`)
        .then(() => {
          console.log("List deleted successfully");
          deleteList(id);
      })
      .catch((error) => {
          console.error("Error deleting list:", error);
          alert("Error deleting list");
      });
  }


  

  const filteredCustomLists = customLists.filter((list) => list.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user-info">
          <img src="../../../public/user.jpg" alt="User avatar" />
          <div>
            <p className="username">{name}</p>
            <p className="email">{email}</p>
          </div>
        </div>

        <input
          type="text"
          className="search-bar"
          placeholder="🔍 Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ul className="main-groups">
          {systemLists.map((list) => (
            <li
              key={list.id}
              className={currentView === list.id ? "active" : ""}
              onClick={() => setCurrentView(list.id)}
            >
              <span className="list-name">{list.name}</span>
              <span className="task-count">
                {getCompletedCount(list.id)}/{getTaskCount(list.id)}
              </span>
            </li>
          ))}
        </ul>

        <p className="separator-line">______________________________________</p>

        <ul className="main-groups">
          {filteredCustomLists.map((list) => (
            <li key={list.id} className={currentView === list.id ? "active" : ""}>
              <span className="list-name" onClick={() => setCurrentView(list.id)}>
                {list.name}
              </span>
              <div className="list-actions">
                <span className="task-count">
                  {getCompletedCount(list.id)}/{getTaskCount(list.id)}
                </span>
                <button className="delete-list" onClick={() => deleteList(list.id)} title="Delete list"> 
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>

        <p className="separator-line">______________________________________</p>

        <ul className="main-groups">
          {systemOptions.map((option) => (
            <li
              key={option.id}
              className={currentView === option.id ? "active" : ""}
              onClick={() => setCurrentView(option.id)}
            >
              <span className="list-name">{option.name}</span>
            </li>
          ))}
        </ul>

        <div className="add-container">
          {showAddList ? (
            <form onSubmit={handleAddList} className="add-list-form">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name..."
                className="new-list-input"
                autoFocus
              />
              <div className="form-buttons">
                <button type="submit" className="save-btn">
                  ✓
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddList(false)
                    setNewListName("")
                  }}
                >
                  ×
                </button>
              </div>
            </form>
          ) : (
            <>
              <button className="add-list" onClick={() => setShowAddList(true)}>
                ➕ Add List
              </button>
              <button className="add-group">➕ Add Group</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
