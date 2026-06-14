import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeftRight, Calendar, CheckCircle, Video, Send, Star,
  FileText, Link2, Wrench, BookOpen, X, ExternalLink, Clock
} from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import {
  getExchangeById, updateExchangeProgress, addExchangeResource,
  getMessages, sendMessage, leaveReview
} from '../api/services';
import { useAuth } from '../context/AuthContext';

const RESOURCE_ICONS = {
  Video: Video,
  Article: FileText,
  Document: BookOpen,
  Tool: Wrench,
};

const generateMeetLink = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const part = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * 26)]).join('');
  return `https://meet.google.com/${part(3)}-${part(4)}-${part(3)}`;
};

const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const ExchangeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', topic: '', meetLink: '' });
  const [resourceForm, setResourceForm] = useState({ title: '', url: '', type: 'Video' });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fetchExchange = () => {
    getExchangeById(id)
      .then(res => setExchange(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchExchange(); }, [id]);

  useEffect(() => {
    if (activeTab !== 'chat' || !exchange) return;
    const fetchMsgs = () => getMessages(exchange.id).then(res => setMessages(res.data)).catch(console.error);
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 3000);
    return () => clearInterval(interval);
  }, [activeTab, exchange?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getPartner = () => {
    if (!exchange || !user) return null;
    return exchange.user1Id === user.id ? exchange.user2 : exchange.user1;
  };

  const getMe = () => {
    if (!exchange || !user) return null;
    return exchange.user1Id === user.id ? exchange.user1 : exchange.user2;
  };

  const getMySkill = () => {
    if (!exchange || !user) return '';
    return exchange.user1Id === user.id ? exchange.user1Skill : exchange.user2Skill;
  };

  const getTheirSkill = () => {
    if (!exchange || !user) return '';
    return exchange.user1Id === user.id ? exchange.user2Skill : exchange.user1Skill;
  };

  const handleScheduleOpen = () => {
    setScheduleForm({ date: '', time: '', topic: '', meetLink: generateMeetLink() });
    setShowScheduleModal(true);
  };

  const handleScheduleSave = async () => {
    try {
      setActionLoading(true);
      const res = await updateExchangeProgress(exchange.id, {
        action: 'scheduleSession',
        ...scheduleForm,
        meetLink: scheduleForm.meetLink || generateMeetLink()
      });
      setExchange(res.data);
      setShowScheduleModal(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to schedule session');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      setActionLoading(true);
      const res = await updateExchangeProgress(exchange.id, { action: 'completeSession' });
      setExchange(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to mark session complete');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndExchange = async () => {
    if (!window.confirm('End this exchange? This will unlock the Reviews tab for both users.')) return;
    try {
      setActionLoading(true);
      const res = await updateExchangeProgress(exchange.id, { action: 'endExchange' });
      setExchange(res.data);
      setActiveTab('reviews');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to end exchange');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!resourceForm.title || !resourceForm.url) return;
    try {
      await addExchangeResource(exchange.id, resourceForm);
      setResourceForm({ title: '', url: '', type: 'Video' });
      fetchExchange();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add resource');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await sendMessage(exchange.id, newMessage);
      setNewMessage('');
      const res = await getMessages(exchange.id);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async () => {
    const partner = getPartner();
    if (!partner || !reviewForm.text.trim()) return;
    try {
      setActionLoading(true);
      await leaveReview(exchange.id, {
        targetId: partner.id,
        rating: reviewForm.rating,
        text: reviewForm.text,
        skill: getTheirSkill()
      });
      setReviewSubmitted(true);
      fetchExchange();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!exchange) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF]">
        <p className="text-gray-500">Exchange not found.</p>
      </div>
    );
  }

  const partner = getPartner();
  const me = getMe();
  const isComplete = exchange.status === 'complete';
  const completedSessions = (exchange.sessions?.filter(s => s.completed) || [])
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const upcomingSession = exchange.sessions?.find(s => !s.completed);
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'resources', label: 'Resources' },
    { id: 'chat', label: 'Chat' },
    ...(isComplete ? [{ id: 'reviews', label: 'Reviews' }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FF] pb-24">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={me?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${me?.username}`} className="w-16 h-16 rounded-full border-2 border-violet-200" alt="" />
              <div className="p-2 bg-violet-100 rounded-full">
                <ArrowLeftRight className="w-6 h-6 text-violet-600" />
              </div>
              <img src={partner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.username}`} className="w-16 h-16 rounded-full border-2 border-indigo-200" alt="" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {getMySkill()} ↔ {getTheirSkill()} Exchange
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase ${isComplete ? 'bg-gray-100 text-gray-600' : 'bg-green-50 text-green-700'}`}>
                  {isComplete ? 'Complete' : 'Active'}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Started {formatDate(exchange.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-sm font-bold text-gray-900 mb-2">
                  <span>Overall Completion</span>
                  <span className="text-violet-600">{exchange.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-3 rounded-full transition-all" style={{ width: `${exchange.progress}%` }}></div>
                </div>
                <p className="text-sm text-gray-500">{exchange.sessionsCompleted} of {exchange.totalSessions} sessions completed</p>
              </div>

              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-violet-600" /> Next Session
                </h3>
                {exchange.nextSession || upcomingSession ? (
                  <div className="space-y-2">
                    <p className="text-gray-800 font-medium">{exchange.nextSession || `${upcomingSession.date} at ${upcomingSession.time}`}</p>
                    {upcomingSession?.topic && <p className="text-sm text-gray-600">Topic: {upcomingSession.topic}</p>}
                    {upcomingSession?.meetLink && (
                      <a href={upcomingSession.meetLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800 font-medium">
                        <Video className="w-4 h-4" /> Join Google Meet <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No session scheduled yet.</p>
                )}
                {!isComplete && (
                  <button onClick={handleScheduleOpen} className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition">
                    Schedule Next Session
                  </button>
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4">Session History</h3>
                {completedSessions.length === 0 ? (
                  <p className="text-sm text-gray-500">No completed sessions yet.</p>
                ) : (
                  <div className="space-y-3">
                    {completedSessions.map(session => (
                      <div key={session.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">{session.topic}</p>
                          <p className="text-xs text-gray-500">{session.date} at {session.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <form onSubmit={handleAddResource} className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                <h3 className="font-bold text-gray-900">Add Resource</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Title" value={resourceForm.title} onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })} className="p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none" />
                  <input type="url" placeholder="URL" value={resourceForm.url} onChange={e => setResourceForm({ ...resourceForm, url: e.target.value })} className="p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none" />
                  <select value={resourceForm.type} onChange={e => setResourceForm({ ...resourceForm, type: e.target.value })} className="p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none">
                    {['Video', 'Article', 'Document', 'Tool'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button type="submit" className="py-2.5 bg-violet-600 text-white rounded-lg text-sm font-bold hover:bg-violet-700 transition">Add Resource</button>
                </div>
              </form>

              <div className="grid sm:grid-cols-2 gap-4">
                {(exchange.resources || []).length === 0 ? (
                  <p className="text-sm text-gray-500 col-span-2">No resources shared yet. Add links to help your partner learn!</p>
                ) : (
                  exchange.resources.map(resource => {
                    const Icon = RESOURCE_ICONS[resource.type] || Link2;
                    return (
                      <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition group">
                        <div className="p-2 bg-violet-50 rounded-lg text-violet-600"><Icon className="w-5 h-5" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 group-hover:text-violet-600 truncate">{resource.title}</p>
                          <p className="text-xs text-gray-500 truncate">{resource.url}</p>
                          <p className="text-xs text-violet-600 mt-1">Added by {resource.addedBy?.name}</p>
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-[450px]">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">No messages yet. Say hello!</p>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.senderId === user?.id;
                    const sender = msg.senderId === exchange.user1Id ? exchange.user1 : exchange.user2;
                    return (
                      <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isMe && <img src={sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.username}`} className="w-8 h-8 rounded-full flex-shrink-0" alt="" />}
                        <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm' : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm'}`}>
                            {msg.text}
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1">{formatTime(msg.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              {!isComplete && (
                <div className="flex gap-2 pt-4 border-t border-gray-100 mt-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                  <button onClick={handleSendMessage} className="p-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-md transition">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && isComplete && (
            <div className="max-w-md mx-auto space-y-6">
              {reviewSubmitted || exchange.reviews?.some(r => r.authorId === user?.id) ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="font-bold text-gray-900">Thank you for your review!</p>
                  <p className="text-sm text-gray-500 mt-1">Your feedback helps build trust in the community.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-gray-900 text-lg">Rate your experience with {partner?.name}</h3>
                  <div className="flex gap-1 justify-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })} className="p-1">
                        <Star className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows="4"
                    placeholder={`Share your experience learning ${getTheirSkill()}...`}
                    value={reviewForm.text}
                    onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                  />
                  <button
                    onClick={handleSubmitReview}
                    disabled={actionLoading || !reviewForm.text.trim()}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold disabled:opacity-50"
                  >
                    {actionLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Action Bar */}
      {!isComplete && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleMarkComplete}
              disabled={actionLoading || exchange.sessionsCompleted >= exchange.totalSessions}
              className="flex-1 sm:flex-none px-6 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl font-bold hover:bg-green-100 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" /> Mark Session Complete
            </button>
            <button
              onClick={handleEndExchange}
              disabled={actionLoading}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition disabled:opacity-50"
            >
              End Exchange
            </button>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Schedule Next Session</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={scheduleForm.date} onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input type="time" value={scheduleForm.time} onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <input type="text" placeholder="e.g. React Hooks deep dive" value={scheduleForm.topic} onChange={e => setScheduleForm({ ...scheduleForm, topic: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Meet Link</label>
                <div className="flex gap-2">
                  <input type="text" readOnly value={scheduleForm.meetLink} className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 text-gray-600" />
                  <button type="button" onClick={() => setScheduleForm({ ...scheduleForm, meetLink: generateMeetLink() })} className="px-3 py-2 text-xs font-bold bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200">Regenerate</button>
                </div>
              </div>
              <button onClick={handleScheduleSave} disabled={actionLoading || !scheduleForm.date || !scheduleForm.time || !scheduleForm.topic} className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold disabled:opacity-50">
                {actionLoading ? 'Saving...' : 'Save Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeDetail;
