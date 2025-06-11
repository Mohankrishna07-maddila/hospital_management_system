import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
}) => {
  const baseStyles = 'rounded-lg bg-white';
  
  const variants = {
    default: 'shadow-soft',
    elevated: 'shadow-lg',
    bordered: 'border border-secondary-200',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`
      ${baseStyles}
      ${variants[variant]}
      ${paddings[padding]}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card; 