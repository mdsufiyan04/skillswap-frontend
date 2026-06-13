import React from 'react';

const MatchCard = () => {
  return (
    <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
      <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
        95% Match
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Mutual Exchange</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">You offer Python; they offer UI/UX Design.</p>
    </div>
  );
};

export default MatchCard;
