
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 120 }) => {
  return (
    <img 
      src="https://xjllcclxkffrpdnbttmj.supabase.co/storage/v1/object/public/branding/WANZCORP%20copie2.png" 
      alt="WANZCORP Logo"
      className={className}
      style={{ 
        height: size, 
        width: 'auto',
        display: 'block',
        objectFit: 'contain'
      }}
    />
  );
};

export default Logo;
