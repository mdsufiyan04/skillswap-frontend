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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-apple-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-apple-gray font-medium">User not found.</p>
      </div>
    );
  }

  const offerSkills = profile.skills?.filter(s => s.type === 'offer') || [];
  const wantSkills = profile.skills?.filter(s => s.type === 'want') || [];
  const reviews = profile.reviewsReceived || [];
  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="min-h-screen bg-white text-apple-black font-sans">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white rounded-[24px] overflow-hidden border border-apple-border mb-12">
          <div className="h-48 bg-apple-bg w-full relative"></div>
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="flex flex-col items-start -mt-16 relative z-10">
                <img src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} alt={profile.name} className="w-32 h-32 rounded-full border-4 border-white bg-white mb-4" />
                <h1 className="text-[32px] font-bold text-apple-black tracking-[-0.01em]">{profile.name}</h1>
                <p className="text-[17px] text-apple-gray font-medium">@{profile.username}</p>
                
                <div className="flex flex-wrap gap-4 mt-4 text-[14px] text-apple-gray">
                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location || 'Not set'}</div>
                  <div className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {profile.college || 'Not set'}</div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-[28px] font-bold text-apple-black flex items-center justify-center gap-1">
                      {(profile.rating || 0).toFixed(1)} <Star className="w-5 h-5 text-apple-black fill-current" />
                    </p>
                    <p className="text-[12px] text-apple-gray uppercase tracking-[0.08em] font-semibold mt-1">{profile.reviewCount || 0} Reviews</p>
                  </div>
                  <div className="w-px h-12 bg-apple-border"></div>
                  <div className="text-center">
                    <p className="text-[28px] font-bold text-apple-black">{profile.completedExchanges || 0}</p>
                    <p className="text-[12px] text-apple-gray uppercase tracking-[0.08em] font-semibold mt-1">Exchanges</p>
                  </div>
                </div>
                {!isOwnProfile && (
                  <button 
                    onClick={openRequestModal}
                    disabled={offerSkills.length === 0}
                    className="w-full md:w-auto px-6 py-3 bg-apple-black text-white rounded-[980px] font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageSquarePlus className="w-5 h-5" /> Request Exchange
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Left Column: Bio & Skills */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="md:col-span-1 space-y-8">
            <div className="bg-white rounded-[18px] p-6 border border-apple-border">
              <h3 className="text-[19px] font-semibold text-apple-black mb-3">About</h3>
              <p className="text-[14px] text-apple-gray leading-relaxed mb-6">{profile.bio || 'No bio provided.'}</p>
              <div className="flex items-center gap-2 text-[12px] text-apple-gray uppercase tracking-[0.08em] font-medium border-t border-apple-border pt-4">
                <Calendar className="w-4 h-4" /> Joined {formatDate(profile.createdAt)}
              </div>
            </div>

            <div className="bg-white rounded-[18px] p-6 border border-apple-border">
              <h3 className="text-[19px] font-semibold text-apple-black mb-4">Skills Offered</h3>
              <div className="flex flex-wrap gap-2">
                {offerSkills.map((skill) => (
                  <div key={skill.id} className="px-3 py-1.5 bg-apple-bg border border-apple-border text-apple-black rounded-[980px] text-[14px] font-medium">
                    {skill.name} <span className="text-[12px] text-apple-gray ml-1 uppercase tracking-[0.08em]">• {skill.level}</span>
                  </div>
                ))}
                {offerSkills.length === 0 && <span className="text-[14px] text-apple-gray">None</span>}
              </div>
            </div>

            <div className="bg-white rounded-[18px] p-6 border border-apple-border">
              <h3 className="text-[19px] font-semibold text-apple-black mb-4">Skills Wanted</h3>
              <div className="flex flex-wrap gap-2">
                {wantSkills.map((skill) => (
                  <div key={skill.id} className="px-3 py-1.5 bg-white border border-apple-black text-apple-black rounded-[980px] text-[14px] font-medium">
                    {skill.name} <span className="text-[12px] text-apple-gray ml-1 uppercase tracking-[0.08em]">• {skill.level}</span>
                  </div>
                ))}
                {wantSkills.length === 0 && <span className="text-[14px] text-apple-gray">None</span>}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Reviews */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="md:col-span-2 space-y-6">
            <h2 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em]">Reviews</h2>
            {reviews.length === 0 ? (
              <div className="bg-white p-8 rounded-[18px] border border-apple-border text-center text-[17px] text-apple-gray">
                No reviews yet.
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-6 rounded-[18px] border border-apple-border">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img src={rev.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.author?.username}`} alt="" className="w-12 h-12 rounded-full border border-apple-border" />
                      <div>
                        <h5 className="font-semibold text-apple-black text-[14px]">{rev.author?.name}</h5>
                        <p className="text-[14px] text-apple-gray">{rev.author?.college}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-1 mb-1 justify-end">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-4 h-4 ${j < rev.rating ? 'text-apple-black fill-current' : 'text-apple-border'}`} />
                        ))}
                      </div>
                      <span className="text-[12px] text-apple-gray uppercase tracking-[0.08em]">{formatDate(rev.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-[14px] text-apple-gray leading-relaxed mb-4">"{rev.text}"</p>
                  <div className="inline-block px-3 py-1 bg-apple-bg text-apple-black text-[12px] font-medium uppercase tracking-[0.08em] rounded-[980px] border border-apple-border">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] w-full max-w-md overflow-hidden border border-apple-border">
            <div className="p-6 border-b border-apple-border flex justify-between items-center">
              <h3 className="text-[19px] font-semibold text-apple-black">Request Exchange</h3>
              <button onClick={closeModal} className="text-apple-gray hover:text-apple-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[12px] font-medium text-apple-gray uppercase tracking-[0.08em] mb-2">Skill being requested</label>
                {offerSkills.length > 1 ? (
                  <select
                    className="w-full bg-apple-bg border border-apple-border rounded-[12px] p-4 text-[14px] text-apple-black focus:border-apple-black outline-none appearance-none"
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
                  <div className="bg-apple-bg border border-apple-border rounded-[12px] p-4">
                    <p className="text-[17px] font-semibold text-apple-black">
                      {selectedSkill?.name || offerSkills[0]?.name || 'No skills available'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[12px] font-medium text-apple-gray uppercase tracking-[0.08em] mb-2">Message</label>
                <textarea 
                  rows="4" 
                  className="w-full bg-apple-bg border border-apple-border rounded-[12px] p-4 text-[14px] text-apple-black focus:border-apple-black outline-none resize-none transition-colors"
                  placeholder={`Hi ${profile.name}, I'd love to learn from you!`}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                ></textarea>
              </div>

              <button 
                onClick={() => handleSendRequest(selectedSkill || offerSkills[0])}
                disabled={requesting || offerSkills.length === 0}
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

export default Profile;
