import React from 'react';
import StrategicIntelligence from '../components/ai/StrategicIntelligence';
import CreativeDirector from '../components/ai/CreativeDirector';
import CrisisPredictor from '../components/ai/CrisisPredictor';
import BizDevAgent from '../components/ai/BizDevAgent';
import PricingOptimizer from '../components/ai/PricingOptimizer';
import ComplianceMonitor from '../components/ai/ComplianceMonitor';
import AGIStatus from '../components/ai/AGIStatus';

const AIControlRoom = () => {
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1>AI Control Room</h1>
      <AGIStatus />
      <div style={{ display: 'grid', gap: '2rem' }}>
        <StrategicIntelligence />
        <CreativeDirector />
        <CrisisPredictor />
        <BizDevAgent />
        <PricingOptimizer />
        <ComplianceMonitor />
      </div>
    </div>
  );
};
