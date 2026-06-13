import React from 'react';

const UserCard = () => {
  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600">
        JD
      </div>
      <div>
        <h3 className="text-md font-semibold text-slate-900 dark:text-white">John Doe</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Software Engineer</p>
      </div>
    </div>
  );
};

export default UserCard;
