import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path 
        d="M64 64H448V344C448 396 384 448 256 448C128 448 64 396 64 344V64Z" 
        fill="#3264B9" 
      />
      <rect x="112" y="112" width="64" height="200" fill="white" />
      <rect x="224" y="112" width="64" height="280" fill="white" />
      <rect x="336" y="112" width="64" height="200" fill="white" />
    </svg>
  );
};

export default Logo;
