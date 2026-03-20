import { Routes, Route } from 'react-router-dom'
import Auth from './Pages/Auth.jsx'
import Home from './Pages/Home.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {

  return (
    <Routes>
      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )}
      />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}

export default App
