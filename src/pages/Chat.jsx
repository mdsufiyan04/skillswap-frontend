import React, { useEffect, useState, useRef } from 'react';
import { Paperclip, Send, Search, ArrowLeft, MessageSquare } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { getMyExchanges, getMessages, sendMessage } from '../api/services';
import { useAuth } from '../context/AuthContext';

const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const Chat = () => {
  const { user } = useAuth();
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobileList, setIsMobileList] = useState(true);
  const messagesEndRef = useRef(null);

  const getPartner = (exchange) => {
    if (!exchange || !user) return null;
    return exchange.user1Id === user.id ? exchange.user2 : exchange.user1;
  };

  useEffect(() => {
    getMyExchanges()
      .then(res => {
        setExchanges(res.data);
        if (res.data.length > 0) setSelectedExchange(res.data[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedExchange) return;
    const fetchMessages = () => {
      getMessages(selectedExchange.id).then(res => setMessages(res.data)).catch(console.error);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedExchange]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedExchange) return;
    try {
      await sendMessage(selectedExchange.id, newMessage);
      setNewMessage('');
      const res = await getMessages(selectedExchange.id);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const partner = selectedExchange ? getPartner(selectedExchange) : null;

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex gap-6 h-[calc(100vh-64px)]">
        <div className={`w-full md:w-1/3 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col ${!isMobileList && 'hidden md:flex'}`}>
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search chats..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {exchanges.length === 0 ? (
              <div className="text-center py-12 px-4 text-gray-500 text-sm">No active exchanges yet</div>
            ) : (
              exchanges.map((exchange) => {
                const chatPartner = getPartner(exchange);
                const mySkill = exchange.user1Id === user?.id ? exchange.user1Skill : exchange.user2Skill;
                const theirSkill = exchange.user1Id === user?.id ? exchange.user2Skill : exchange.user1Skill;
                return (
                  <div
                    key={exchange.id}
                    onClick={() => { setSelectedExchange(exchange); setIsMobileList(false); }}
                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors ${selectedExchange?.id === exchange.id ? 'bg-violet-50 border border-violet-100' : 'hover:bg-gray-50 border border-transparent'}`}
                  >
                    <img src={chatPartner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chatPartner?.username}`} className="w-12 h-12 rounded-full border border-gray-100" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-gray-900 truncate">{chatPartner?.name}</h4>
                      </div>
                      <p className="text-xs text-violet-600 truncate">{mySkill} ↔ {theirSkill}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={`flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col ${isMobileList && 'hidden md:flex'}`}>
          {!selectedExchange ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-gray-300" />
              </div>
              Select a conversation
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsMobileList(true)} className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <img src={partner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.username}`} className="w-10 h-10 rounded-full" alt="" />
                  <div>
                    <h3 className="font-bold text-gray-900">{partner?.name}</h3>
                    <p className="text-xs text-violet-600 font-medium">
                      Exchange: {selectedExchange.user1Id === user?.id ? selectedExchange.user1Skill : selectedExchange.user2Skill} ↔ {selectedExchange.user1Id === user?.id ? selectedExchange.user2Skill : selectedExchange.user1Skill}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    const sender = msg.senderId === selectedExchange.user1Id ? selectedExchange.user1 : selectedExchange.user2;
                    return (
                      <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isMe && (
                          <img src={sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.username}`} className="w-8 h-8 rounded-full flex-shrink-0" alt="" />
                        )}
                        <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'}`}>
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

              <div className="p-4 border-t border-gray-100 bg-white rounded-b-3xl">
                <div className="flex items-end gap-2">
                  <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 flex items-center focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition-all">
                    <textarea
                      placeholder="Type your message..."
                      className="w-full bg-transparent border-none outline-none resize-none max-h-32 text-sm text-gray-700 py-1"
                      rows="1"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    ></textarea>
                  </div>
                  <button onClick={handleSend} className="p-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;
