import React from 'react';
import RevenueTracker from '../components/ownerDashboard/RevenueTracker';
import TargetProgress from '../components/ownerDashboard/TargetProgress';
import ImpulseBuyerMetrics from '../components/ownerDashboard/ImpulseBuyerMetrics';
import AutoScaleIndicator from '../components/ownerDashboard/AutoScaleIndicator';

const OwnerDashboard = () => {
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1>Owner Dashboard</h1>
      <RevenueTracker />
      <TargetProgress />
      <ImpulseBuyerMetrics />
      <AutoScaleIndicator />
    </div>
  );
};
import SARSTaxReminder from '../components/ownerDashboard/SARSTaxReminder';

// Inside the render, add:
<SARSTaxReminder />
