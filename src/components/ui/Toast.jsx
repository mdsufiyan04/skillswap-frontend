import React from 'react';

const Toast = ({ message, type = 'success' }) => {
  const styles = {
    success: "bg-emerald-500 text-white",
    error: "bg-rose-600 text-white",
    info: "bg-blue-600 text-white"
  };
  
  return (
    <div className={`p-4 rounded-xl shadow-lg flex items-center gap-3 max-w-sm ${styles[type]}`}>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;
