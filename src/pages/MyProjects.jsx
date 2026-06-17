import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/navbar/Navbar';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { getMyProjects, deleteProject } from '../api/services';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const STAGE_COLORS = {
  Idea: 'bg-apple-bg text-apple-black border border-apple-border',
  Building: 'bg-apple-bg text-apple-black border border-apple-border',
  Beta: 'bg-apple-bg text-apple-black border border-apple-border',
  Launched: 'bg-apple-bg text-apple-black border border-apple-border',
};

const MyProjects = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('created');
  const [data, setData] = useState({ created: [], joined: [], applied: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProjects()
      .then(res => setData(res.data))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      const res = await getMyProjects();
      setData(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const tabs = [
    { id: 'created', label: 'Created by Me', count: data.created.length },
    { id: 'joined', label: 'Contributing To', count: data.joined.length },
    { id: 'applied', label: 'Applied To', count: data.applied.length },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-apple-black tracking-tight">My Projects</h1>
            <p className="text-apple-gray mt-1">Manage your projects and contributions</p>
          </div>
          <button onClick={() => navigate('/projects/new')}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </motion.div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-black text-white' : 'bg-white text-apple-gray border border-gray-200 hover:bg-gray-50'}`}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <LoadingSkeleton key={i} className="h-32 w-full rounded-2xl" />)}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

              {activeTab === 'created' && (
                data.created.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                    <p className="text-apple-gray mb-4">You haven't created any projects yet.</p>
                    <button onClick={() => navigate('/projects/new')} className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800">Post a Project</button>
                  </div>
                ) : data.created.map(project => (
                  <div key={project.id} className="bg-white rounded-2xl p-8 border border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-apple-black">{project.title}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STAGE_COLORS[project.stage]}`}>{project.stage}</span>
                          {project._count?.applications > 0 && (
                            <span className="px-2 py-0.5 bg-apple-bg text-apple-black text-xs font-medium rounded-full border border-apple-border">{project._count.applications} applications</span>
                          )}
                        </div>
                        <p className="text-sm text-apple-gray mb-2">{project.tagline}</p>
                        <div className="flex items-center gap-4 text-xs text-apple-gray">
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {project._count?.members ?? project.members?.length ?? 0} members</span>
                          <span>{project.roles?.length ?? 0} roles</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => navigate(`/projects/${project.id}`)} className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800">Manage</button>
                        <button onClick={() => navigate(`/projects/${project.id}`)} className="px-6 py-3 border border-black text-black rounded-full text-sm font-medium hover:bg-gray-50">View</button>
                        <button onClick={() => handleDelete(project.id)} className="px-6 py-3 border border-apple-border text-apple-gray rounded-full text-sm font-medium hover:bg-apple-bg hover:text-apple-black transition-colors">Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {activeTab === 'joined' && (
                data.joined.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                    <p className="text-apple-gray">You're not contributing to any projects yet.</p>
                    <button onClick={() => navigate('/projects')} className="mt-4 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800">Browse Projects</button>
                  </div>
                ) : data.joined.map(project => (
                    <div key={project.id} className="bg-white rounded-2xl p-8 border border-gray-200">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-apple-black mb-1">{project.title}</h3>
                          <p className="text-sm text-apple-gray mb-2">{project.tagline}</p>
                          <p className="text-sm text-apple-black font-medium">Admin: {project.admin?.name}</p>
                        </div>
                        <button onClick={() => navigate(`/projects/${project.id}`)}
                          className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 self-start">
                          Open Workspace
                        </button>
                    </div>
                  </div>
                ))
              )}

              {activeTab === 'applied' && (
                data.applied.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                    <p className="text-apple-gray">You haven't applied to any projects yet.</p>
                    <button onClick={() => navigate('/projects')} className="mt-4 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800">Browse Projects</button>
                  </div>
                ) : data.applied.map(app => (
                  <div key={app.id} className="bg-white rounded-2xl p-8 border border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-apple-black">{app.project?.title}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 border ${
                            app.status === 'pending' ? 'bg-apple-bg text-apple-black border-apple-border' :
                            app.status === 'accepted' ? 'bg-apple-bg text-apple-black border-apple-border' : 'bg-apple-bg text-apple-black border-apple-border'
                          }`}>
                            {app.status === 'pending' && <Clock className="w-3 h-3" />}
                            {app.status === 'accepted' && <CheckCircle className="w-3 h-3" />}
                            {app.status === 'rejected' && <XCircle className="w-3 h-3" />}
                            {app.status}
                          </span>
                        </div>
                        <p className="text-sm text-apple-gray">Role: <span className="font-medium text-apple-black">{app.role?.title}</span></p>
                        <p className="text-xs text-apple-gray mt-1">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => navigate(`/projects/${app.project?.id}`)}
                        className="px-6 py-3 border border-black text-black rounded-full text-sm font-medium hover:bg-gray-50 self-start flex items-center gap-1">
                        <ExternalLink className="w-4 h-4" /> View Project
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default MyProjects;
