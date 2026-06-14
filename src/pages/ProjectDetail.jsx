import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ExternalLink, Palette, Globe, Play, Crown, Send, X,
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

const STAGE_COLORS = {
  Idea: 'bg-gray-100 text-gray-700',
  Building: 'bg-blue-100 text-blue-700',
  Beta: 'bg-orange-100 text-orange-700',
  Launched: 'bg-green-100 text-green-700',
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
      <div className="min-h-screen bg-[#F8F7FF]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <LoadingSkeleton className="h-48 w-full rounded-2xl" />
          <LoadingSkeleton className="h-8 w-1/2" />
          <LoadingSkeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!project) return null;

  const gradient = CATEGORY_GRADIENTS[project.category] || 'from-violet-600 to-indigo-700';
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
    <div className="min-h-screen bg-[#F8F7FF] pb-12">
      <Navbar />

      {/* Header */}
      <div className={`bg-gradient-to-br ${gradient} text-white`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${STAGE_COLORS[project.stage]} !text-inherit bg-white/20 backdrop-blur text-white border border-white/30`}>
              {project.stage}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-white/20 backdrop-blur border border-white/30">{project.category}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-white/80 text-lg mb-6">{project.tagline}</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={project.admin?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.admin?.username}`} className="w-10 h-10 rounded-full border-2 border-white/50" alt="" />
              <div>
                <p className="font-semibold">{project.admin?.name}</p>
                <p className="text-sm text-white/70">{project.admin?.college}</p>
              </div>
            </div>
            <div className="flex gap-2 ml-auto">
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"><ExternalLink className="w-5 h-5" /></a>}
              {project.figmaUrl && <a href={project.figmaUrl} target="_blank" rel="noreferrer" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"><Palette className="w-5 h-5" /></a>}
              {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"><Play className="w-5 h-5" /></a>}
              {project.websiteUrl && <a href={project.websiteUrl} target="_blank" rel="noreferrer" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"><Globe className="w-5 h-5" /></a>}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            {!isAdmin && !isMember && (
              <button onClick={() => { setSelectedRole(null); setShowApplyModal(true); }}
                className="px-6 py-2.5 bg-white text-violet-700 rounded-xl font-bold hover:shadow-lg transition">
                Apply to Contribute
              </button>
            )}
            {isAdmin && (
              <button onClick={() => setActiveTab('team')}
                className="px-6 py-2.5 bg-white/20 border border-white/40 rounded-xl font-bold hover:bg-white/30 transition">
                Manage Project
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition ${activeTab === tab.id ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {tab.label}
              {tab.id === 'team' && pendingApps.length > 0 && isAdmin && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{pendingApps.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4">Open Roles</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.roles?.map(role => (
                    <div key={role.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900">{role.title}</h4>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-lg ${role.filled ? 'bg-green-100 text-green-700' : 'bg-violet-100 text-violet-700'}`}>
                          {role.filled ? 'Filled' : 'Open'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {role.skillsNeeded?.split(',').map(s => (
                          <span key={s} className="px-2 py-0.5 bg-white border border-gray-200 text-xs rounded-md text-gray-600">{s.trim()}</span>
                        ))}
                      </div>
                      {!role.filled && !isAdmin && !isMember && (
                        <button onClick={() => { setSelectedRole(role); setShowApplyModal(true); }}
                          className="w-full py-2 bg-violet-600 text-white rounded-lg text-sm font-bold hover:bg-violet-700 transition">
                          Apply for this Role
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4">Project Wall</h3>
                {hasAccess && (
                  <div className="mb-4 flex gap-2">
                    <textarea value={newPost} onChange={e => setNewPost(e.target.value)} rows={2} placeholder="Share an update with the team..."
                      className="flex-1 p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none" />
                    <button onClick={handlePostUpdate} className="px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold self-end hover:bg-violet-700">Post</button>
                  </div>
                )}
                {wallPosts.length === 0 ? (
                  <p className="text-sm text-gray-500">No updates yet.</p>
                ) : (
                  <div className="space-y-4">
                    {wallPosts.map(post => (
                      <div key={post.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                        <img src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.id}`} className="w-9 h-9 rounded-full flex-shrink-0" alt="" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-gray-900">{post.author?.name}</span>
                            <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-700">{post.content}</p>
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Project Admin</h3>
                <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <img src={project.admin?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.admin?.username}`} className="w-14 h-14 rounded-full" alt="" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{project.admin?.name}</h4>
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg">Project Admin</span>
                    </div>
                    <p className="text-sm text-gray-500">{project.admin?.college}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4">Team Members</h3>
                {project.members?.length === 0 ? (
                  <p className="text-sm text-gray-500">No team members yet.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.members?.map(member => (
                      <div key={member.id} className="p-4 border border-gray-100 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <img src={member.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user?.username}`} className="w-12 h-12 rounded-full" alt="" />
                          <div>
                            <h4 className="font-bold text-gray-900">{member.user?.name}</h4>
                            <p className="text-xs text-gray-500">{member.user?.college}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-violet-700 mb-1">{member.role?.title}</p>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">{member.contributionLevel}</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {member.user?.skills?.filter(s => s.type === 'offer').slice(0, 3).map(s => (
                            <span key={s.id} className="px-2 py-0.5 bg-gray-100 text-xs rounded-md">{s.name}</span>
                          ))}
                        </div>
                        <Link to={`/profile/${member.user?.id}`} className="text-xs text-violet-600 hover:underline mt-2 inline-block">View Profile →</Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isAdmin && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Applications {pendingApps.length > 0 && `(${pendingApps.length} pending)`}</h3>
                  {applications.length === 0 ? (
                    <p className="text-sm text-gray-500">No applications yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {applications.map(app => (
                        <div key={app.id} className="p-4 border border-gray-100 rounded-xl">
                          <div className="flex items-start gap-3 mb-3">
                            <img src={app.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.user?.id}`} className="w-12 h-12 rounded-full" alt="" />
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900">{app.user?.name}</h4>
                              <p className="text-xs text-gray-500">{app.user?.college} · ⭐ {app.user?.rating?.toFixed(1)}</p>
                              <p className="text-sm text-violet-600 mt-1">Applied for: {app.role?.title}</p>
                              <p className="text-xs text-gray-500">Contribution: {app.contributionLevel}</p>
                            </div>
                            <span className={`px-2 py-0.5 text-xs font-bold rounded-lg ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : app.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic mb-3">"{app.message}"</p>
                          {app.status === 'pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleAcceptApp(app.id)} className="flex-1 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-bold hover:bg-green-100">Accept</button>
                              <button onClick={() => handleRejectApp(app.id)} className="flex-1 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-bold hover:bg-red-100">Decline</button>
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
              <div className="text-center py-12 text-gray-500">
                <p className="font-medium">Join the team to access the workspace</p>
                <button onClick={() => setShowApplyModal(true)} className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-xl font-bold">Apply Now</button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-5 gap-6">
                {/* Chat */}
                <div className="lg:col-span-3 flex flex-col h-[500px]">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Team Chat</h3>
                    <span className="text-xs text-gray-500">{(project.members?.length || 0) + 1} members</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {messages.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-8">No messages yet. Say hello!</p>
                    ) : messages.map(msg => {
                      const isMe = msg.senderId === user?.id;
                      return (
                        <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                          {!isMe && <img src={msg.sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender?.id}`} className="w-7 h-7 rounded-full flex-shrink-0" alt="" />}
                          <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                            {!isMe && <span className="text-xs text-gray-500 mb-0.5">{msg.sender?.name}</span>}
                            <div className={`px-3 py-2 rounded-2xl text-sm ${isMe ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm' : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm'}`}>
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-0.5">{formatTime(msg.createdAt)}</span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-gray-100 mt-3">
                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..." className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                    <button onClick={handleSendMessage} className="p-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700"><Send className="w-5 h-5" /></button>
                  </div>
                </div>

                {/* Kanban */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">Tasks</h3>
                    <button onClick={() => setShowAddTask(true)} className="text-xs font-bold text-violet-600 hover:text-violet-800">+ Add Task</button>
                  </div>
                  {showAddTask && (
                    <div className="flex gap-2 mb-3">
                      <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Task title..."
                        className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                      <button onClick={handleAddTask} className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-bold">Add</button>
                    </div>
                  )}
                  <div className="space-y-4">
                    {TASK_STATUSES.map(status => (
                      <div key={status}>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">{TASK_LABELS[status]}</p>
                        <div className="space-y-2 min-h-[60px]">
                          {tasks.filter(t => t.status === status).map(task => (
                            <div key={task.id} onClick={() => handleMoveTask(task)}
                              className="p-3 bg-gray-50 border border-gray-100 rounded-lg cursor-pointer hover:shadow-sm transition group">
                              <p className="text-sm font-medium text-gray-900">{task.title}</p>
                              <p className="text-xs text-gray-400 mt-1 group-hover:text-violet-600">Click to move →</p>
                            </div>
                          ))}
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
              <div className="text-center py-12 text-gray-500">Join the team to access resources.</div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <form onSubmit={handleAddResource} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                  <h3 className="font-bold text-gray-900">Add Resource</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Title" value={resourceForm.title} onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })}
                      className="p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                    <input type="url" placeholder="URL" value={resourceForm.url} onChange={e => setResourceForm({ ...resourceForm, url: e.target.value })}
                      className="p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                    <select value={resourceForm.type} onChange={e => setResourceForm({ ...resourceForm, type: e.target.value })}
                      className="p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none">
                      {['Video', 'Article', 'Tool', 'Document'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button type="submit" className="py-2.5 bg-violet-600 text-white rounded-lg text-sm font-bold hover:bg-violet-700">Add Resource</button>
                  </div>
                </form>
                <div className="grid sm:grid-cols-2 gap-4">
                  {resources.length === 0 ? (
                    <p className="text-sm text-gray-500 col-span-2">No resources shared yet.</p>
                  ) : resources.map(r => {
                    const Icon = RESOURCE_ICONS[r.type] || ExternalLink;
                    return (
                      <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl hover:shadow-md transition group">
                        <div className="p-2 bg-violet-50 rounded-lg text-violet-600"><Icon className="w-5 h-5" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 group-hover:text-violet-600 truncate">{r.title}</p>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">{r.type}</span>
                          <p className="text-xs text-gray-400 mt-1 truncate">{r.url}</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Apply to Contribute</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
                <select value={selectedRole?.id || ''} onChange={e => setSelectedRole(project.roles?.find(r => r.id === parseInt(e.target.value)))}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none">
                  <option value="">Choose a role...</option>
                  {project.roles?.filter(r => !r.filled).map(r => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contribution Level</label>
                <select value={contributionLevel} onChange={e => setContributionLevel(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none">
                  {['Full-time', 'Part-time', 'Mentor', 'One-time'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={3} value={applyMessage} onChange={e => setApplyMessage(e.target.value)}
                  placeholder="Tell the team why you'd be a great fit..."
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none" />
              </div>
              <button onClick={handleApply} disabled={!selectedRole}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold disabled:opacity-50">
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
