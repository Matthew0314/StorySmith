import './App.css'
import Home from './pages/home.tsx' 
import { Routes, Route } from 'react-router-dom'
import Login from './pages/registration/login.tsx'
import Register from './pages/registration/register.tsx'
import Projects from './pages/projects.tsx'
import ProtectedRoute from './components/protectedroute.tsx'
import ProjectHomePage from './pages/projectHomePage.tsx'
import Settings from './pages/settings.tsx'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectHomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
  
      </Routes>
    
    </>
  )
}

export default App
