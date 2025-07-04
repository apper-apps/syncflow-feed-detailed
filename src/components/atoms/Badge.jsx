import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  icon = null,
  pulse = false,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    running: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    disabled: 'bg-gray-100 text-gray-500'
  };
  
  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-0.5 text-xs',
    large: 'px-3 py-1 text-sm'
  };
  
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();

  return (
    <span className={classes}>
      {icon && (
        <ApperIcon 
          name={icon} 
          className={`w-3 h-3 mr-1 ${pulse ? 'pulse-dot' : ''}`} 
        />
      )}
      {pulse && !icon && (
        <span className="pulse-dot mr-1"></span>
      )}
      {children}
    </span>
  );
};

export default Badge;