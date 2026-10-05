import React from 'react';

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className="input-field" {...props} />
      {error && <span style={{ color: '#f43f5e', fontSize: '0.8rem', marginTop: '0.2rem' }}>{error}</span>}
    </div>
  );
};
