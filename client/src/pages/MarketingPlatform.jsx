import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import EmailCampaigns from '../components/marketing/EmailCampaigns';
import SocialScheduler from '../components/marketing/SocialScheduler';
import AdManager from '../components/marketing/AdManager';
import AnalyticsDashboard from '../components/marketing/AnalyticsDashboard';
import 'react-tabs/style/react-tabs.css';

const MarketingPlatform = () => {
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1>Autonomous Marketing Platform</h1>
      <Tabs>
        <TabList>
          <Tab>Email Campaigns</Tab>
          <Tab>Social Scheduler</Tab>
          <Tab>Ad Manager</Tab>
          <Tab>Analytics</Tab>
        </TabList>

        <TabPanel>
          <EmailCampaigns />
        </TabPanel>
        <TabPanel>
          <SocialScheduler />
        </TabPanel>
        <TabPanel>
          <AdManager />
        </TabPanel>
        <TabPanel>
          <AnalyticsDashboard />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default MarketingPlatform;
