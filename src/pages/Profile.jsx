import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Star, Calendar, MessageSquarePlus } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { users, reviews } from '../data/dummyData';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Using Arjun Sharma as dummy if ID is missing or not matched
  const user = users.find(u => u.id === parseInt(id)) || users[0];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover & Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-8">
          <div className="h-48 bg-gradient-to-br from-violet-600 to-indigo-700 w-full relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          </div>
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="flex flex-col items-start -mt-16 relative z-10">
                <img src={user.avatar} className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md mb-4" />
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500 font-medium">@{user.username}</p>
                
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {user.location}</div>
                  <div className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {user.college}</div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
                      {user.rating} <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </p>
                    <p className="text-xs text-gray-500 uppercase font-bold">{user.reviewCount} Reviews</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{user.completedExchanges}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">Exchanges</p>
                  </div>
                </div>
                <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                  <MessageSquarePlus className="w-5 h-5" /> Request Exchange
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Bio & Skills */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="md:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{user.bio}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-t border-gray-100 pt-4">
                <Calendar className="w-4 h-4" /> Joined Platform recently
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Skills Offered</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.offer.map((skill, i) => (
                  <div key={i} className="px-3 py-1.5 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm font-medium">
                    {skill.name} <span className="text-xs opacity-70 ml-1">• {skill.level}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Skills Wanted</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.want.map((skill, i) => (
                  <div key={i} className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    {skill.name} <span className="text-xs opacity-70 ml-1">• {skill.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Reviews */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
            {reviews.map((rev, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img src={rev.author.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <h5 className="font-bold text-gray-900 text-sm">{rev.author.name}</h5>
                      <p className="text-xs text-gray-500">{rev.author.college}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-0.5 mb-1 justify-end">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{rev.date}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">"{rev.text}"</p>
                <div className="inline-block px-2.5 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-md border border-gray-100">
                  Skill: {rev.skill}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
