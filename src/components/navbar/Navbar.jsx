import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Settings, ChevronDown, FolderOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">SkillSwap</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-violet-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/browse" 
              className={`text-sm font-medium transition-colors ${isActive('/browse') ? 'text-violet-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Browse
            </Link>
            <Link 
              to="/projects" 
              className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/projects') || isActive('/my-projects') ? 'text-violet-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Projects
            </Link>
            <Link 
              to="/requests" 
              className={`text-sm font-medium transition-colors ${isActive('/requests') ? 'text-violet-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Requests
            </Link>
            <Link 
              to="/chat" 
              className={`text-sm font-medium transition-colors ${isActive('/chat') ? 'text-violet-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Chat
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 relative">
            <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="relative">
              <button 
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img 
                  src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder'} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">@{user?.username}</p>
                  </div>
                  <button 
                    onClick={() => { setShowDropdown(false); navigate('/my-profile'); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </button>
                  <button 
                    onClick={() => { setShowDropdown(false); navigate('/my-projects'); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FolderOpen className="w-4 h-4" /> My Projects
                  </button>
                  <button 
                    onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <button 
                    onClick={() => { setShowDropdown(false); logout(); navigate('/login'); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
