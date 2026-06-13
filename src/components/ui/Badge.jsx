import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors";
  const variants = {
    primary: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300",
    success: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
  };
  
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
