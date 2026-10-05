import React from 'react';

export const Button = ({ children, variant = 'primary', size = '', className = '', ...props }) => {
  const btnClass = `btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`;
  return (
    <button className={btnClass} {...props}>
      {children}
    </button>
  );
};
