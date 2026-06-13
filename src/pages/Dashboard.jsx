import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Sparkles, Activity, Inbox, BookOpen, Star, MessageSquare, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { aiMatches } from '../data/dummyData';
import { getMyProfile, getMyRequests, getMyExchanges } from '../api/services';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, requestsRes] = await Promise.all([
          getMyProfile(),
          getMyRequests(),
        ]);
        // handle getMyExchanges gracefully if endpoint doesn't exist yet
        let exchangesData = [];
        try {
          const exchangesRes = await getMyExchanges();
          exchangesData = exchangesRes.data;
        } catch (e) {}

        setProfile(profileRes.data);
        setRequests(requestsRes.data);
        setExchanges(exchangesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const pendingIncoming = requests.incoming.filter(r => r.status === 'pending');
  const offeredSkillsCount = profile.skills?.filter(s => s.type === 'offer').length || 0;

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Good morning, {profile.name.split(' ')[0]} 👋</h1>
            <p className="text-gray-500 mt-1">{dateStr}</p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Exchanges', value: exchanges.length, icon: <Activity className="w-5 h-5 text-blue-500" /> },
            { label: 'Pending Requests', value: pendingIncoming.length, icon: <Inbox className="w-5 h-5 text-orange-500" /> },
            { label: 'Skills Offered', value: offeredSkillsCount, icon: <BookOpen className="w-5 h-5 text-green-500" /> },
            { label: 'Rating', value: `${profile.rating}★`, icon: <Star className="w-5 h-5 text-yellow-500" /> }
          ].map((stat, i) => (
            <motion.div variants={fadeUp} key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
                <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
              </div>
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI Matches */}
            <motion.section variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-900">Your AI Matches</h2>
                <span className="px-2.5 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-md flex items-center gap-1 uppercase tracking-wide">
                  <Sparkles className="w-3 h-3" /> Powered by Gemini
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiMatches.slice(0, 3).map((match, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <img src={match.avatar} alt={match.name} className="w-12 h-12 rounded-full border border-gray-100" />
                        <div className={`px-2 py-1 rounded-md text-xs font-bold ${match.matchScore >= 90 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {match.matchScore}% Match
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900">{match.name}</h3>
                      <p className="text-xs text-gray-500 mb-3">{match.college}</p>
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg italic line-clamp-2">"{match.matchReason}"</p>
                    </div>
                    <button onClick={() => navigate(`/profile/${match.id}`)} className="mt-4 w-full py-2 bg-gray-50 hover:bg-violet-50 text-violet-600 font-medium rounded-xl text-sm transition-colors border border-gray-100 hover:border-violet-200">
                      View & Connect
                    </button>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Active Exchanges */}
            <motion.section variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-gray-900">Active Exchanges</h2>
              </div>
              {exchanges.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center text-gray-500">No active exchanges yet.</div>
              ) : (
                exchanges.map((ex, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <img src={ex.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder'} className="w-14 h-14 rounded-full border border-gray-100" />
                      <div>
                        <h3 className="font-bold text-gray-900">{ex.user?.name || 'Partner'}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2.5 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-lg">{ex.user1Skill}</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg">{ex.user2Skill}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full sm:w-auto px-4">
                      <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                        <span>Progress</span>
                        <span>{ex.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full" style={{ width: `${ex.progress}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">Next session: {ex.nextSession || 'Not scheduled'}</p>
                    </div>

                    <button onClick={() => navigate(`/exchange/${ex.id}`)} className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Open Chat
                    </button>
                  </div>
                ))
              )}
            </motion.section>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            
            {/* Pending Requests */}
            <motion.section variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Pending Requests</h2>
                <button onClick={() => navigate('/requests')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
              </div>
              
              <div className="space-y-4">
                {pendingIncoming.length === 0 && <p className="text-sm text-gray-500">No pending requests.</p>}
                {pendingIncoming.slice(0, 3).map((req, i) => (
                  <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <img src={req.fromUser.avatar} className="w-10 h-10 rounded-full" />
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{req.fromUser.name}</h4>
                          <p className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded line-clamp-2">"{req.message}"</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
                        <CheckCircle className="w-3 h-3" /> Accept
                      </button>
                      <button className="flex-1 py-1.5 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
                        <XCircle className="w-3 h-3" /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
