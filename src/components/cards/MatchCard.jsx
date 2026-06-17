import React from 'react';

const MatchCard = () => {
  return (
    <div className="p-8 bg-white rounded-2xl border border-gray-200">
      <div className="text-xs font-medium uppercase tracking-wider text-apple-gray mb-1">
        95% Match
      </div>
      <h3 className="text-lg font-semibold text-apple-black mb-2">Mutual Exchange</h3>
      <p className="text-sm text-apple-gray">You offer Python; they offer UI/UX Design.</p>
    </div>
  );
};

export default MatchCard;
