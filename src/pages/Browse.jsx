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
    <div className="min-h-screen bg-white text-apple-black font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="mb-8">
          <h1 className="text-[48px] font-bold text-apple-black tracking-[-0.02em] leading-tight mb-2">Browse Skills</h1>
          <p className="text-[17px] text-apple-gray">Find what you need or discover something new.</p>
        </div>

        {/* Top Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray" />
            <input 
              type="text" 
              placeholder="Search skills or users..." 
              className="w-full pl-12 pr-4 py-3 bg-apple-bg border border-apple-border rounded-[12px] focus:outline-none focus:border-apple-black transition-all text-apple-black placeholder-apple-gray"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex w-full md:w-auto gap-4">
            <select 
              className="flex-1 md:w-48 bg-apple-bg border border-apple-border text-apple-black py-3 px-4 rounded-[12px] focus:outline-none focus:border-apple-black appearance-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Offer">Offering</option>
              <option value="Want">Wanting</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <button 
            onClick={() => setActiveCategory('All')}
            className={`whitespace-nowrap px-6 py-2.5 rounded-[980px] font-medium transition-all text-[14px] ${activeCategory === 'All' ? 'bg-apple-black text-white' : 'bg-white text-apple-black border border-apple-border hover:bg-apple-bg'}`}
          >
            All Categories
          </button>
          {categories.map((cat, i) => (
            <button 
              key={i}
              onClick={() => setActiveCategory(cat.name)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-[980px] font-medium transition-all text-[14px] flex items-center gap-2 ${activeCategory === cat.name ? 'bg-apple-black text-white' : 'bg-white text-apple-black border border-apple-border hover:bg-apple-bg'}`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        {loading ? (
           <div className="flex justify-center py-20">
             <div className="animate-spin w-8 h-8 border-4 border-apple-black border-t-transparent rounded-full"></div>
           </div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <motion.div variants={fadeUp} key={skill.id} className="bg-white rounded-[18px] border border-apple-border overflow-hidden hover:-translate-y-1 transition-transform flex flex-col">
                <div className="p-6 border-b border-apple-border">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 border rounded-[980px] text-[12px] font-medium uppercase tracking-[0.08em] ${skill.type === 'offer' ? 'bg-apple-bg text-apple-black border-apple-border' : 'bg-white text-apple-gray border-apple-border'}`}>
                      {skill.type === 'offer' ? 'Offering' : 'Wanting'}
                    </div>
                  </div>
                  <h3 className="text-[24px] font-semibold text-apple-black mb-1">{skill.name}</h3>
                  <p className="text-[14px] font-medium text-apple-gray mb-6 uppercase tracking-[0.08em]">{skill.level}</p>
                  
                  <div className="flex items-center gap-4">
                    <img src={skill.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${skill.user?.username}`} className="w-12 h-12 rounded-full border border-apple-border" alt="" />
                    <div>
                      <p className="font-semibold text-apple-black text-[14px]">{skill.user?.name}</p>
                      <p className="text-[14px] text-apple-gray">{skill.user?.college}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white flex gap-3 mt-auto">
                  <button
                    onClick={() => navigate(`/profile/${skill.user.id}`)}
                    disabled={!skill.user?.id}
                    className="flex-1 py-3 bg-transparent border border-apple-black text-apple-black rounded-[980px] text-[14px] font-medium hover:bg-apple-bg transition-colors disabled:opacity-50"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => openRequestModal(skill)}
                    disabled={!skill.user?.id}
                    className="flex-1 py-3 bg-apple-black text-white rounded-[980px] text-[14px] font-medium hover:bg-[#333333] transition-colors disabled:opacity-50"
                  >
                    Request
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Request Modal */}
      {showModal && selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] w-full max-w-md overflow-hidden border border-apple-border">
            <div className="p-6 border-b border-apple-border flex justify-between items-center">
              <h3 className="text-[19px] font-semibold text-apple-black">Send Request</h3>
              <button onClick={closeModal} className="text-apple-gray hover:text-apple-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[12px] font-medium text-apple-gray uppercase tracking-[0.08em] mb-2">Skill being requested</label>
                <div className="bg-apple-bg border border-apple-border rounded-[12px] p-4">
                  <p className="text-[17px] font-semibold text-apple-black">
                    {selectedSkill.name} <span className="text-apple-gray font-normal ml-2">{selectedSkill.level}</span>
                  </p>
                  <p className="text-[14px] text-apple-gray mt-1">From {selectedSkill.user?.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-apple-gray uppercase tracking-[0.08em] mb-2">Message</label>
                <textarea
                  rows="4"
                  className="w-full bg-apple-bg border border-apple-border rounded-[12px] p-4 text-[14px] focus:border-apple-black outline-none resize-none transition-colors"
                  placeholder={`Hi ${selectedSkill.user?.name}, I'd love to learn ${selectedSkill.name}.`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <button
                onClick={handleSendRequest}
                disabled={requesting}
                className="w-full py-4 bg-apple-black text-white rounded-[980px] font-medium hover:bg-[#333333] transition-colors disabled:opacity-50"
              >
                {requesting ? 'Sending...' : 'Confirm Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
