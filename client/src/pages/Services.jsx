import React from 'react';
import ServicesList from '../components/services/ServicesList';

const servicesData = [
  {
    id: 1,
    title: 'Web Development',
    description: 'Custom websites, e-commerce platforms, and CMS integration.',
    icon: '🌐',
  },
  {
    id: 2,
    title: 'Digital Marketing',
    description: 'SEO, social media management, PPC advertising, email campaigns.',
    icon: '📈',
  },
  {
    id: 3,
    title: 'Branding',
    description: 'Logo design, brand strategy, visual identity.',
    icon: '🎨',
  },
  {
    id: 4,
    title: 'Content Creation',
    description: 'Copywriting, graphic design, video production.',
    icon: '✍️',
  },
  {
    id: 5,
    title: 'Analytics',
    description: 'Traffic tracking, reporting, data insights.',
    icon: '📊',
  },
];

const Services = () => {
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1>Our Services</h1>
      <ServicesList services={servicesData} />
    </div>
  );
};

export default Services;
