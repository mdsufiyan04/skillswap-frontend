import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = "px-6 py-3 rounded-full font-medium transition-colors focus:outline-none disabled:opacity-50";
  const variants = {
    primary: "bg-black hover:bg-gray-800 text-white",
    secondary: "bg-white hover:bg-gray-50 text-black border border-black",
    danger: 'bg-white hover:bg-apple-bg text-apple-black border border-apple-border'
  };
  
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
