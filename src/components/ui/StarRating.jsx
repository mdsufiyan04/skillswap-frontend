import React from 'react';

const StarRating = ({ rating = 0, max = 5 }) => {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span 
          key={i} 
          className={`text-lg ${i < Math.round(rating) ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
