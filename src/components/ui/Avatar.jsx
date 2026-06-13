import React from 'react';

const Avatar = ({ src, fallback, size = 'md' }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-md"
  };
  
  return (
    <div className={`relative rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 overflow-hidden ${sizes[size]}`}>
      {src ? (
        <img src={src} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        <span>{fallback || 'U'}</span>
      )}
    </div>
  );
};

export default Avatar;
