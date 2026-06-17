import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Browse from './pages/Browse';
import Profile from './pages/Profile';
import MyProfile from './pages/MyProfile';
import Requests from './pages/Requests';
import Chat from './pages/Chat';
import ExchangeDetail from './pages/ExchangeDetail';
import Projects from './pages/Projects';
import NewProject from './pages/NewProject';
import ProjectDetail from './pages/ProjectDetail';
import MyProjects from './pages/MyProjects';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen font-sans tracking-tight flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
              <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
              <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/exchange/:id" element={<ProtectedRoute><ExchangeDetail /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/projects/new" element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
              <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
              <Route path="/my-projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
            </Routes>
          </main>
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'bg-white text-apple-black border border-apple-border text-sm font-medium tracking-tight',
            }} 
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
