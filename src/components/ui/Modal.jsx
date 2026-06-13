import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-semibold focus:outline-none"
          >
            &times;
          </button>
        </div>
        <div className="text-slate-600 dark:text-slate-350">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
