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
    <nav className="sticky top-0 z-50 bg-white border-b border-apple-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H14V9H7V11.5H13V14.5H7V18H15V21H4V6Z" fill="#1D1D1F"/>
              <path d="M9 3H19V6H12V8.5H18V11.5H12V15H20V18H9V3Z" fill="#AEAEB2"/>
            </svg>
            <span className="text-xl font-semibold text-apple-black tracking-tight">Elevate</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors border-b-2 py-5 ${isActive('/dashboard') ? 'text-apple-black border-apple-black' : 'text-apple-gray border-transparent hover:text-apple-black'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/browse" 
              className={`text-sm font-medium transition-colors border-b-2 py-5 ${isActive('/browse') ? 'text-apple-black border-apple-black' : 'text-apple-gray border-transparent hover:text-apple-black'}`}
            >
              Browse
            </Link>
            <Link 
              to="/projects" 
              className={`text-sm font-medium transition-colors border-b-2 py-5 ${location.pathname.startsWith('/projects') || isActive('/my-projects') ? 'text-apple-black border-apple-black' : 'text-apple-gray border-transparent hover:text-apple-black'}`}
            >
              Projects
            </Link>
            <Link 
              to="/requests" 
              className={`text-sm font-medium transition-colors border-b-2 py-5 ${isActive('/requests') ? 'text-apple-black border-apple-black' : 'text-apple-gray border-transparent hover:text-apple-black'}`}
            >
              Requests
            </Link>
            <Link 
              to="/chat" 
              className={`text-sm font-medium transition-colors border-b-2 py-5 ${isActive('/chat') ? 'text-apple-black border-apple-black' : 'text-apple-gray border-transparent hover:text-apple-black'}`}
            >
              Chat
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 relative">
            <button className="relative p-2 text-apple-gray hover:text-apple-black transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-apple-black rounded-full border border-white"></span>
            </button>
            
            <div className="relative">
              <button 
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img 
                  src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder'} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-apple-border"
                />
                <ChevronDown className="w-4 h-4 text-apple-gray" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-apple-border py-1 overflow-hidden z-50">
                  <div className="px-4 py-2 border-b border-apple-border">
                    <p className="text-sm font-medium text-apple-black truncate">{user?.name}</p>
                    <p className="text-xs text-apple-gray truncate">@{user?.username}</p>
                  </div>
                  <button 
                    onClick={() => { setShowDropdown(false); navigate('/my-profile'); }}
                    className="w-full text-left px-4 py-2 text-sm text-apple-black hover:bg-apple-bg flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </button>
                  <button 
                    onClick={() => { setShowDropdown(false); navigate('/my-projects'); }}
                    className="w-full text-left px-4 py-2 text-sm text-apple-black hover:bg-apple-bg flex items-center gap-2"
                  >
                    <FolderOpen className="w-4 h-4" /> My Projects
                  </button>
                  <button 
                    onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                    className="w-full text-left px-4 py-2 text-sm text-apple-black hover:bg-apple-bg flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <div className="border-t border-apple-border my-1"></div>
                  <button 
                    onClick={() => { setShowDropdown(false); logout(); navigate('/login'); }}
                    className="w-full text-left px-4 py-2 text-sm text-apple-black hover:bg-apple-bg flex items-center gap-2"
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
