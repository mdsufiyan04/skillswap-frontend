import React from 'react';

const ChatWindow = () => {
  return (
    <div className="flex flex-col h-[600px] border border-apple-border rounded-2xl bg-white overflow-hidden">
      <div className="p-4 border-b border-apple-border flex items-center justify-between">
        <h3 className="font-semibold text-apple-black tracking-tight">Alex Rivera</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-apple-bg">
        {/* Messages placeholder */}
      </div>
      <div className="p-4 border-t border-apple-border flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-full border border-apple-border bg-white text-apple-black text-sm focus:outline-none focus:border-apple-black placeholder-apple-gray"
        />
        <button className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-full text-sm font-medium transition-colors">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
