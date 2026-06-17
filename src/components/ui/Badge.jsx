import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-tight transition-colors';
  const variants = {
    primary: 'bg-apple-bg text-apple-black border border-apple-border',
    secondary: 'bg-white text-apple-gray border border-apple-border',
    success: 'bg-black text-white',
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
