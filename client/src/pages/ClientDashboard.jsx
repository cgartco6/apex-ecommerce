import React from 'react';
import ClientProjects from '../components/clientDashboard/ClientProjects';
import DesignApprovals from '../components/clientDashboard/DesignApprovals';
import CampaignStatus from '../components/clientDashboard/CampaignStatus';

const ClientDashboard = () => {
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1>My Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <ClientProjects />
        <DesignApprovals />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <CampaignStatus />
      </div>
    </div>
  );
};

export default ClientDashboard;
