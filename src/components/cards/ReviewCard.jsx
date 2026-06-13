import React from 'react';

const ReviewCard = () => {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-slate-800 dark:text-slate-200">Jane Smith</span>
        <span className="text-yellow-500">★★★★★</span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">"Great exchange! Really helped me wrap my head around Tailwind CSS configuration."</p>
    </div>
  );
};

export default ReviewCard;
