import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Star, Calendar, MessageSquarePlus, X } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { getUserById, sendRequest, getMyProfile } from '../api/services';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getUserById(id), getMyProfile()])
      .then(([profileRes]) => {
        setProfile(profileRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendRequest = async (skill) => {
    if (!skill) return;
    try {
      setRequesting(true);
      await sendRequest({
        toUserId: profile.id,
        skillId: skill.id,
        message: message
      });
      alert('Request sent!');
      setShowModal(false);
      setMessage('');
      setSelectedSkill(null);
      navigate('/requests');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  const openRequestModal = () => {
    setMessage('');
    const offers = profile?.skills?.filter(s => s.type === 'offer') || [];
    setSelectedSkill(offers.length === 1 ? offers[0] : null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setMessage('');
    setSelectedSkill(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF]">
        <p className="text-gray-500 font-medium">User not found.</p>
      </div>
    );
  }

  const offerSkills = profile.skills?.filter(s => s.type === 'offer') || [];
  const wantSkills = profile.skills?.filter(s => s.type === 'want') || [];
  const reviews = profile.reviewsReceived || [];
  const isOwnProfile = currentUser?.id === profile.id;

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
                <img src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} alt={profile.name} className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md mb-4" />
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-500 font-medium">@{profile.username}</p>
                
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location || 'Not set'}</div>
                  <div className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {profile.college || 'Not set'}</div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
                      {(profile.rating || 0).toFixed(1)} <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </p>
                    <p className="text-xs text-gray-500 uppercase font-bold">{profile.reviewCount || 0} Reviews</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{profile.completedExchanges || 0}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">Exchanges</p>
                  </div>
                </div>
                {!isOwnProfile && (
                  <button 
                    onClick={openRequestModal}
                    disabled={offerSkills.length === 0}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageSquarePlus className="w-5 h-5" /> Request Exchange
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Bio & Skills */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="md:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{profile.bio || 'No bio provided.'}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-t border-gray-100 pt-4">
                <Calendar className="w-4 h-4" /> Joined {formatDate(profile.createdAt)}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Skills Offered</h3>
              <div className="flex flex-wrap gap-2">
                {offerSkills.map((skill) => (
                  <div key={skill.id} className="px-3 py-1.5 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm font-medium">
                    {skill.name} <span className="text-xs opacity-70 ml-1">• {skill.level}</span>
                  </div>
                ))}
                {offerSkills.length === 0 && <span className="text-sm text-gray-500">None</span>}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Skills Wanted</h3>
              <div className="flex flex-wrap gap-2">
                {wantSkills.map((skill) => (
                  <div key={skill.id} className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    {skill.name} <span className="text-xs opacity-70 ml-1">• {skill.level}</span>
                  </div>
                ))}
                {wantSkills.length === 0 && <span className="text-sm text-gray-500">None</span>}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Reviews */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
            {reviews.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500 text-sm">
                No reviews yet.
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img src={rev.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.author?.username}`} alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">{rev.author?.name}</h5>
                        <p className="text-xs text-gray-500">{rev.author?.college}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-0.5 mb-1 justify-end">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-3.5 h-3.5 ${j < rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(rev.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">"{rev.text}"</p>
                  <div className="inline-block px-2.5 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-md border border-gray-100">
                    Skill: {rev.skill}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </main>

      {/* Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Request Exchange</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill being requested</label>
                {offerSkills.length > 1 ? (
                  <select
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                    value={selectedSkill?.id || ''}
                    onChange={(e) => {
                      const skill = offerSkills.find(s => s.id === parseInt(e.target.value));
                      setSelectedSkill(skill || null);
                    }}
                  >
                    <option value="">Select a skill...</option>
                    {offerSkills.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm font-semibold text-violet-700 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">
                    {selectedSkill?.name || offerSkills[0]?.name || 'No skills available'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  rows="3" 
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                  placeholder={`Hi ${profile.name}, I'd love to learn from you!`}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                ></textarea>
              </div>

              <button 
                onClick={() => handleSendRequest(selectedSkill || offerSkills[0])}
                disabled={requesting || offerSkills.length === 0}
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

export default Profile;
