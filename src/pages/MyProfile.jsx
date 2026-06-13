import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, GraduationCap, Calendar, Award, Edit3, Plus, Trash2 } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { reviews } from '../data/dummyData';
import { getMyProfile, addSkill, deleteSkill, updateMyProfile } from '../api/services';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    college: ''
  });

  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Tech',
    type: 'offer',
    level: 'Beginner'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setLoading(true);
    getMyProfile()
      .then(res => {
        setProfile(res.data);
        setEditForm({
          name: res.data.name || '',
          bio: res.data.bio || '',
          location: res.data.location || '',
          college: res.data.college || ''
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleProfileSave = async () => {
    try {
      await updateMyProfile(editForm);
      setIsEditingProfile(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSkillSubmit = async () => {
    try {
      await addSkill(skillForm);
      setIsAddingSkill(false);
      setSkillForm({ name: '', category: 'Tech', type: 'offer', level: 'Beginner' });
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const offerSkills = profile.skills?.filter(s => s.type === 'offer') || [];
  const wantSkills = profile.skills?.filter(s => s.type === 'want') || [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-16">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 pt-8">
        {/* Profile Completion Bar */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="bg-violet-100 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
        >
          <div className="w-full md:w-1/2">
            <h2 className="text-violet-900 font-semibold text-lg mb-2">Profile 80% Complete</h2>
            <div className="h-2 w-full bg-violet-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full"
                style={{ width: `80%` }}
              ></div>
            </div>
          </div>
          <p className="text-violet-700 text-sm font-medium">
            Add bio and skills to reach 100%
          </p>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          {isEditingProfile ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">College</label>
                  <input 
                    type="text" 
                    value={editForm.college}
                    onChange={(e) => setEditForm({...editForm, college: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Bio</label>
                  <textarea 
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 h-24"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleProfileSave}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                <img 
                  src={profile.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder'} 
                  alt={profile.name} 
                  className="w-24 h-24 rounded-full border-4 border-violet-100"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                  <p className="text-gray-600 mt-1">{profile.bio || "No bio added yet."}</p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={16} /> {profile.location || 'Not set'}</span>
                    <span className="flex items-center gap-1"><GraduationCap size={16} /> {profile.college || 'Not set'}</span>
                    <span className="flex items-center gap-1"><Calendar size={16} /> Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                    <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                      <Star fill="currentColor" size={18} />
                      <span>{profile.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 border-2 border-violet-600 text-violet-700 hover:bg-violet-50 rounded-lg font-semibold transition"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
            </div>
          )}
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Skills */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Offer Skills */}
            <motion.section initial="hidden" animate="visible" variants={fadeUp}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Skills I Offer</h3>
              <div className="space-y-3">
                {offerSkills.map(skill => (
                  <div key={skill.id} className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center group">
                    <div>
                      <h4 className="font-semibold text-emerald-900">{skill.name}</h4>
                      <p className="text-emerald-700 text-xs">{skill.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-800 bg-emerald-200 px-2 py-1 rounded text-xs font-medium">
                        {skill.level}
                      </span>
                      <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Want Skills */}
            <motion.section initial="hidden" animate="visible" variants={fadeUp}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Skills I Want</h3>
              <div className="space-y-3">
                {wantSkills.map(skill => (
                  <div key={skill.id} className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex justify-between items-center group">
                    <div>
                      <h4 className="font-semibold text-blue-900">{skill.name}</h4>
                      <p className="text-blue-700 text-xs">{skill.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-800 bg-blue-200 px-2 py-1 rounded text-xs font-medium">
                        {skill.level}
                      </span>
                      <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Add Skill Button / Form */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              {!isAddingSkill ? (
                <button 
                  onClick={() => setIsAddingSkill(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-violet-400 hover:text-violet-600 transition font-medium"
                >
                  <Plus size={20} />
                  Add Skill
                </button>
              ) : (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-3">Add New Skill</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Skill Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Photoshop"
                        value={skillForm.name}
                        onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                        className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                        <select 
                          value={skillForm.category}
                          onChange={(e) => setSkillForm({...skillForm, category: e.target.value})}
                          className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                          {['Tech', 'Design', 'Music', 'Languages', 'Fitness', 'Business', 'Arts', 'Cooking'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                        <select 
                          value={skillForm.type}
                          onChange={(e) => setSkillForm({...skillForm, type: e.target.value})}
                          className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                          <option value="offer">I Offer</option>
                          <option value="want">I Want</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Level</label>
                      <select 
                        value={skillForm.level}
                        onChange={(e) => setSkillForm({...skillForm, level: e.target.value})}
                        className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button 
                        onClick={() => setIsAddingSkill(false)}
                        className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md font-medium"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleAddSkillSubmit}
                        className="px-3 py-1.5 text-sm bg-violet-600 text-white hover:bg-violet-700 rounded-md font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

          </div>

          {/* Right Column: Reviews */}
          <div className="lg:col-span-2">
            <motion.section initial="hidden" animate="visible" variants={fadeUp}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h3>
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3 items-center">
                        <img 
                          src={review.author.avatar} 
                          alt={review.author.name} 
                          className="w-12 h-12 rounded-full border border-gray-100"
                        />
                        <div>
                          <h4 className="font-bold text-gray-800">{review.author.name}</h4>
                          <p className="text-xs text-gray-500">{review.author.college}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">{review.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                        ))}
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        Exchanged: {review.skill}
                      </span>
                    </div>
                    
                    <p className="text-gray-700">"{review.text}"</p>
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

export default MyProfile;
