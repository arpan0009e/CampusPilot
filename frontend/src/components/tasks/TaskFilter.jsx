import React from 'react';

export const TaskFilter = ({ filter, setFilter }) => (
  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
    {['All', 'Pending', 'Completed'].map(tab => (
      <button
        key={tab}
        className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => setFilter(tab)}
      >
        {tab}
      </button>
    ))}
  </div>
);
