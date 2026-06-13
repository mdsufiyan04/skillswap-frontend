import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Users, PlayCircle, Star } from 'lucide-react';
import { stats, categories, users, reviews } from '../data/dummyData';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-[#F8F7FF] min-h-screen font-sans">
      {/* Landing Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              S
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">SkillSwap</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900">How it Works</a>
            <a href="#browse" className="text-sm font-medium text-gray-500 hover:text-gray-900">Browse</a>
            <a href="#community" className="text-sm font-medium text-gray-500 hover:text-gray-900">Community</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
            <Link to="/register" className="text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2 rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto flex flex-col items-center">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>✨ AI-Powered Skill Matching is here</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            Exchange Skills, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Grow Together</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Teach what you know. Learn what you don't. Zero cost, real growth. Connect with a global community of passionate learners and mentors.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Start Swapping Free <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/browse')} className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-all">
              Browse Skills
            </button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 mb-1">{stats.totalUsers}+</span>
            <span className="text-sm font-medium text-gray-500">Learners</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 mb-1">{stats.totalExchanges}+</span>
            <span className="text-sm font-medium text-gray-500">Exchanges</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-1">4.9<Star className="w-5 h-5 text-yellow-400 fill-current" /></span>
            <span className="text-sm font-medium text-gray-500">Rating</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 mb-1">{stats.countriesReached}</span>
            <span className="text-sm font-medium text-gray-500">Countries</span>
          </div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How it Works</h2>
            <p className="text-gray-500">Three simple steps to start your learning journey.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "List Your Skills", desc: "Create a profile detailing what you can teach and what you want to learn.", icon: <ShieldCheck className="w-6 h-6 text-violet-600" /> },
              { step: "2", title: "AI Finds Your Match", desc: "Our smart AI pairs you with users whose skills perfectly complement yours.", icon: <Zap className="w-6 h-6 text-indigo-600" /> },
              { step: "3", title: "Exchange and Grow", desc: "Connect via chat, schedule sessions, and start swapping skills safely.", icon: <Users className="w-6 h-6 text-purple-600" /> }
            ].map((item, idx) => (
              <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} transition={{ duration: 0.5, delay: idx * 0.1 }} viewport={{ once: true }} key={idx} className="bg-indigo-50/50 rounded-3xl p-8 relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.step}. {item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="text-[150px] font-black">{item.step}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="browse" className="py-20 bg-[#F8F7FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Every Skill, One Platform</h2>
            <p className="text-gray-500">Explore thousands of skills across multiple domains.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div whileHover={{ y: -5 }} key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer relative overflow-hidden group">
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${cat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Matching Feature */}
      <section className="py-20 bg-white border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Powered by Gemini AI
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Find your perfect skill match instantly.</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Don't waste time searching. Our AI analyzes your skills, goals, and learning style to connect you with the perfect exchange partner in seconds.
            </p>
            <ul className="space-y-3 pt-4">
              {['Complementary skill matching', 'Smart learning style analysis', 'Automated progress tracking'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">✓</div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full max-w-md">
            {/* Mock Match Card */}
            <motion.div initial={{ rotate: 5, y: 20 }} whileInView={{ rotate: 0, y: 0 }} transition={{ type: "spring" }} viewport={{ once: true }} className="bg-white p-6 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <img src={users[0].avatar} alt="" className="w-16 h-16 rounded-full bg-gray-100" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{users[0].name}</h4>
                    <p className="text-gray-500 text-sm">{users[0].college}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-4 border-green-500 flex items-center justify-center text-green-600 font-bold">
                    {users[0].matchScore}%
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Match</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <p className="text-sm text-gray-700 italic">"He offers {users[0].skills.offer[0].name} which you want, and wants React which you offer."</p>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium shadow-md">
                Connect Now
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="community" className="py-20 bg-[#F8F7FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Loved by Learners</h2>
            <p className="text-gray-500">See what our community has to say about their exchanges.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((rev, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 font-medium leading-relaxed">"{rev.text}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <img src={rev.author.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">{rev.author.name}</h5>
                    <p className="text-xs text-gray-500">{rev.author.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to start your skill journey?</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of others learning and teaching for free. Your perfect exchange partner is waiting.</p>
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-lg">
              Join SkillSwap Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">S</div>
            <span className="font-bold text-gray-900">SkillSwap</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Exchange Skills, Grow Together.</p>
          <div className="flex gap-6 text-sm text-gray-500 font-medium">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Contact</a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-8">
          &copy; 2026 SkillSwap. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;