import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-apple-border p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-apple-black tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="text-apple-gray hover:text-apple-black text-xl font-semibold focus:outline-none transition-colors"
          >
            &times;
          </button>
        </div>
        <div className="text-apple-gray">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
