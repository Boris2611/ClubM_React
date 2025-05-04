import React from 'react';

const VerifiedBadge = ({ className = '' }) => (
  <svg
    className={`inline-block ml-1 w-4 h-4 text-blue-500 ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-label="Verified"
    title="Admin"
  >
    <circle cx="12" cy="12" r="10" fill="#3b82f6" />
    <path
      d="M9.5 12.5l2 2 3-4"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default VerifiedBadge;