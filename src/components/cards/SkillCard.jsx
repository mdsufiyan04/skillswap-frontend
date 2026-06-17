import React from 'react';

const SkillCard = () => {
  return (
    <div className="p-8 bg-white rounded-2xl border border-gray-200 hover:border-black transition-colors">
      <h3 className="text-lg font-semibold text-apple-black">React Development</h3>
      <p className="text-sm text-apple-gray mt-2">Learn components, hooks, routing, and context API.</p>
    </div>
  );
};

export default SkillCard;
