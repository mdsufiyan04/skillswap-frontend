import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Palette, Globe, Play, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/navbar/Navbar';
import { createProject } from '../api/services';

const CATEGORIES = ['Tech', 'Design', 'Music', 'Business', 'Arts', 'Education', 'Social', 'Gaming'];
const STAGES = ['Idea', 'Building', 'Beta', 'Launched'];
const CONTRIBUTION_LEVELS = ['Full-time', 'Part-time', 'Mentor', 'One-time'];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const emptyRole = () => ({ title: '', description: '', skillsNeeded: '', contributionLevel: 'Part-time' });

const NewProject = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tech');
  const [stage, setStage] = useState('Idea');
  const [githubUrl, setGithubUrl] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [roles, setRoles] = useState([emptyRole()]);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [newRole, setNewRole] = useState(emptyRole());

  const addRole = () => {
    if (!newRole.title.trim() || !newRole.skillsNeeded.trim()) {
      toast.error('Role title and skills are required');
      return;
    }
    setRoles([...roles, { ...newRole }]);
    setNewRole(emptyRole());
    setShowRoleForm(false);
  };

  const removeRole = (index) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (description.length < 200) {
      toast.error('Description must be at least 200 characters');
      return;
    }
    if (roles.length === 0) {
      toast.error('Add at least one open role');
      return;
    }
    try {
      setSubmitting(true);
      const res = await createProject({
        title, tagline, description, category, stage,
        githubUrl: githubUrl || null,
        figmaUrl: figmaUrl || null,
        demoUrl: demoUrl || null,
        websiteUrl: websiteUrl || null,
        roles: roles.map(r => ({
          title: r.title,
          description: r.description,
          skillsNeeded: r.skillsNeeded,
        }))
      });
      toast.success('Project posted successfully!');
      navigate(`/projects/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition">
            <ArrowLeft className="w-5 h-5" /> Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Post a Project</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1 — Basics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Basics</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="EcoTrack — Carbon Credit Platform"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline * <span className="text-gray-400 font-normal">({tagline.length}/100)</span></label>
                <input type="text" value={tagline} onChange={e => setTagline(e.target.value.slice(0, 100))} maxLength={100}
                  placeholder="One line that captures your project"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description * <span className="text-gray-400 font-normal">({description.length} chars, min 200)</span></label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6}
                  placeholder="Describe your project vision, goals, and what you're building..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <select value={stage} onChange={e => setStage(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none">
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2 — Links */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Links <span className="text-sm font-normal text-gray-400">(optional)</span></h2>
              {[
                { icon: ExternalLink, label: 'GitHub URL', value: githubUrl, set: setGithubUrl, placeholder: 'https://github.com/...' },
                { icon: Palette, label: 'Figma URL', value: figmaUrl, set: setFigmaUrl, placeholder: 'https://figma.com/...' },
                { icon: Play, label: 'Demo URL', value: demoUrl, set: setDemoUrl, placeholder: 'https://demo.example.com' },
                { icon: Globe, label: 'Website URL', value: websiteUrl, set: setWebsiteUrl, placeholder: 'https://example.com' },
              ].map(({ icon: Icon, label, value, set, placeholder }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Icon className="w-4 h-4" /> {label}</label>
                  <input type="url" value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>
              ))}
            </div>

            {/* Section 3 — Open Roles */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Open Roles *</h2>
                <button type="button" onClick={() => setShowRoleForm(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-sm font-bold hover:bg-violet-200 transition">
                  <Plus className="w-4 h-4" /> Add Open Role
                </button>
              </div>

              {roles.map((role, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{role.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {role.skillsNeeded.split(',').map(s => (
                        <span key={s} className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-md">{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                  {roles.length > 1 && (
                    <button type="button" onClick={() => removeRole(i)} className="text-red-400 hover:text-red-600 p-1"><X className="w-4 h-4" /></button>
                  )}
                </div>
              ))}

              {showRoleForm && (
                <div className="p-4 border-2 border-dashed border-violet-200 rounded-xl space-y-3">
                  <input type="text" placeholder="Role Title (e.g. Backend Developer)" value={newRole.title}
                    onChange={e => setNewRole({ ...newRole, title: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                  <textarea placeholder="Role description" value={newRole.description} rows={2}
                    onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none" />
                  <input type="text" placeholder="Skills Needed (comma separated, e.g. React, Node.js)" value={newRole.skillsNeeded}
                    onChange={e => setNewRole({ ...newRole, skillsNeeded: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                  <select value={newRole.contributionLevel} onChange={e => setNewRole({ ...newRole, contributionLevel: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none">
                    {CONTRIBUTION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowRoleForm(false)} className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button type="button" onClick={addRole} className="px-3 py-1.5 text-sm bg-violet-600 text-white rounded-lg font-bold">Add Role</button>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50">
              {submitting ? 'Posting...' : 'Post Project'}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default NewProject;
