import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import MyDay from './pages/MyDay'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/MyDay" element = {<MyDay/>} />
      </Routes>
    </Router>
  );
}

export default App