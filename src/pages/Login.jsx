import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginUser } from '../api/services';
import { getApiErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    try {
      const res = await loginUser({ email: formData.email.trim().toLowerCase(), password: formData.password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(getApiErrorMessage(err, 'Sign in failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-[400px]">
        
        <Link to="/" className="flex items-center justify-center gap-2 mb-12">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H14V9H7V11.5H13V14.5H7V18H15V21H4V6Z" fill="#1D1D1F"/>
            <path d="M9 3H19V6H12V8.5H18V11.5H12V15H20V18H9V3Z" fill="#AEAEB2"/>
          </svg>
          <span className="text-2xl font-semibold text-apple-black tracking-tight">Elevate</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-[48px] font-bold text-apple-black tracking-[-0.02em] leading-tight mb-3">Welcome back.</h1>
          <p className="text-[17px] text-apple-gray">Enter your details to sign in.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-apple-black bg-apple-bg p-3 rounded-xl border border-apple-border text-sm mb-4">{error}</div>}
          
          <div>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-4 rounded-[12px] bg-apple-bg border border-apple-border focus:border-apple-black outline-none transition-all text-apple-black placeholder-apple-gray" 
              placeholder="Email address" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              className="w-full px-4 py-4 rounded-[12px] bg-apple-bg border border-apple-border focus:border-apple-black outline-none transition-all text-apple-black placeholder-apple-gray" 
              placeholder="Password" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-gray hover:text-apple-black"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex justify-between items-center py-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-apple-border text-apple-black focus:ring-apple-black w-4 h-4" />
              <span className="text-[14px] text-apple-gray">Remember me</span>
            </label>
            <a href="#" className="text-[14px] font-medium text-apple-black hover:underline">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 bg-apple-black text-white rounded-[980px] font-medium hover:bg-[#333333] transition-colors mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-apple-border"></div>
            <span className="flex-shrink-0 mx-4 text-apple-gray text-[14px]">Or continue with</span>
            <div className="flex-grow border-t border-apple-border"></div>
          </div>
          
          <button 
            type="button" 
            className="w-full py-4 bg-transparent border border-apple-black text-apple-black rounded-[980px] font-medium hover:bg-apple-bg transition-colors flex justify-center items-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#1D1D1F" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#1D1D1F" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#1D1D1F" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#1D1D1F" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
        </form>

        <p className="text-center text-[17px] text-apple-gray mt-10">
          Don't have an account? <Link to="/register" className="text-apple-black font-medium hover:underline">Sign up →</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
