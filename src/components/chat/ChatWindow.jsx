import React from 'react';

const ChatWindow = () => {
  return (
    <div className="flex flex-col h-[600px] border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-semibold text-slate-950 dark:text-white">Alex Rivera</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/55 dark:bg-slate-950/20">
        {/* Messages placeholder */}
      </div>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
        <input 
          type="text" 
          placeholder="Type your message..." 
          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-sm focus:outline-none"
        />
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
