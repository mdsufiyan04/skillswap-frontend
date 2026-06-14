import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, Users } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { getAllProjects, getMyProfile } from '../api/services';
import { sampleProjects } from '../data/dummyData';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Tech', 'Design', 'Music', 'Business', 'Arts'];
const STAGES = ['All', 'Idea', 'Building', 'Beta', 'Launched'];

const STAGE_COLORS = {
  Idea: 'bg-gray-100 text-gray-700',
  Building: 'bg-blue-100 text-blue-700',
  Beta: 'bg-orange-100 text-orange-700',
  Launched: 'bg-green-100 text-green-700',
};

const CATEGORY_GRADIENTS = {
  Tech: 'from-violet-600 to-indigo-700',
  Design: 'from-pink-500 to-rose-600',
  Music: 'from-yellow-500 to-orange-600',
  Business: 'from-blue-500 to-indigo-600',
  Arts: 'from-purple-500 to-pink-600',
  Education: 'from-teal-500 to-cyan-600',
  Social: 'from-green-500 to-emerald-600',
  Gaming: 'from-red-500 to-orange-600',
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const getSkillTags = (roles) => {
  const tags = new Set();
  roles?.forEach(r => r.skillsNeeded?.split(',').forEach(s => tags.add(s.trim())));
  return [...tags].filter(Boolean).slice(0, 4);
};

const getHealthScore = (roles) => {
  if (!roles?.length) return 0;
  const filled = roles.filter(r => r.filled).length;
  return Math.round((filled / roles.length) * 100);
};

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [stage, setStage] = useState('All');
  const [mySkills, setMySkills] = useState([]);
  const [showSkillMatch, setShowSkillMatch] = useState(false);

  useEffect(() => {
    if (user) {
      getMyProfile().then(res => {
        const offers = res.data.skills?.filter(s => s.type === 'offer').map(s => s.name.toLowerCase()) || [];
        setMySkills(offers);
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    getAllProjects({
      search: search || undefined,
      category: category !== 'All' ? category : undefined,
      stage: stage !== 'All' ? stage : undefined,
    })
      .then(res => {
        const data = res.data.length > 0 ? res.data : sampleProjects;
        setProjects(data);
      })
      .catch(() => setProjects(sampleProjects))
      .finally(() => setLoading(false));
  }, [search, category, stage]);

  const matchedProjects = useMemo(() => {
    if (!mySkills.length) return projects;
    return projects.filter(p =>
      p.roles?.some(r =>
        r.skillsNeeded?.split(',').some(s =>
          mySkills.some(skill => s.toLowerCase().includes(skill) || skill.includes(s.trim().toLowerCase()))
        )
      )
    );
  }, [projects, mySkills]);

  const displayProjects = showSkillMatch && matchedProjects.length > 0 ? matchedProjects : projects;

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discover Projects</h1>
            <p className="text-gray-500 mt-1">Find projects that need your skills</p>
          </div>
          <button
            onClick={() => navigate('/projects/new')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" /> Post a Project
          </button>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </motion.div>

        {matchedProjects.length > 0 && mySkills.length > 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}
            className="bg-violet-50 border border-violet-100 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-violet-800 font-medium">
              ✨ We found {matchedProjects.length} project{matchedProjects.length !== 1 ? 's' : ''} that need your skills!
            </p>
            <button
              onClick={() => setShowSkillMatch(!showSkillMatch)}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-bold hover:bg-violet-700 transition"
            >
              {showSkillMatch ? 'Show All Projects' : 'Show Matches'}
            </button>
          </motion.div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${category === c ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {STAGES.map(s => (
            <button key={s} onClick={() => setStage(s)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${stage === s ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
                <LoadingSkeleton className="h-32 w-full rounded-xl" />
                <LoadingSkeleton className="h-6 w-3/4" />
                <LoadingSkeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : displayProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 mb-4">No projects yet. Be the first to post one!</p>
            <button onClick={() => navigate('/projects/new')} className="px-6 py-2 bg-violet-600 text-white rounded-xl font-bold">
              Post a Project
            </button>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map(project => {
              const gradient = CATEGORY_GRADIENTS[project.category] || 'from-violet-600 to-indigo-700';
              const health = getHealthScore(project.roles);
              const skillTags = getSkillTags(project.roles);
              const memberAvatars = project.members?.slice(0, 4) || [];

              return (
                <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
                  <div className={`h-32 bg-gradient-to-br ${gradient} relative`}>
                    {project.coverImage ? (
                      <img src={project.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : null}
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold ${STAGE_COLORS[project.stage] || STAGE_COLORS.Idea}`}>
                      {project.stage}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-1">{project.tagline}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <img src={project.admin?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.admin?.username}`} className="w-7 h-7 rounded-full" alt="" />
                      <span className="text-xs text-gray-500">by <span className="font-semibold text-gray-700">{project.admin?.name}</span></span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {skillTags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-violet-50 text-violet-700 text-xs rounded-md font-medium">{tag}</span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex -space-x-2">
                        {memberAvatars.length > 0 ? memberAvatars.map((m, i) => (
                          <img key={i} src={m.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-7 h-7 rounded-full border-2 border-white" alt="" />
                        )) : (
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"><Users className="w-3.5 h-3.5 text-gray-400" /></div>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{project._count?.members ?? project.members?.length ?? 0} members</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Roles filled</span>
                        <span>{health}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-1.5 rounded-full" style={{ width: `${health}%` }}></div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="mt-auto w-full py-2.5 bg-gray-50 hover:bg-violet-50 text-violet-700 border border-gray-200 hover:border-violet-200 rounded-xl text-sm font-bold transition"
                    >
                      View Project
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Projects;
