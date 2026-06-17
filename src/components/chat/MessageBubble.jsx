import React from 'react';

const MessageBubble = ({ text = 'Hello!', isMe = false }) => {
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}>
      <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
        isMe
          ? 'bg-black text-white rounded-br-none'
          : 'bg-apple-bg text-apple-black rounded-bl-none border border-apple-border'
      }`}>
        {text}
      </div>
    </div>
  );
};

export default MessageBubble;
