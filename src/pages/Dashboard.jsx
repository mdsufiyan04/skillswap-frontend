import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Activity, Inbox, BookOpen, Star, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-apple-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const pendingIncoming = requests.incoming.filter(r => r.status === 'pending');
  const offeredSkillsCount = profile.skills?.filter(s => s.type === 'offer').length || 0;

  return (
    <div className="min-h-screen bg-white text-apple-black font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Welcome Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[48px] font-bold text-apple-black tracking-[-0.02em] leading-tight">Good morning, {profile.name.split(' ')[0]}.</h1>
          <p className="text-[17px] text-apple-gray mt-2">{dateStr}</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Exchanges', value: exchanges.filter(ex => ex.status === 'active').length },
            { label: 'Pending Requests', value: pendingIncoming.length },
            { label: 'Skills Offered', value: offeredSkillsCount },
            { label: 'Rating', value: `${profile.rating}★` }
          ].map((stat, i) => (
            <motion.div variants={fadeUp} key={i} className="bg-white p-6 rounded-[18px] border border-apple-border flex flex-col justify-between">
              <span className="text-[32px] md:text-[40px] font-bold text-apple-black leading-none mb-2">{stat.value}</span>
              <span className="text-[14px] font-medium text-apple-gray uppercase tracking-[0.08em]">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Your Matches */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[12px] font-medium text-apple-gray uppercase tracking-[0.08em]">AI MATCHES</h2>
            <span className="px-3 py-1 bg-apple-bg border border-apple-border text-apple-black text-[12px] font-medium rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Powered by Gemini
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiMatches.slice(0, 3).map((match, i) => (
              <div key={i} className="bg-white rounded-[18px] border border-apple-border p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <img src={match.avatar} alt={match.name} className="w-16 h-16 rounded-full border border-apple-border" />
                    <div className="text-[32px] font-bold text-apple-black leading-none">
                      {match.matchScore}%
                    </div>
                  </div>
                  <h3 className="font-semibold text-apple-black text-[19px]">{match.name}</h3>
                  <p className="text-[14px] text-apple-gray mb-4">{match.college}</p>
                  <p className="text-[14px] text-apple-gray italic leading-relaxed mb-6">"{match.matchReason}"</p>
                </div>
                <button onClick={() => navigate(`/profile/${match.id}`)} className="w-full py-3 bg-apple-black text-white font-medium rounded-[980px] hover:bg-[#333333] transition-colors">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Active Exchanges */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em]">Active Exchanges</h2>
            
            {exchanges.filter(ex => ex.status === 'active').length === 0 ? (
              <div className="bg-white p-8 rounded-[18px] border border-apple-border text-center">
                <p className="text-[17px] text-apple-gray mb-6">No active exchanges yet. Start by browsing skills!</p>
                <button onClick={() => navigate('/browse')} className="px-6 py-3 bg-apple-black text-white rounded-[980px] font-medium hover:bg-[#333333] transition-colors">
                  Browse Skills
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {exchanges.filter(ex => ex.status === 'active').map((ex) => {
                  const partner = ex.user1Id === user?.id ? ex.user2 : ex.user1;
                  const me = ex.user1Id === user?.id ? ex.user1 : ex.user2;
                  return (
                    <div key={ex.id} className="bg-white rounded-[18px] border border-apple-border p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="flex items-center -space-x-2">
                          <img src={me?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${me?.username}`} className="w-12 h-12 rounded-full border border-apple-border" alt="" />
                          <img src={partner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.username}`} className="w-12 h-12 rounded-full border border-apple-border" alt="" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-apple-black">{partner?.name || 'Partner'}</h3>
                          <p className="text-[14px] text-apple-gray">{ex.user1Skill} ↔ {ex.user2Skill}</p>
                        </div>
                      </div>

                      <div className="flex-1 w-full px-4">
                        <div className="flex justify-between text-[12px] font-medium text-apple-gray uppercase tracking-[0.08em] mb-2">
                          <span>Progress</span>
                          <span>{ex.progress}%</span>
                        </div>
                        <div className="w-full bg-apple-bg border border-apple-border rounded-[980px] h-3 overflow-hidden">
                          <div className="bg-apple-black h-full rounded-[980px]" style={{ width: `${ex.progress}%` }}></div>
                        </div>
                        <p className="text-[12px] text-apple-gray text-center mt-2">{ex.sessionsCompleted} of {ex.totalSessions} sessions completed</p>
                      </div>

                      <div className="flex gap-3 w-full md:w-auto">
                        <button onClick={() => navigate(`/exchange/${ex.id}`)} className="flex-1 px-6 py-2 border border-apple-black text-apple-black rounded-[980px] text-[14px] font-medium hover:bg-apple-bg transition-colors whitespace-nowrap">
                          Open
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending Requests */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em]">Requests</h2>
              <button onClick={() => navigate('/requests')} className="text-[14px] font-medium text-apple-gray hover:text-apple-black">View All</button>
            </div>
            
            <div className="bg-white rounded-[18px] border border-apple-border p-6">
              <div className="space-y-6">
                {pendingIncoming.length === 0 && <p className="text-[17px] text-apple-gray">No pending requests.</p>}
                {pendingIncoming.slice(0, 3).map((req, i) => (
                  <div key={i} className="border-b border-apple-border last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={req.fromUser.avatar} className="w-10 h-10 rounded-full border border-apple-border" />
                      <div>
                        <h4 className="font-semibold text-apple-black text-[14px]">{req.fromUser.name}</h4>
                        <p className="text-[12px] text-apple-gray uppercase tracking-[0.08em]">{new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-[14px] text-apple-gray mb-4 line-clamp-2 leading-relaxed">"{req.message}"</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-apple-black text-white rounded-[980px] text-[14px] font-medium hover:bg-[#333333] transition-colors">
                        Accept
                      </button>
                      <button className="flex-1 py-2 bg-transparent border border-apple-black text-apple-black rounded-[980px] text-[14px] font-medium hover:bg-apple-bg transition-colors">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
