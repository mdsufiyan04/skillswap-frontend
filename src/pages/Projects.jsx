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
  Idea: 'bg-white border border-apple-border text-apple-black',
  Building: 'bg-apple-bg text-apple-black',
  Beta: 'bg-apple-bg text-apple-black',
  Launched: 'bg-apple-black text-white',
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
    <div className="min-h-screen bg-white text-apple-black font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-[48px] font-bold text-apple-black tracking-[-0.02em] leading-tight">Discover Projects</h1>
            <p className="text-[19px] text-apple-gray mt-2 font-normal">Find projects that need your skills.</p>
          </div>
          <button
            onClick={() => navigate('/projects/new')}
            className="flex items-center gap-2 px-6 py-3 bg-apple-black text-white rounded-[980px] font-medium hover:bg-[#333333] transition-colors"
          >
            <Plus className="w-5 h-5" /> Post a Project
          </button>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white p-6 rounded-[24px] border border-apple-border mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-apple-bg border border-apple-border rounded-[12px] text-[17px] focus:outline-none focus:border-apple-black transition-colors placeholder-apple-gray"
            />
          </div>
        </motion.div>

        {matchedProjects.length > 0 && mySkills.length > 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}
            className="bg-apple-bg border border-apple-border rounded-[24px] p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-apple-black font-medium text-[17px]">
              ✨ We found {matchedProjects.length} project{matchedProjects.length !== 1 ? 's' : ''} that need your skills!
            </p>
            <button
              onClick={() => setShowSkillMatch(!showSkillMatch)}
              className="px-6 py-2 bg-white border border-apple-border text-apple-black rounded-[980px] text-[14px] font-medium hover:bg-apple-bg transition-colors uppercase tracking-[0.08em]"
            >
              {showSkillMatch ? 'Show All' : 'Show Matches'}
            </button>
          </motion.div>
        )}

        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-[980px] text-[14px] uppercase tracking-[0.08em] font-medium transition-colors ${category === c ? 'bg-apple-black text-white' : 'bg-white text-apple-gray border border-apple-border hover:text-apple-black'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide">
          {STAGES.map(s => (
            <button key={s} onClick={() => setStage(s)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-[980px] text-[14px] uppercase tracking-[0.08em] font-medium transition-colors ${stage === s ? 'bg-apple-black text-white' : 'bg-white text-apple-gray border border-apple-border hover:text-apple-black'}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
               <div key={i} className="bg-white rounded-[24px] p-6 border border-apple-border space-y-4">
                <LoadingSkeleton className="h-40 w-full rounded-[16px]" />
                <LoadingSkeleton className="h-8 w-3/4" />
                <LoadingSkeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        ) : displayProjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[24px] border border-apple-border">
            <p className="text-[19px] text-apple-gray mb-6">No projects yet. Be the first to post one!</p>
            <button onClick={() => navigate('/projects/new')} className="px-8 py-3 bg-apple-black text-white rounded-[980px] font-medium hover:bg-[#333333] transition-colors">
              Post a Project
            </button>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map(project => {
              const health = getHealthScore(project.roles);
              const skillTags = getSkillTags(project.roles);
              const memberAvatars = project.members?.slice(0, 4) || [];

              return (
                <div key={project.id} className="bg-white rounded-[24px] border border-apple-border overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300">
                  <div className={`h-40 bg-apple-bg relative flex items-center justify-center border-b border-apple-border`}>
                    {project.coverImage ? (
                      <img src={project.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-apple-gray opacity-20">
                         <Search className="w-12 h-12" />
                      </div>
                    )}
                    <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-[980px] text-[12px] uppercase tracking-[0.08em] font-medium ${STAGE_COLORS[project.stage] || STAGE_COLORS.Idea}`}>
                      {project.stage}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-[24px] font-semibold text-apple-black tracking-[-0.01em] mb-2 line-clamp-1">{project.title}</h3>
                    <p className="text-[14px] text-apple-gray mb-6 line-clamp-2 leading-relaxed">{project.tagline}</p>

                    <div className="flex items-center gap-3 mb-6">
                      <img src={project.admin?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.admin?.username}`} className="w-8 h-8 rounded-full border border-apple-border" alt="" />
                      <span className="text-[12px] text-apple-gray uppercase tracking-[0.08em] font-medium">by <span className="text-apple-black">{project.admin?.name}</span></span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {skillTags.map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-apple-bg border border-apple-border text-apple-black text-[12px] uppercase tracking-[0.08em] rounded-[980px] font-medium">{tag}</span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex -space-x-3">
                        {memberAvatars.length > 0 ? memberAvatars.map((m, i) => (
                          <img key={i} src={m.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                        )) : (
                          <div className="w-8 h-8 rounded-full bg-apple-bg border border-apple-border flex items-center justify-center"><Users className="w-4 h-4 text-apple-gray" /></div>
                        )}
                      </div>
                      <span className="text-[12px] text-apple-gray uppercase tracking-[0.08em] font-medium">{project._count?.members ?? project.members?.length ?? 0} members</span>
                    </div>

                    <div className="mb-8">
                      <div className="flex justify-between text-[12px] uppercase tracking-[0.08em] text-apple-gray font-medium mb-2">
                        <span>Roles filled</span>
                        <span>{health}%</span>
                      </div>
                      <div className="w-full bg-apple-bg rounded-full h-[4px] overflow-hidden">
                        <div className="bg-apple-black h-[4px] rounded-full transition-all duration-500" style={{ width: `${health}%` }}></div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="mt-auto w-full py-3.5 bg-white hover:bg-apple-bg text-apple-black border border-apple-black rounded-[980px] text-[14px] uppercase tracking-[0.08em] font-medium transition-colors"
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
