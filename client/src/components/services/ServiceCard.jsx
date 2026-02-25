import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div style={{ padding: '1.5rem', border: '1px solid var(--secondary)', borderRadius: '8px', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem' }}>{service.icon}</div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
    </div>
  );
};

export default ServiceCard;
