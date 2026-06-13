import React from 'react';

const SkillCard = () => {
  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">React Development</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Learn components, hooks, routing, and context API.</p>
    </div>
  );
};

export default SkillCard;
