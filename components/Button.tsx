import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  
  const baseStyles = "font-bold rounded-full transition-transform active:scale-95 flex items-center justify-center";
  
  const variants = {
    primary: "bg-[#1db954] text-black hover:bg-[#1ed760] hover:scale-105",
    secondary: "bg-white text-black hover:scale-105",
    ghost: "bg-transparent text-[#b3b3b3] hover:text-white font-semibold",
    icon: "bg-transparent text-[#b3b3b3] hover:text-white p-2"
  };

  const sizes = {
    sm: "px-4 py-1 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-10 py-4 text-lg"
  };

  const finalClass = `${baseStyles} ${variants[variant]} ${variant === 'icon' ? '' : sizes[size]} ${className}`;

  return (
    <button className={finalClass} {...props}>
      {children}
    </button>
  );
};