import React, { useState } from 'react';
import { Paperclip, Send, MoreVertical, Search, ArrowLeft } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { currentUser, activeExchanges, messages } from '../data/dummyData';

const Chat = () => {
  const [activeChat, setActiveChat] = useState(activeExchanges[0]);
  const [newMessage, setNewMessage] = useState('');
  const [isMobileList, setIsMobileList] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex gap-6 h-[calc(100vh-64px)]">
        
        {/* Left Sidebar - Active Chats */}
        <div className={`w-full md:w-1/3 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col ${!isMobileList && 'hidden md:flex'}`}>
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search chats..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {activeExchanges.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => { setActiveChat(chat); setIsMobileList(false); }}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors ${activeChat?.id === chat.id ? 'bg-violet-50 border border-violet-100' : 'hover:bg-gray-50 border border-transparent'}`}
              >
                <img src={chat.user.avatar} className="w-12 h-12 rounded-full border border-gray-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 truncate">{chat.user.name}</h4>
                    <span className="text-[10px] text-gray-400">8:12 PM</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">Sounds great. See you tomorrow at 5!</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Area - Chat Window */}
        <div className={`flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col ${isMobileList && 'hidden md:flex'}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsMobileList(true)} className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <img src={activeChat.user.avatar} className="w-10 h-10 rounded-full" />
                  <div>
                    <h3 className="font-bold text-gray-900">{activeChat.user.name}</h3>
                    <p className="text-xs text-violet-600 font-medium">Exchange: {activeChat.mySkill} ↔ {activeChat.theirSkill}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                <div className="text-center text-xs text-gray-400 my-4">Today</div>
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 mx-1">{msg.time}</span>
                    </div>
                  );
                })}
              </div>

              {/* Input Area */}
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
                    ></textarea>
                  </div>
                  <button className="p-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-gray-300" />
              </div>
              Select a chat to start messaging
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Chat;
