import React from 'react';

const ReviewCard = () => {
  return (
    <div className="p-8 bg-white rounded-2xl border border-apple-border">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-apple-black tracking-tight">Jane Smith</span>
        <span className="text-apple-black">★★★★★</span>
      </div>
      <p className="text-sm text-apple-gray leading-relaxed">"Great exchange! Really helped me wrap my head around Tailwind CSS configuration."</p>
    </div>
  );
};

export default ReviewCard;
