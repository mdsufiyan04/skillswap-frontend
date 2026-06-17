import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ExternalLink, Palette, Globe, Play, Crown, Send, X, Plus,
  FileText, Video, Wrench, BookOpen, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/navbar/Navbar';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import {
  getProjectById, applyToProject, getApplications, updateApplication,
  getProjectMessages, sendProjectMessage, createProjectPost,
  getProjectTasks, createProjectTask, updateProjectTask
} from '../api/services';
import { useAuth } from '../context/AuthContext';

const STAGE_COLORS = {
  Idea: 'bg-apple-bg text-apple-black border border-apple-border',
  Building: 'bg-apple-bg text-apple-black border border-apple-border',
  Beta: 'bg-apple-bg text-apple-black border border-apple-border',
  Launched: 'bg-black text-white border border-black',
};

const RESOURCE_ICONS = { Video, Article: FileText, Document: BookOpen, Tool: Wrench };
const TASK_STATUSES = ['todo', 'inprogress', 'done'];
const TASK_LABELS = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' };
const NEXT_STATUS = { todo: 'inprogress', inprogress: 'done', done: 'todo' };

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const isResourcePost = (content) => content?.startsWith('__resource__');
const parseResource = (content) => {
  try { return JSON.parse(content.replace('__resource__', '')); } catch { return null; }
};
const makeResourceContent = (data) => `__resource__${JSON.stringify(data)}`;

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newPost, setNewPost] = useState('');
  const [newTask, setNewTask] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [contributionLevel, setContributionLevel] = useState('Part-time');
  const [resourceForm, setResourceForm] = useState({ title: '', url: '', type: 'Video' });
  const [showAddTask, setShowAddTask] = useState(false);

  const fetchProject = () => {
    getProjectById(id)
      .then(res => setProject(res.data))
      .catch(() => toast.error('Project not found'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProject(); }, [id]);

  const isAdmin = project?.adminId === user?.id;
  const isMember = project?.members?.some(m => m.userId === user?.id);
  const hasAccess = isAdmin || isMember;

  useEffect(() => {
    if (isAdmin && activeTab === 'team') {
      getApplications(id).then(res => setApplications(res.data)).catch(console.error);
    }
  }, [isAdmin, activeTab, id]);

  useEffect(() => {
    if (activeTab === 'workspace' && hasAccess) {
      getProjectTasks(id).then(res => setTasks(res.data)).catch(console.error);
    }
  }, [activeTab, hasAccess, id]);

  useEffect(() => {
    if (activeTab === 'workspace' && hasAccess) {
      const fetch = () => getProjectMessages(id).then(res => setMessages(res.data)).catch(console.error);
      fetch();
      const interval = setInterval(fetch, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, hasAccess, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleApply = async () => {
    if (!applyMessage.trim()) return toast.error('Please write a message');
    try {
      await applyToProject(id, { roleId: selectedRole.id, message: applyMessage, contributionLevel });
      toast.success('Application submitted!');
      setShowApplyModal(false);
      setApplyMessage('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to apply');
    }
  };

  const handleAcceptApp = async (appId) => {
    try {
      await updateApplication(id, appId, 'accepted');
      toast.success('Application accepted!');
      fetchProject();
      getApplications(id).then(res => setApplications(res.data));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const handleRejectApp = async (appId) => {
    try {
      await updateApplication(id, appId, 'rejected');
      toast.success('Application declined');
      getApplications(id).then(res => setApplications(res.data));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await sendProjectMessage(id, newMessage);
      setNewMessage('');
      const res = await getProjectMessages(id);
      setMessages(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send');
    }
  };

  const handlePostUpdate = async () => {
    if (!newPost.trim()) return;
    try {
      await createProjectPost(id, newPost);
      setNewPost('');
      fetchProject();
      toast.success('Update posted!');
    } catch (err) {
      toast.error('Failed to post update');
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!resourceForm.title || !resourceForm.url) return;
    try {
      await createProjectPost(id, makeResourceContent(resourceForm));
      setResourceForm({ title: '', url: '', type: 'Video' });
      fetchProject();
      toast.success('Resource added!');
    } catch (err) {
      toast.error('Failed to add resource');
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      await createProjectTask(id, { title: newTask });
      setNewTask('');
      setShowAddTask(false);
      const res = await getProjectTasks(id);
      setTasks(res.data);
      toast.success('Task created!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleMoveTask = async (task) => {
    try {
      const next = NEXT_STATUS[task.status] || 'todo';
      await updateProjectTask(id, task.id, next);
      const res = await getProjectTasks(id);
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
          <LoadingSkeleton className="h-64 w-full rounded-[24px]" />
          <LoadingSkeleton className="h-12 w-1/2" />
          <LoadingSkeleton className="h-96 w-full rounded-[24px]" />
        </div>
      </div>
    );
  }

  if (!project) return null;

  const wallPosts = project.posts?.filter(p => !isResourcePost(p.content)) || [];
  const resources = project.posts?.filter(p => isResourcePost(p.content)).map(p => ({ ...parseResource(p.content), id: p.id, author: p.author })).filter(Boolean) || [];
  const pendingApps = applications.filter(a => a.status === 'pending');
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'team', label: 'Team' },
    ...(hasAccess ? [{ id: 'workspace', label: 'Workspace' }] : []),
    ...(hasAccess ? [{ id: 'resources', label: 'Resources' }] : []),
  ];

  return (
    <div className="min-h-screen bg-white text-apple-black font-sans pb-12">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-apple-border mb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-[980px] text-[12px] uppercase tracking-[0.08em] font-medium ${STAGE_COLORS[project.stage]}`}>
                {project.stage}
              </span>
              <span className="px-4 py-1.5 rounded-[980px] text-[12px] uppercase tracking-[0.08em] font-medium border border-apple-border text-apple-gray bg-apple-bg">
                {project.category}
              </span>
            </div>
            <h1 className="text-[48px] font-bold mb-4 tracking-[-0.02em] leading-tight text-apple-black">{project.title}</h1>
            <p className="text-apple-gray text-[19px] mb-10 max-w-2xl font-normal leading-relaxed">{project.tagline}</p>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-4 pr-6">
                <img src={project.admin?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.admin?.username}`} className="w-12 h-12 rounded-full border border-apple-border" alt="" />
                <div>
                  <p className="font-semibold text-[14px] text-apple-black">{project.admin?.name}</p>
                  <p className="text-[12px] text-apple-gray uppercase tracking-[0.08em]">{project.admin?.college}</p>
                </div>
              </div>
              <div className="flex gap-3 ml-auto">
                {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="p-3 bg-apple-bg border border-apple-border rounded-full hover:border-apple-black transition-colors text-apple-black"><ExternalLink className="w-5 h-5" /></a>}
                {project.figmaUrl && <a href={project.figmaUrl} target="_blank" rel="noreferrer" className="p-3 bg-apple-bg border border-apple-border rounded-full hover:border-apple-black transition-colors text-apple-black"><Palette className="w-5 h-5" /></a>}
                {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" className="p-3 bg-apple-bg border border-apple-border rounded-full hover:border-apple-black transition-colors text-apple-black"><Play className="w-5 h-5" /></a>}
                {project.websiteUrl && <a href={project.websiteUrl} target="_blank" rel="noreferrer" className="p-3 bg-apple-bg border border-apple-border rounded-full hover:border-apple-black transition-colors text-apple-black"><Globe className="w-5 h-5" /></a>}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-10">
              {!isAdmin && !isMember && (
                <button onClick={() => { setSelectedRole(null); setShowApplyModal(true); }}
                  className="px-8 py-3 bg-black text-white rounded-full font-medium text-[14px] uppercase tracking-[0.08em] hover:bg-gray-800 transition-colors">
                  Apply to Contribute
                </button>
              )}
              {isAdmin && (
                <button onClick={() => setActiveTab('team')}
                  className="px-8 py-3 border border-black text-black rounded-full font-medium text-[14px] uppercase tracking-[0.08em] hover:bg-apple-bg transition-colors">
                  Manage Project
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-[980px] text-[14px] uppercase tracking-[0.08em] font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-apple-black text-white' : 'bg-white text-apple-gray border border-apple-border hover:text-apple-black'}`}>
              {tab.label}
              {tab.id === 'team' && pendingApps.length > 0 && isAdmin && (
                <span className="ml-3 px-2 py-0.5 bg-white border border-apple-border text-apple-black text-[10px] rounded-full">{pendingApps.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[24px] border border-apple-border p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div>
                <h3 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em] mb-4">About</h3>
                <p className="text-[17px] text-apple-gray leading-relaxed whitespace-pre-wrap">{project.description}</p>
              </div>

              <div>
                <h3 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em] mb-6">Open Roles</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {project.roles?.map(role => (
                    <div key={role.id} className="p-6 border border-apple-border rounded-[24px] bg-apple-bg flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-apple-black text-[19px]">{role.title}</h4>
                        <span className={`px-3 py-1 text-[12px] uppercase tracking-[0.08em] font-medium rounded-[980px] border ${role.filled ? 'bg-white border-apple-border text-apple-gray' : 'bg-apple-black text-white border-apple-black'}`}>
                          {role.filled ? 'Filled' : 'Open'}
                        </span>
                      </div>
                      <p className="text-[14px] text-apple-gray mb-6 flex-1 leading-relaxed">{role.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {role.skillsNeeded?.split(',').map(s => (
                          <span key={s} className="px-3 py-1.5 bg-white border border-apple-border text-[12px] uppercase tracking-[0.08em] font-medium rounded-[980px] text-apple-black">{s.trim()}</span>
                        ))}
                      </div>
                      {!role.filled && !isAdmin && !isMember && (
                        <button onClick={() => { setSelectedRole(role); setShowApplyModal(true); }}
                          className="w-full py-3.5 bg-white border border-apple-black text-apple-black hover:bg-apple-black hover:text-white rounded-[980px] text-[14px] uppercase tracking-[0.08em] font-medium transition-colors">
                          Apply for this Role
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em] mb-6">Project Wall</h3>
                {hasAccess && (
                  <div className="mb-8 flex flex-col gap-4">
                    <textarea value={newPost} onChange={e => setNewPost(e.target.value)} rows={3} placeholder="Share an update with the team..."
                      className="w-full p-4 bg-apple-bg border border-apple-border rounded-[16px] text-[14px] focus:outline-none focus:border-apple-black transition-colors resize-none placeholder-apple-gray" />
                    <button onClick={handlePostUpdate} className="px-6 py-3 bg-apple-black text-white rounded-[980px] text-[14px] uppercase tracking-[0.08em] font-medium self-end hover:bg-[#333333] transition-colors">Post Update</button>
                  </div>
                )}
                {wallPosts.length === 0 ? (
                  <p className="text-[14px] text-apple-gray text-center py-8 border border-apple-border rounded-[16px]">No updates yet.</p>
                ) : (
                  <div className="space-y-4">
                    {wallPosts.map(post => (
                      <div key={post.id} className="flex gap-4 p-6 bg-white border border-apple-border rounded-[24px]">
                        <img src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.id}`} className="w-10 h-10 rounded-full border border-apple-border flex-shrink-0" alt="" />
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-[14px] text-apple-black">{post.author?.name}</span>
                            <span className="text-[12px] text-apple-gray uppercase tracking-[0.08em]">{timeAgo(post.createdAt)}</span>
                          </div>
                          <p className="text-[14px] text-apple-gray leading-relaxed">{post.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div>
                <h3 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em] mb-6">Project Admin</h3>
                <div className="flex items-center gap-5 p-6 bg-apple-bg border border-apple-border rounded-[24px]">
                  <img src={project.admin?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.admin?.username}`} className="w-16 h-16 rounded-full border border-apple-border" alt="" />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-apple-black text-[19px]">{project.admin?.name}</h4>
                      <Crown className="w-5 h-5 text-apple-black" />
                    </div>
                    <p className="text-[12px] text-apple-gray uppercase tracking-[0.08em] font-medium">{project.admin?.college}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em] mb-6">Team Members</h3>
                {project.members?.length === 0 ? (
                  <p className="text-[14px] text-apple-gray text-center py-8 border border-apple-border rounded-[16px]">No team members yet.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {project.members?.map(member => (
                      <div key={member.id} className="p-6 border border-apple-border rounded-[24px]">
                        <div className="flex items-center gap-4 mb-4">
                          <img src={member.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user?.username}`} className="w-14 h-14 rounded-full border border-apple-border" alt="" />
                          <div>
                            <h4 className="font-semibold text-[17px] text-apple-black">{member.user?.name}</h4>
                            <p className="text-[12px] text-apple-gray uppercase tracking-[0.08em] font-medium">{member.user?.college}</p>
                          </div>
                        </div>
                        <p className="text-[14px] font-medium text-apple-black mb-3 border-b border-apple-border pb-3">{member.role?.title}</p>
                        <span className="px-3 py-1 bg-apple-bg border border-apple-border text-apple-black text-[12px] uppercase tracking-[0.08em] font-medium rounded-[980px]">{member.contributionLevel}</span>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {member.user?.skills?.filter(s => s.type === 'offer').slice(0, 3).map(s => (
                            <span key={s.id} className="px-3 py-1.5 bg-white border border-apple-border text-apple-gray text-[12px] uppercase tracking-[0.08em] font-medium rounded-[980px]">{s.name}</span>
                          ))}
                        </div>
                        <Link to={`/profile/${member.user?.id}`} className="text-[14px] text-apple-black hover:underline mt-6 inline-block font-medium">View Profile →</Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isAdmin && (
                <div>
                  <h3 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em] mb-6">Applications {pendingApps.length > 0 && <span className="text-apple-gray text-[19px]">({pendingApps.length} pending)</span>}</h3>
                  {applications.length === 0 ? (
                    <p className="text-[14px] text-apple-gray text-center py-8 border border-apple-border rounded-[16px]">No applications yet.</p>
                  ) : (
                    <div className="space-y-6">
                      {applications.map(app => (
                        <div key={app.id} className="p-6 border border-apple-border rounded-[24px]">
                          <div className="flex items-start gap-4 mb-6">
                            <img src={app.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.user?.id}`} className="w-14 h-14 rounded-full border border-apple-border" alt="" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-apple-black text-[19px] mb-1">{app.user?.name}</h4>
                              <p className="text-[12px] text-apple-gray uppercase tracking-[0.08em] font-medium mb-2">{app.user?.college} · ⭐ {app.user?.rating?.toFixed(1)}</p>
                              <p className="text-[14px] text-apple-black font-medium mb-1">Applied for: {app.role?.title}</p>
                              <p className="text-[12px] text-apple-gray uppercase tracking-[0.08em] font-medium">Contribution: {app.contributionLevel}</p>
                            </div>
                            <span className={`px-3 py-1 text-[12px] uppercase tracking-[0.08em] font-medium rounded-[980px] border ${app.status === 'pending' ? 'bg-white border-apple-border text-apple-black' : app.status === 'accepted' ? 'bg-apple-black border-apple-black text-white' : 'bg-apple-bg border-apple-border text-apple-gray line-through'}`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-[14px] text-apple-gray bg-apple-bg border border-apple-border p-4 rounded-[16px] italic leading-relaxed mb-6">"{app.message}"</p>
                          {app.status === 'pending' && (
                            <div className="flex gap-4">
                              <button onClick={() => handleAcceptApp(app.id)} className="flex-1 py-3 bg-apple-black text-white rounded-[980px] text-[14px] uppercase tracking-[0.08em] font-medium hover:bg-[#333333] transition-colors">Accept</button>
                              <button onClick={() => handleRejectApp(app.id)} className="flex-1 py-3 bg-white text-apple-black border border-apple-black rounded-[980px] text-[14px] uppercase tracking-[0.08em] font-medium hover:bg-apple-bg transition-colors">Decline</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Workspace Tab */}
          {activeTab === 'workspace' && (
            !hasAccess ? (
              <div className="text-center py-20 text-apple-gray border border-apple-border rounded-[24px]">
                <p className="font-medium text-[17px] mb-6">Join the team to access the workspace</p>
                <button onClick={() => setShowApplyModal(true)} className="px-8 py-3 bg-apple-black text-white rounded-[980px] font-medium text-[14px] uppercase tracking-[0.08em] hover:bg-[#333333] transition-colors">Apply Now</button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-5 gap-8">
                {/* Chat */}
                <div className="lg:col-span-3 flex flex-col h-[600px] border border-apple-border rounded-[24px] overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-apple-border bg-apple-bg">
                    <h3 className="font-semibold text-apple-black text-[19px]">Team Chat</h3>
                    <span className="text-[12px] uppercase tracking-[0.08em] font-medium text-apple-gray">{(project.members?.length || 0) + 1} members</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-white">
                    {messages.length === 0 ? (
                      <p className="text-center text-apple-gray text-[14px] py-8">No messages yet. Say hello!</p>
                    ) : messages.map(msg => {
                      const isMe = msg.senderId === user?.id;
                      return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                          {!isMe && <img src={msg.sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender?.id}`} className="w-8 h-8 rounded-full border border-apple-border flex-shrink-0" alt="" />}
                          <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                            {!isMe && <span className="text-[12px] uppercase tracking-[0.08em] font-medium text-apple-gray mb-1">{msg.sender?.name}</span>}
                            <div className={`px-4 py-3 rounded-[18px] text-[14px] leading-relaxed ${isMe ? 'bg-apple-black text-white rounded-tr-[4px]' : 'bg-apple-bg border border-apple-border text-apple-black rounded-tl-[4px]'}`}>
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-apple-gray uppercase tracking-[0.08em] mt-2 font-medium">{formatTime(msg.createdAt)}</span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="flex gap-3 p-4 border-t border-apple-border bg-white">
                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..." className="flex-1 px-5 py-3 bg-apple-bg border border-apple-border rounded-[980px] text-[14px] focus:outline-none focus:border-apple-black transition-colors placeholder-apple-gray" />
                    <button onClick={handleSendMessage} className="p-3 bg-apple-black text-white rounded-full hover:bg-[#333333] transition-colors flex items-center justify-center"><Send className="w-5 h-5" /></button>
                  </div>
                </div>

                {/* Kanban */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-apple-border">
                    <h3 className="font-semibold text-apple-black text-[19px]">Tasks</h3>
                    <button onClick={() => setShowAddTask(true)} className="text-[12px] uppercase tracking-[0.08em] font-medium text-apple-black hover:opacity-70 transition-opacity flex items-center gap-1">
                      <Plus className="w-4 h-4"/> Add Task
                    </button>
                  </div>
                  {showAddTask && (
                    <div className="flex flex-col gap-3 mb-6 p-4 bg-apple-bg border border-apple-border rounded-[16px]">
                      <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Task title..."
                        className="w-full px-4 py-2 bg-white border border-apple-border rounded-[8px] text-[14px] focus:outline-none focus:border-apple-black transition-colors" />
                      <div className="flex gap-2">
                        <button onClick={handleAddTask} className="flex-1 py-2 bg-apple-black text-white rounded-[8px] text-[12px] uppercase tracking-[0.08em] font-medium">Add</button>
                        <button onClick={() => setShowAddTask(false)} className="flex-1 py-2 bg-white border border-apple-border text-apple-black rounded-[8px] text-[12px] uppercase tracking-[0.08em] font-medium">Cancel</button>
                      </div>
                    </div>
                  )}
                  <div className="space-y-6">
                    {TASK_STATUSES.map(status => (
                      <div key={status} className="bg-apple-bg p-4 rounded-[16px] border border-apple-border">
                        <p className="text-[12px] font-medium text-apple-black uppercase tracking-[0.08em] mb-4">{TASK_LABELS[status]}</p>
                        <div className="space-y-3 min-h-[40px]">
                          {tasks.filter(t => t.status === status).map(task => (
                            <div key={task.id} onClick={() => handleMoveTask(task)}
                              className="p-4 bg-white border border-apple-border rounded-[12px] cursor-pointer hover:border-apple-black transition-colors group">
                              <p className="text-[14px] font-medium text-apple-black leading-snug">{task.title}</p>
                              <p className="text-[10px] uppercase tracking-[0.08em] text-apple-gray mt-3 group-hover:text-apple-black transition-colors">Click to move →</p>
                            </div>
                          ))}
                          {tasks.filter(t => t.status === status).length === 0 && (
                            <p className="text-[12px] text-apple-gray italic text-center py-2">Empty</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            !hasAccess ? (
              <div className="text-center py-20 text-apple-gray border border-apple-border rounded-[24px]">Join the team to access resources.</div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <form onSubmit={handleAddResource} className="p-6 bg-apple-bg rounded-[24px] border border-apple-border space-y-4">
                  <h3 className="font-semibold text-apple-black text-[19px]">Add Resource</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Title" value={resourceForm.title} onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })}
                      className="p-3 border border-apple-border bg-white rounded-[12px] text-[14px] focus:outline-none focus:border-apple-black transition-colors placeholder-apple-gray" />
                    <input type="url" placeholder="URL" value={resourceForm.url} onChange={e => setResourceForm({ ...resourceForm, url: e.target.value })}
                      className="p-3 border border-apple-border bg-white rounded-[12px] text-[14px] focus:outline-none focus:border-apple-black transition-colors placeholder-apple-gray" />
                    <select value={resourceForm.type} onChange={e => setResourceForm({ ...resourceForm, type: e.target.value })}
                      className="p-3 border border-apple-border bg-white rounded-[12px] text-[14px] focus:outline-none focus:border-apple-black transition-colors text-apple-black">
                      {['Video', 'Article', 'Tool', 'Document'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button type="submit" className="py-3 bg-apple-black text-white rounded-[12px] text-[14px] uppercase tracking-[0.08em] font-medium hover:bg-[#333333] transition-colors">Add Resource</button>
                  </div>
                </form>
                <div className="grid sm:grid-cols-2 gap-6">
                  {resources.length === 0 ? (
                    <p className="text-[14px] text-apple-gray col-span-2 text-center py-8 border border-apple-border rounded-[16px]">No resources shared yet.</p>
                  ) : resources.map(r => {
                    const Icon = RESOURCE_ICONS[r.type] || ExternalLink;
                    return (
                      <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="flex items-start gap-4 p-6 border border-apple-border rounded-[24px] hover:border-apple-black transition-colors group bg-white">
                        <div className="p-3 bg-apple-bg rounded-[12px] text-apple-black group-hover:bg-apple-black group-hover:text-white transition-colors"><Icon className="w-5 h-5" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-apple-black text-[17px] truncate mb-1">{r.title}</p>
                          <span className="text-[10px] px-2 py-1 bg-white border border-apple-border text-apple-gray uppercase tracking-[0.08em] rounded-[4px] font-medium inline-block mb-2">{r.type}</span>
                          <p className="text-[12px] text-apple-gray truncate">{r.url}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            )
          )}
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden border border-apple-border">
            <div className="p-6 border-b border-apple-border flex justify-between items-center bg-white">
              <h3 className="font-semibold text-[19px] text-apple-black tracking-[-0.01em]">Apply to Contribute</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-apple-gray hover:text-apple-black transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-apple-gray mb-2">Select Role</label>
                <select value={selectedRole?.id || ''} onChange={e => setSelectedRole(project.roles?.find(r => r.id === parseInt(e.target.value)))}
                  className="w-full p-4 border border-apple-border bg-apple-bg rounded-[12px] text-[14px] focus:outline-none focus:border-apple-black transition-colors text-apple-black">
                  <option value="">Choose a role...</option>
                  {project.roles?.filter(r => !r.filled).map(r => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-apple-gray mb-2">Contribution Level</label>
                <select value={contributionLevel} onChange={e => setContributionLevel(e.target.value)}
                  className="w-full p-4 border border-apple-border bg-apple-bg rounded-[12px] text-[14px] focus:outline-none focus:border-apple-black transition-colors text-apple-black">
                  {['Full-time', 'Part-time', 'Mentor', 'One-time'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-apple-gray mb-2">Message</label>
                <textarea rows={4} value={applyMessage} onChange={e => setApplyMessage(e.target.value)}
                  placeholder="Tell the team why you'd be a great fit..."
                  className="w-full p-4 border border-apple-border bg-apple-bg rounded-[16px] text-[14px] focus:outline-none focus:border-apple-black transition-colors resize-none placeholder-apple-gray text-apple-black" />
              </div>
              <button onClick={handleApply} disabled={!selectedRole}
                className="w-full py-4 bg-apple-black text-white rounded-[980px] text-[14px] uppercase tracking-[0.08em] font-medium disabled:opacity-50 hover:bg-[#333333] transition-colors mt-2">
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
