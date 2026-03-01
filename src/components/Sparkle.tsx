import React from 'react';

const Sparkle: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute pointer-events-none animate-sparkle ${className}`}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="currentColor" />
    </svg>
  </div>
);

export default Sparkle;
