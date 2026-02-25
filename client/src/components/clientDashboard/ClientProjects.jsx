import React from 'react';
import { useGetClientProjectsQuery } from '../../store/api/designApi';

const ClientProjects = () => {
  const { data: projects } = useGetClientProjectsQuery();
  return (
    <div className="card">
      <h2>My Design Projects</h2>
      {projects?.map(p => (
        <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <img src={p.previewUrl} alt={p.name} width="80" />
          <div>
            <h3>{p.name}</h3>
            <p>Status: {p.status}</p>
            <p>Last updated: {new Date(p.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
