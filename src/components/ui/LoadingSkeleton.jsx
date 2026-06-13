import React from 'react';

const LoadingSkeleton = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`}></div>
  );
};

export default LoadingSkeleton;
