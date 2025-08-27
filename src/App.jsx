import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './components/Home'
import Team from './components/Team'
import Projects from './components/Projects'
import SubmitProject from './components/SubmitProject'
import JoinUs from './components/JoinUs'
import Blogs from './components/Blogs'
import SubmitBlog from './components/SubmitBlog'
import Admin from './components/Admin'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import Members from './components/Members'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/submit-project" element={<SubmitProject />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/submit-blog" element={<SubmitBlog />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/members" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
