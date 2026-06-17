import React from 'react';

const UserCard = () => {
  return (
    <div className="p-8 bg-white rounded-2xl border border-gray-200 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-apple-bg border border-apple-border flex items-center justify-center font-bold text-apple-black">
        JD
      </div>
      <div>
        <h3 className="text-md font-semibold text-apple-black">John Doe</h3>
        <p className="text-xs text-apple-gray">Software Engineer</p>
      </div>
    </div>
  );
};

export default UserCard;
