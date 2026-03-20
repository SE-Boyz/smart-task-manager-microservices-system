import { Routes, Route } from 'react-router-dom'
import Auth from './Pages/Auth.jsx'
import Home from './Pages/Home.jsx'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}

export default App
