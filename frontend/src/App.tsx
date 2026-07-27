import './App.css'
import AiChatPage from './pages/LoreChatPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import Home from './pages/home.tsx' 
import { Routes, Route } from 'react-router-dom'
import Login from './pages/registration/login.tsx'
import Register from './pages/registration/register.tsx'
import Projects from './pages/projects.tsx'
import ProtectedRoute from './components/protectedroute.tsx'
import ProjectHomePage from './pages/projectHomePage.tsx'
import Settings from './pages/settings.tsx'
import WikiHome from "./pages/wikiHome.tsx"
import WikiEdit from "./pages/WikiEdit.tsx"


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

            <Route
              path="/projects/:projectId/wiki"
              element={
                <ProtectedRoute>
                  <WikiHome />
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects/:projectId/ai-chat"
              element={
                <ProtectedRoute>
                  <AiChatPage />
                </ProtectedRoute>
              }
            />
          
          <Route 
            path="/profile"
            element={
              // <ProtectedRoute>
                <ProfilePage />
              // </ProtectedRoute>
            }
          /> 

        <Route
          path="/projects/:projectId/wiki/entries/:entryId/edit"
          element={
            <ProtectedRoute>
              <WikiEdit />
            </ProtectedRoute>
          }
        />
  
      </Routes>
    
    </>
  )
}

export default App
