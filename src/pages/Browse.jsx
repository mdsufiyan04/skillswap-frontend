import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, UserPlus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar/Navbar';
import { categories } from '../data/dummyData';
import { getAllSkills, sendRequest } from '../api/services';

const Browse = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [message, setMessage] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllSkills({ 
      search: searchTerm, 
      type: typeFilter !== 'All' ? typeFilter.toLowerCase() : undefined,
      category: activeCategory !== 'All' ? activeCategory : undefined
    })
      .then(res => setSkills(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchTerm, typeFilter, activeCategory]);

  const openRequestModal = (skill) => {
    setSelectedSkill(skill);
    setMessage('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSkill(null);
    setMessage('');
  };

  const handleSendRequest = async () => {
    if (!selectedSkill?.user?.id) return;
    try {
      setRequesting(true);
      await sendRequest({
        toUserId: selectedSkill.user.id,
        skillId: selectedSkill.id,
        message: message
      });
      alert('Request sent!');
      closeModal();
      navigate('/requests');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  const stagger = {
    visible: { transition: { staggerChildren: 0.05 } }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search skills or users..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex w-full md:w-auto gap-4">
            <select 
              className="flex-1 md:w-48 bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Offer">Offering</option>
              <option value="Want">Wanting</option>
            </select>
            <button className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          <button 
            onClick={() => setActiveCategory('All')}
            className={`whitespace-nowrap px-5 py-2 rounded-full font-medium transition-all ${activeCategory === 'All' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            All Categories
          </button>
          {categories.map((cat, i) => (
            <button 
              key={i}
              onClick={() => setActiveCategory(cat.name)}
              className={`whitespace-nowrap px-5 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${activeCategory === cat.name ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        {loading ? (
           <div className="flex justify-center py-12">
             <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
           </div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <motion.div variants={fadeUp} key={skill.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
                <div className="p-6 border-b border-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 border rounded-lg text-xs font-bold uppercase tracking-wider ${skill.type === 'offer' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                      {skill.type === 'offer' ? 'Offering' : 'Wanting'}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{skill.name}</h3>
                  <p className="text-sm font-medium text-violet-600 mb-4">{skill.level}</p>
                  
                  <div className="flex items-center gap-3">
                    <img src={skill.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${skill.user?.username}`} className="w-10 h-10 rounded-full bg-gray-100" alt="" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{skill.user?.name}</p>
                      <p className="text-xs text-gray-500">{skill.user?.college}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 flex gap-3 mt-auto">
                  <button
                    onClick={() => navigate(`/profile/${skill.user.id}`)}
                    disabled={!skill.user?.id}
                    className="flex-1 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => openRequestModal(skill)}
                    disabled={!skill.user?.id}
                    className="flex-1 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <UserPlus className="w-4 h-4" /> Request
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Request Modal */}
      {showModal && selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Send Request</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill being requested</label>
                <p className="text-sm font-semibold text-violet-700 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">
                  {selectedSkill.name} <span className="text-violet-500 font-normal">• {selectedSkill.level}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">From {selectedSkill.user?.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows="3"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                  placeholder={`Hi ${selectedSkill.user?.name}, I'd love to learn ${selectedSkill.name}!`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <button
                onClick={handleSendRequest}
                disabled={requesting}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {requesting ? 'Sending...' : 'Confirm Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
