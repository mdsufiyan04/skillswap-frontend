import React from 'react';

const LoadingSkeleton = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`animate-pulse bg-apple-bg border border-apple-border rounded-md ${className}`}></div>
  );
};

export default LoadingSkeleton;
