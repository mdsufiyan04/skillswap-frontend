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
        <div className="min-h-screen font-sans flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/exchange/:id" element={<ExchangeDetail />} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/projects/new" element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
              <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
              <Route path="/my-projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
            </Routes>
          </main>
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'bg-white text-gray-900 border border-gray-100 shadow-sm',
            }} 
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
