import React from 'react';

const MessageBubble = ({ text = 'Hello!', isMe = false }) => {
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}>
      <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
        isMe 
          ? 'bg-blue-600 text-white rounded-br-none' 
          : 'bg-slate-150 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50'
      }`}>
        {text}
      </div>
    </div>
  );
};

export default MessageBubble;
