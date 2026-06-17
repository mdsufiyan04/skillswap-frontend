import React from 'react';

const Toast = ({ message, type = 'success' }) => {
  const styles = {
    success: 'bg-apple-black text-white',
    error: 'bg-white text-apple-black border-apple-black',
    info: 'bg-apple-bg text-apple-black border-apple-border',
  };

  return (
    <div className={`p-4 rounded-2xl border flex items-center gap-3 max-w-sm ${styles[type]}`}>
      <span className="text-sm font-medium tracking-tight">{message}</span>
    </div>
  );
};

export default Toast;
